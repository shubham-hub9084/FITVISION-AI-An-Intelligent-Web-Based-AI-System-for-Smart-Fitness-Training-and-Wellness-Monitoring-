"""
database/setup.py
─────────────────
Creates / resets the FitVision AI database schema on Aiven PostgreSQL.

Run once from the backend directory:
    python -m database.setup
  OR
    python database/setup.py
"""

from .connection import get_connection


def setup_database(drop_existing=False):
    """
    Create all tables required by FitVision AI.

    Args:
        drop_existing: If True, DROP all public tables first (full reset).
                       Default is False – tables are created only if missing.
    """
    conn = get_connection()
    conn.autocommit = False
    cur = conn.cursor()

    try:
        if drop_existing:
            print("⚠️  Dropping all existing public tables...")
            cur.execute("""
                DO $$ DECLARE
                    r RECORD;
                BEGIN
                    FOR r IN (SELECT tablename FROM pg_tables WHERE schemaname = 'public') LOOP
                        EXECUTE 'DROP TABLE IF EXISTS ' || quote_ident(r.tablename) || ' CASCADE';
                    END LOOP;
                END $$;
            """)
            print("✔  Old tables dropped")

        # ── users ──────────────────────────────────────────────────────────── #
        cur.execute("""
            CREATE TABLE IF NOT EXISTS users (
                user_id    TEXT PRIMARY KEY,
                full_name  TEXT,
                email      TEXT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        """)

        # ── workouts ────────────────────────────────────────────────────────── #
        cur.execute("""
            CREATE TABLE IF NOT EXISTS workouts (
                id            SERIAL PRIMARY KEY,
                user_id       TEXT NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
                exercise_type TEXT NOT NULL,
                repetitions   INTEGER      NOT NULL DEFAULT 0,
                duration      INTEGER      NOT NULL DEFAULT 0,   -- seconds
                calories      NUMERIC(8,2)          DEFAULT 0,
                notes         TEXT,
                completed_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        """)

        # ── live_reps ────────────────────────────────────────────────────────── #
        cur.execute("""
            CREATE TABLE IF NOT EXISTS live_reps (
                id            SERIAL PRIMARY KEY,
                user_id       TEXT    NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
                workout_id    INTEGER REFERENCES workouts(id) ON DELETE CASCADE,
                exercise_type TEXT    NOT NULL,
                rep_number    INTEGER NOT NULL,
                logged_at     TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        """)

        # ── form_errors ──────────────────────────────────────────────────────── #
        cur.execute("""
            CREATE TABLE IF NOT EXISTS form_errors (
                id            SERIAL PRIMARY KEY,
                user_id       TEXT    NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
                workout_id    INTEGER REFERENCES workouts(id) ON DELETE CASCADE,
                error_type    TEXT    NOT NULL,
                severity      TEXT    DEFAULT 'warning',
                message       TEXT,
                logged_at     TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        """)

        # ── safety_alerts ────────────────────────────────────────────────────── #
        cur.execute("""
            CREATE TABLE IF NOT EXISTS safety_alerts (
                id         SERIAL PRIMARY KEY,
                user_id    TEXT    NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
                workout_id INTEGER REFERENCES workouts(id) ON DELETE CASCADE,
                alert_type TEXT    NOT NULL,
                message    TEXT,
                logged_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        """)

        # ── feedback_history ─────────────────────────────────────────────────── #
        cur.execute("""
            CREATE TABLE IF NOT EXISTS feedback_history (
                id            SERIAL PRIMARY KEY,
                user_id       TEXT    NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
                workout_id    INTEGER REFERENCES workouts(id) ON DELETE CASCADE,
                feedback_type TEXT,
                message       TEXT,
                logged_at     TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        """)

        # ── personal_bests ───────────────────────────────────────────────────── #
        cur.execute("""
            CREATE TABLE IF NOT EXISTS personal_bests (
                id            SERIAL PRIMARY KEY,
                user_id       TEXT NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
                exercise_type TEXT NOT NULL,
                best_reps     INTEGER      NOT NULL DEFAULT 0,
                best_duration INTEGER      NOT NULL DEFAULT 0,
                achieved_at   TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                UNIQUE(user_id, exercise_type)
            )
        """)

        # ── active_sessions ──────────────────────────────────────────────────── #
        cur.execute("""
            CREATE TABLE IF NOT EXISTS active_sessions (
                user_id       TEXT PRIMARY KEY REFERENCES users(user_id) ON DELETE CASCADE,
                exercise_type TEXT NOT NULL,
                started_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                current_reps  INTEGER   DEFAULT 0,
                updated_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        """)

        # ── indexes ─────────────────────────────────────────────────────────── #
        cur.execute("CREATE INDEX IF NOT EXISTS idx_workouts_user     ON workouts(user_id)")
        cur.execute("CREATE INDEX IF NOT EXISTS idx_workouts_date     ON workouts(completed_at DESC)")
        cur.execute("CREATE INDEX IF NOT EXISTS idx_live_reps_user    ON live_reps(user_id, logged_at DESC)")
        cur.execute("CREATE INDEX IF NOT EXISTS idx_form_errors_user  ON form_errors(user_id, logged_at DESC)")
        cur.execute("CREATE INDEX IF NOT EXISTS idx_feedback_user     ON feedback_history(user_id, logged_at DESC)")

        conn.commit()

        tables = [
            "users", "workouts", "live_reps", "form_errors",
            "safety_alerts", "feedback_history", "personal_bests", "active_sessions"
        ]
        print("✅  FitVision AI schema ready in Aiven PostgreSQL!")
        for t in tables:
            print(f"   • {t}")

    except Exception as exc:
        conn.rollback()
        print(f"❌  Setup failed: {exc}")
        raise
    finally:
        cur.close()
        conn.close()


if __name__ == "__main__":
    # Pass drop_existing=True only to fully reset the DB
    setup_database(drop_existing=False)
