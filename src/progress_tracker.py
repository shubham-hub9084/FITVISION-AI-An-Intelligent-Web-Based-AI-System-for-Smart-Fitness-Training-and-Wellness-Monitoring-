"""
Progress Tracking Module
Stores workout history and provides visualization
"""

import sqlite3
import json
from datetime import datetime
import os


class ProgressTracker:
    """
    Tracks workout progress over time
    Stores data in SQLite database and provides statistics
    """
    
    def __init__(self, db_path="data/workout_history.db"):
        """
        Initialize progress tracker
        
        Args:
            db_path: Path to SQLite database file
        """
        self.db_path = db_path
        self._create_tables()
    
    def _create_tables(self):
        """Create database tables if they don't exist"""
        # Create data directory if it doesn't exist
        os.makedirs(os.path.dirname(self.db_path), exist_ok=True)
        
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()
        
        # Create workouts table
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS workouts (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                exercise_type TEXT NOT NULL,
                repetitions INTEGER NOT NULL,
                duration INTEGER NOT NULL,
                timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
                notes TEXT
            )
        ''')
        
        # Create feedback table
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS feedback_history (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                workout_id INTEGER,
                feedback_type TEXT,
                message TEXT,
                timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (workout_id) REFERENCES workouts (id)
            )
        ''')
        
        conn.commit()
        conn.close()
    
    def save_workout(self, exercise_type, repetitions, duration, notes=""):
        """
        Save workout session to database
        
        Args:
            exercise_type: Type of exercise performed
            repetitions: Number of repetitions completed
            duration: Duration in seconds
            notes: Additional notes
            
        Returns:
            workout_id: ID of saved workout
        """
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()
        
        cursor.execute('''
            INSERT INTO workouts (exercise_type, repetitions, duration, notes)
            VALUES (?, ?, ?, ?)
        ''', (exercise_type, repetitions, duration, notes))
        
        workout_id = cursor.lastrowid
        conn.commit()
        conn.close()
        
        return workout_id
    
    def save_feedback(self, workout_id, feedback_type, message):
        """
        Save feedback for a workout
        
        Args:
            workout_id: ID of the workout
            feedback_type: Type of feedback (correction, safety, etc.)
            message: Feedback message
        """
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()
        
        cursor.execute('''
            INSERT INTO feedback_history (workout_id, feedback_type, message)
            VALUES (?, ?, ?)
        ''', (workout_id, feedback_type, message))
        
        conn.commit()
        conn.close()
    
    def get_workout_history(self, exercise_type=None, limit=10):
        """
        Get workout history
        
        Args:
            exercise_type: Filter by exercise type (optional)
            limit: Maximum number of records to return
            
        Returns:
            list: List of workout records
        """
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()
        
        if exercise_type:
            cursor.execute('''
                SELECT * FROM workouts 
                WHERE exercise_type = ?
                ORDER BY timestamp DESC
                LIMIT ?
            ''', (exercise_type, limit))
        else:
            cursor.execute('''
                SELECT * FROM workouts 
                ORDER BY timestamp DESC
                LIMIT ?
            ''', (limit,))
        
        columns = [description[0] for description in cursor.description]
        results = [dict(zip(columns, row)) for row in cursor.fetchall()]
        
        conn.close()
        return results
    
    def get_total_stats(self):
        """
        Get overall statistics
        
        Returns:
            dict: Total statistics
        """
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()
        
        cursor.execute('''
            SELECT 
                COUNT(*) as total_workouts,
                SUM(repetitions) as total_reps,
                SUM(duration) as total_duration,
                COUNT(DISTINCT exercise_type) as exercise_types
            FROM workouts
        ''')
        
        result = cursor.fetchone()
        stats = {
            "total_workouts": result[0] or 0,
            "total_reps": result[1] or 0,
            "total_duration": result[2] or 0,
            "exercise_types": result[3] or 0
        }
        
        conn.close()
        return stats
    
    def get_exercise_stats(self, exercise_type):
        """
        Get statistics for a specific exercise
        
        Args:
            exercise_type: Type of exercise
            
        Returns:
            dict: Exercise statistics
        """
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()
        
        cursor.execute('''
            SELECT 
                COUNT(*) as sessions,
                SUM(repetitions) as total_reps,
                AVG(repetitions) as avg_reps,
                MAX(repetitions) as max_reps,
                SUM(duration) as total_duration
            FROM workouts
            WHERE exercise_type = ?
        ''', (exercise_type,))
        
        result = cursor.fetchone()
        stats = {
            "exercise_type": exercise_type,
            "sessions": result[0] or 0,
            "total_reps": result[1] or 0,
            "avg_reps": round(result[2] or 0, 1),
            "max_reps": result[3] or 0,
            "total_duration": result[4] or 0
        }
        
        conn.close()
        return stats
    
    def get_recent_progress(self, exercise_type, days=7):
        """
        Get progress for recent days
        
        Args:
            exercise_type: Type of exercise
            days: Number of days to look back
            
        Returns:
            list: Daily progress data
        """
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()
        
        cursor.execute('''
            SELECT 
                DATE(timestamp) as date,
                SUM(repetitions) as daily_reps,
                COUNT(*) as daily_sessions
            FROM workouts
            WHERE exercise_type = ?
            AND timestamp >= datetime('now', ? || ' days')
            GROUP BY DATE(timestamp)
            ORDER BY date DESC
        ''', (exercise_type, -days))
        
        columns = [description[0] for description in cursor.description]
        results = [dict(zip(columns, row)) for row in cursor.fetchall()]
        
        conn.close()
        return results
    
    def get_personal_best(self, exercise_type):
        """
        Get personal best for an exercise
        
        Args:
            exercise_type: Type of exercise
            
        Returns:
            dict: Personal best record
        """
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()
        
        cursor.execute('''
            SELECT * FROM workouts
            WHERE exercise_type = ?
            ORDER BY repetitions DESC
            LIMIT 1
        ''', (exercise_type,))
        
        columns = [description[0] for description in cursor.description]
        result = cursor.fetchone()
        
        if result:
            personal_best = dict(zip(columns, result))
        else:
            personal_best = None
        
        conn.close()
        return personal_best
    
    def export_data(self, output_file="data/workout_export.json"):
        """
        Export all data to JSON file
        
        Args:
            output_file: Path to output file
        """
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()
        
        cursor.execute('SELECT * FROM workouts')
        columns = [description[0] for description in cursor.description]
        workouts = [dict(zip(columns, row)) for row in cursor.fetchall()]
        
        with open(output_file, 'w') as f:
            json.dump(workouts, f, indent=2)
        
        conn.close()
        return output_file
    
    def clear_history(self):
        """Clear all workout history (use with caution!)"""
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()
        
        cursor.execute('DELETE FROM feedback_history')
        cursor.execute('DELETE FROM workouts')
        
        conn.commit()
        conn.close()
