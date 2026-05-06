"""
database/tracker.py
────────────────────
ProgressTracker – per-user, real-time workout data tracking.
All reads and writes go to the Aiven PostgreSQL database via connection.py.
"""

from psycopg2.extras import RealDictCursor
from .connection import get_connection


class ProgressTracker:
    """Tracks workout progress for individual users in real-time."""

    # ------------------------------------------------------------------ #
    #  Internal helpers                                                    #
    # ------------------------------------------------------------------ #
    def _conn(self):
        return get_connection()

    # ------------------------------------------------------------------ #
    #  User management                                                     #
    # ------------------------------------------------------------------ #
    def ensure_user(self, user_id, full_name=None, email=None):
        """Register user if not already present (idempotent)."""
        conn = self._conn()
        cur = conn.cursor()
        try:
            cur.execute("""
                INSERT INTO users (user_id, full_name, email)
                VALUES (%s, %s, %s)
                ON CONFLICT (user_id) DO NOTHING
            """, (user_id, full_name, email))
            conn.commit()
        finally:
            cur.close()
            conn.close()

    # ------------------------------------------------------------------ #
    #  Active session management (live state)                             #
    # ------------------------------------------------------------------ #
    def start_active_session(self, user_id, exercise_type):
        conn = self._conn()
        cur = conn.cursor()
        try:
            self.ensure_user(user_id)
            cur.execute("""
                INSERT INTO active_sessions (user_id, exercise_type, started_at, current_reps, updated_at)
                VALUES (%s, %s, NOW(), 0, NOW())
                ON CONFLICT (user_id) DO UPDATE
                    SET exercise_type = EXCLUDED.exercise_type,
                        started_at    = NOW(),
                        current_reps  = 0,
                        updated_at    = NOW()
            """, (user_id, exercise_type))
            conn.commit()
        finally:
            cur.close()
            conn.close()

    def update_active_session_reps(self, user_id, current_reps):
        conn = self._conn()
        cur = conn.cursor()
        try:
            cur.execute("""
                UPDATE active_sessions
                   SET current_reps = %s, updated_at = NOW()
                 WHERE user_id = %s
            """, (current_reps, user_id))
            conn.commit()
        finally:
            cur.close()
            conn.close()

    def end_active_session(self, user_id):
        conn = self._conn()
        cur = conn.cursor()
        try:
            cur.execute("DELETE FROM active_sessions WHERE user_id = %s", (user_id,))
            conn.commit()
        finally:
            cur.close()
            conn.close()

    # ------------------------------------------------------------------ #
    #  Save completed workout                                              #
    # ------------------------------------------------------------------ #
    def save_workout(self, user_id, exercise_type, repetitions, duration, notes=""):
        self.ensure_user(user_id)
        calories = round(repetitions * 0.5, 2)
        conn = self._conn()
        cur = conn.cursor()
        try:
            cur.execute("""
                INSERT INTO workouts (user_id, exercise_type, repetitions, duration, calories, notes)
                VALUES (%s, %s, %s, %s, %s, %s)
                RETURNING id
            """, (user_id, exercise_type, repetitions, duration, calories, notes))
            workout_id = cur.fetchone()[0]

            # Auto-update personal best
            cur.execute("""
                INSERT INTO personal_bests (user_id, exercise_type, best_reps, best_duration)
                VALUES (%s, %s, %s, %s)
                ON CONFLICT (user_id, exercise_type) DO UPDATE
                    SET best_reps     = GREATEST(personal_bests.best_reps,     EXCLUDED.best_reps),
                        best_duration = GREATEST(personal_bests.best_duration,  EXCLUDED.best_duration),
                        achieved_at   = CASE
                            WHEN EXCLUDED.best_reps > personal_bests.best_reps THEN NOW()
                            ELSE personal_bests.achieved_at
                        END
            """, (user_id, exercise_type, repetitions, duration))

            conn.commit()
        finally:
            cur.close()
            conn.close()
        self.end_active_session(user_id)
        return workout_id

    # ------------------------------------------------------------------ #
    #  Real-time: log a single rep                                         #
    # ------------------------------------------------------------------ #
    def log_rep(self, user_id, exercise_type, rep_number, workout_id=None):
        conn = self._conn()
        cur = conn.cursor()
        try:
            cur.execute("""
                INSERT INTO live_reps (user_id, workout_id, exercise_type, rep_number)
                VALUES (%s, %s, %s, %s)
            """, (user_id, workout_id, exercise_type, rep_number))
            conn.commit()
        finally:
            cur.close()
            conn.close()
        self.update_active_session_reps(user_id, rep_number)

    # ------------------------------------------------------------------ #
    #  Real-time: log a form error                                         #
    # ------------------------------------------------------------------ #
    def log_form_error(self, user_id, error_type, message, severity="warning", workout_id=None):
        conn = self._conn()
        cur = conn.cursor()
        try:
            cur.execute("""
                INSERT INTO form_errors (user_id, workout_id, error_type, severity, message)
                VALUES (%s, %s, %s, %s, %s)
            """, (user_id, workout_id, error_type, severity, message))
            conn.commit()
        finally:
            cur.close()
            conn.close()


    # ------------------------------------------------------------------ #
    #  Read: workout history                                               #
    # ------------------------------------------------------------------ #
    def get_workout_history(self, user_id=None, exercise_type=None, limit=10):
        conn = self._conn()
        cur = conn.cursor(cursor_factory=RealDictCursor)
        try:
            q = "SELECT * FROM workouts WHERE 1=1"
            p = []
            if user_id:
                q += " AND user_id = %s"; p.append(user_id)
            if exercise_type:
                q += " AND exercise_type = %s"; p.append(exercise_type)
            q += " ORDER BY completed_at DESC LIMIT %s"; p.append(limit)
            cur.execute(q, tuple(p))
            rows = [dict(r) for r in cur.fetchall()]
        finally:
            cur.close()
            conn.close()
        return rows

    # ------------------------------------------------------------------ #
    #  Read: total stats                                                   #
    # ------------------------------------------------------------------ #
    def get_total_stats(self, user_id=None):
        conn = self._conn()
        cur = conn.cursor()
        try:
            q = """
                SELECT COUNT(*),
                       COALESCE(SUM(repetitions), 0),
                       COALESCE(SUM(duration), 0),
                       COUNT(DISTINCT exercise_type),
                       COALESCE(SUM(calories), 0)
                FROM workouts WHERE 1=1
            """
            p = []
            if user_id:
                q += " AND user_id = %s"; p.append(user_id)
            cur.execute(q, tuple(p))
            r = cur.fetchone()
        finally:
            cur.close()
            conn.close()
        return {
            "total_workouts": int(r[0]),
            "total_reps":     int(r[1]),
            "total_duration": int(r[2]),
            "exercise_types": int(r[3]),
            "total_calories": float(r[4])
        }

    # ------------------------------------------------------------------ #
    #  Read: exercise stats                                                #
    # ------------------------------------------------------------------ #
    def get_exercise_stats(self, exercise_type, user_id=None):
        conn = self._conn()
        cur = conn.cursor()
        try:
            q = """
                SELECT COUNT(*),
                       COALESCE(SUM(repetitions), 0),
                       COALESCE(AVG(repetitions), 0),
                       COALESCE(MAX(repetitions), 0),
                       COALESCE(SUM(duration), 0)
                FROM workouts WHERE exercise_type = %s
            """
            p = [exercise_type]
            if user_id:
                q += " AND user_id = %s"; p.append(user_id)
            cur.execute(q, tuple(p))
            r = cur.fetchone()
        finally:
            cur.close()
            conn.close()
        return {
            "exercise_type":  exercise_type,
            "sessions":       int(r[0]),
            "total_reps":     int(r[1]),
            "avg_reps":       round(float(r[2]), 1),
            "max_reps":       int(r[3]),
            "total_duration": int(r[4])
        }

    # ------------------------------------------------------------------ #
    #  Read: recent daily progress                                         #
    # ------------------------------------------------------------------ #
    def get_recent_progress(self, exercise_type, user_id=None, days=7):
        conn = self._conn()
        cur = conn.cursor(cursor_factory=RealDictCursor)
        try:
            q = """
                SELECT DATE(completed_at) AS date,
                       SUM(repetitions)   AS daily_reps,
                       COUNT(*)           AS daily_sessions
                FROM workouts
                WHERE exercise_type = %s
            """
            p = [exercise_type]
            if user_id:
                q += " AND user_id = %s"; p.append(user_id)
            q += " AND completed_at >= CURRENT_DATE - (%s || ' days')::INTERVAL GROUP BY DATE(completed_at) ORDER BY date DESC"
            p.append(days)
            cur.execute(q, tuple(p))
            rows = [dict(r) for r in cur.fetchall()]
            for r in rows:
                if r.get('date'):
                    r['date'] = r['date'].strftime('%Y-%m-%d')
        finally:
            cur.close()
            conn.close()
        return rows

    # ------------------------------------------------------------------ #
    #  Read: personal best                                                 #
    # ------------------------------------------------------------------ #
    def get_personal_best(self, exercise_type, user_id=None):
        conn = self._conn()
        cur = conn.cursor(cursor_factory=RealDictCursor)
        try:
            q = "SELECT * FROM workouts WHERE exercise_type = %s"
            p = [exercise_type]
            if user_id:
                q += " AND user_id = %s"; p.append(user_id)
            q += " ORDER BY repetitions DESC LIMIT 1"
            cur.execute(q, tuple(p))
            r = cur.fetchone()
        finally:
            cur.close()
            conn.close()
        return dict(r) if r else None

    # ------------------------------------------------------------------ #
    #  Read: streaks (gamification)                                        #
    # ------------------------------------------------------------------ #
    def get_streaks(self, user_id=None):
        conn = self._conn()
        cur = conn.cursor()
        try:

            clause = " WHERE user_id = %s" if user_id else ""
            p = (user_id,) if user_id else ()

            cur.execute(f"SELECT DISTINCT DATE(completed_at) FROM workouts{clause} ORDER BY DATE(completed_at) DESC", p)
            dates = [r[0] for r in cur.fetchall()]
        finally:
            cur.close()
            conn.close()
        
        if not dates:
            return {"current": 0, "longest": 0}
            
        from datetime import date
        
        # Calculate longest streak
        temp_streak = 1
        max_streak = 1
        for i in range(1, len(dates)):
            if (dates[i-1] - dates[i]).days == 1:
                temp_streak += 1
            else:
                max_streak = max(max_streak, temp_streak)
                temp_streak = 1
        max_streak = max(max_streak, temp_streak)
        
        # Calculate current streak
        current_streak = 0
        today = date.today()
        # A streak is active if the latest workout was today or yesterday
        if (today - dates[0]).days <= 1:
            current_streak = 1
            for i in range(1, len(dates)):
                if (dates[i-1] - dates[i]).days == 1:
                    current_streak += 1
                else:
                    break
                    
        return {"current": current_streak, "longest": max_streak}

    # ------------------------------------------------------------------ #
    #  Read: achievements                                                  #
    # ------------------------------------------------------------------ #
    def get_achievements(self, user_id=None):
        conn = self._conn()
        cur = conn.cursor()
        try:
            clause = " WHERE user_id = %s" if user_id else ""
            p = (user_id,) if user_id else ()

            cur.execute(f"SELECT COUNT(*) FROM workouts{clause}", p)
            total_workouts = cur.fetchone()[0] or 0

            cur.execute(f"SELECT COALESCE(SUM(repetitions),0) FROM workouts{clause}", p)
            total_reps = cur.fetchone()[0] or 0

            cur.execute(f"SELECT COUNT(DISTINCT DATE(completed_at)) FROM workouts{clause}", p)
            distinct_days = cur.fetchone()[0] or 0

        finally:
            cur.close()
            conn.close()
            
        streaks = self.get_streaks(user_id)
        current_streak = streaks['current']
        longest_streak = streaks['longest']

        return [
            {"id": "first_steps",  "title": "First Steps",     "description": "Complete 5 workouts",
             "points": 50,  "earned": total_workouts >= 5, "icon": "ri-run-line",
             "progress": min(int(total_workouts), 5),   "total": 5},
            {"id": "iron_man",     "title": "Iron Man",         "description": "Complete 500 total reps",
             "points": 100, "earned": total_reps >= 500,    "icon": "ri-weight-line",
             "progress": min(int(total_reps), 500),         "total": 500},
            {"id": "consistency",  "title": "Consistency King", "description": "Work out on 3 distinct days",
             "points": 150, "earned": distinct_days >= 3,   "icon": "ri-calendar-check-line",
             "progress": min(int(distinct_days), 3),         "total": 3},
            {"id": "streak_3", "title": "3-Day Streak", "description": "Maintain a 3-day workout streak",
             "points": 100, "earned": longest_streak >= 3, "icon": "ri-fire-fill",
             "progress": min(int(longest_streak), 3), "total": 3},
            {"id": "workout_warrior", "title": "Workout Warrior", "description": "Complete 50 workouts",
             "points": 200, "earned": total_workouts >= 50, "icon": "ri-sword-line",
             "progress": min(int(total_workouts), 50), "total": 50},
            {"id": "streak_7", "title": "1-Week Streak", "description": "Maintain a 7-day workout streak",
             "points": 300, "earned": longest_streak >= 7, "icon": "ri-vip-crown-fill",
             "progress": min(int(longest_streak), 7), "total": 7},
            {"id": "rep_master", "title": "Rep Master", "description": "Complete 5000 total reps",
             "points": 250, "earned": total_reps >= 5000, "icon": "ri-fire-line",
             "progress": min(int(total_reps), 5000), "total": 5000},
            {"id": "dedication", "title": "Pure Dedication", "description": "Work out on 30 distinct days",
             "points": 300, "earned": distinct_days >= 30, "icon": "ri-medal-line",
             "progress": min(int(distinct_days), 30), "total": 30},
            {"id": "streak_30", "title": "Month of Fire", "description": "Maintain a 30-day workout streak",
             "points": 1000, "earned": longest_streak >= 30, "icon": "ri-gem-fill",
             "progress": min(int(longest_streak), 30), "total": 30},
        ]

    # ------------------------------------------------------------------ #
    #  Read: exercise improvements                                         #
    # ------------------------------------------------------------------ #
    def get_exercise_improvements(self, user_id=None):
        conn = self._conn()
        cur = conn.cursor()
        try:
            clause = " WHERE user_id = %s" if user_id else ""
            p = (user_id,) if user_id else ()
            cur.execute(f"SELECT DISTINCT exercise_type FROM workouts{clause}", p)
            exercises = [r[0] for r in cur.fetchall()]

            improvements = []
            for ex in exercises:
                q = "SELECT repetitions FROM workouts WHERE exercise_type = %s"
                ep = [ex]
                if user_id:
                    q += " AND user_id = %s"; ep.append(user_id)
                q += " ORDER BY completed_at DESC LIMIT 2"
                cur.execute(q, tuple(ep))
                reps = [r[0] for r in cur.fetchall()]
                if reps:
                    improvements.append({"exercise": ex, "improvement": f"avg {round(sum(reps)/len(reps))} reps"})
        finally:
            cur.close()
            conn.close()
        return improvements

    # ------------------------------------------------------------------ #
    #  Read: total errors                                                  #
    # ------------------------------------------------------------------ #
    def get_total_errors(self, user_id=None):
        conn = self._conn()
        cur = conn.cursor()
        try:
            q = "SELECT COUNT(*) FROM form_errors WHERE 1=1"
            p = []
            if user_id:
                q += " AND user_id = %s"; p.append(user_id)
            cur.execute(q, tuple(p))
            count = cur.fetchone()[0] or 0
        finally:
            cur.close()
            conn.close()
        return int(count)

    def get_today_errors(self, user_id=None):
        conn = self._conn()
        cur = conn.cursor()
        try:
            q = "SELECT COUNT(*) FROM form_errors WHERE DATE(logged_at) = CURRENT_DATE"
            p = []
            if user_id:
                q += " AND user_id = %s"; p.append(user_id)
            cur.execute(q, tuple(p))
            count = cur.fetchone()[0] or 0
        finally:
            cur.close()
            conn.close()
        return int(count)

    # ------------------------------------------------------------------ #
    #  Read: errors by workout                                             #
    # ------------------------------------------------------------------ #
    def get_errors_by_workout(self, user_id=None):
        conn = self._conn()
        cur = conn.cursor(cursor_factory=RealDictCursor)
        try:
            q = """
                SELECT w.id as workout_id, w.completed_at as date, w.exercise_type, e.error_type, COUNT(*) as count
                FROM form_errors e
                JOIN workouts w ON e.workout_id = w.id
                WHERE 1=1
            """
            p = []
            if user_id:
                q += " AND e.user_id = %s"; p.append(user_id)

            q += " GROUP BY w.id, w.completed_at, w.exercise_type, e.error_type ORDER BY w.completed_at DESC, w.exercise_type, count DESC"
            cur.execute(q, tuple(p))
            rows = [dict(r) for r in cur.fetchall()]
        finally:
            cur.close()
            conn.close()
        
        # Group by workout_id so there's one record per session
        sessions = {}
        for row in rows:
            wid = row['workout_id']
            if wid not in sessions:
                dt = row.get('date')
                date_str = ''
                if dt:
                    date_str = dt.isoformat()
                    if dt.tzinfo is None:
                        date_str += 'Z'
                        
                sessions[wid] = {
                    "workout_id": wid,
                    "date": date_str,
                    "exercise_type": row['exercise_type'],
                    "total_errors": 0,
                    "error_details": []
                }
            sessions[wid]["total_errors"] += row['count']
            sessions[wid]["error_details"].append({
                "type": row['error_type'],
                "count": row['count']
            })
            
        return list(sessions.values())
    # ------------------------------------------------------------------ #
    #  Read: multi-exercise chart data                                     #
    # ------------------------------------------------------------------ #
    def get_chart_data(self, user_id=None, days=7):
        conn = self._conn()
        cur = conn.cursor(cursor_factory=RealDictCursor)
        try:

            # 1. Query to get daily sum of repetitions for each exercise
            q_workouts = """
                SELECT DATE(completed_at) AS date,
                       exercise_type,
                       SUM(repetitions)   AS total_reps
                FROM workouts
                WHERE completed_at >= CURRENT_DATE - (%s || ' days')::INTERVAL
            """
            p_workouts = [days]
            if user_id:
                q_workouts += " AND user_id = %s"; p_workouts.append(user_id)

            q_workouts += " GROUP BY DATE(completed_at), exercise_type ORDER BY date ASC"

            cur.execute(q_workouts, tuple(p_workouts))
            workout_rows = [dict(r) for r in cur.fetchall()]

            # 2. Query to get daily count of form errors
            q_errors = """
                SELECT DATE(logged_at) AS date,
                       COUNT(*)        AS total_errors
                FROM form_errors
                WHERE logged_at >= CURRENT_DATE - (%s || ' days')::INTERVAL
            """
            p_errors = [days]
            if user_id:
                q_errors += " AND user_id = %s"; p_errors.append(user_id)

            q_errors += " GROUP BY DATE(logged_at) ORDER BY date ASC"

            cur.execute(q_errors, tuple(p_errors))
            error_rows = [dict(r) for r in cur.fetchall()]

        finally:
            cur.close()
            conn.close()
        
        # 3. Pivot logic: convert to [{date: '2026-03-25', 'Squats': 10, 'Errors': 5}, ...]
        name_map = {
            "squat": "Squats",
            "pushup": "Push-ups",
            "curl": "Bicep Curls",
            "shoulder_press": "Shoulder Press"
        }
        pivoted = {}
        
        # Fill with workout data
        for r in workout_rows:
            # Use ISO format for robust matching in frontend
            date_str = r['date'].isoformat()
            if date_str not in pivoted:
                pivoted[date_str] = {"date": date_str}
            
            ex_id = r['exercise_type']
            ex_name = name_map.get(ex_id, ex_id.replace('_', ' ').capitalize())
            pivoted[date_str][ex_name] = int(r['total_reps'])

        # Fill with error data
        for r in error_rows:
            date_str = r['date'].isoformat()
            if date_str not in pivoted:
                pivoted[date_str] = {"date": date_str}
            pivoted[date_str]["Errors"] = int(r['total_errors'])
            
        # Return sorted by date
        return sorted(list(pivoted.values()), key=lambda x: x['date'])
