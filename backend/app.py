"""
AI Fitness Trainer - Flask Web Application
Main application file with routes and video streaming
"""

from flask import Flask, render_template, Response, jsonify, request
from flask_cors import CORS
import cv2
import sys
import os
import time
import threading

# Add backend directory to path so both `src` and `database` packages are found
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from src.pose_detector    import PoseDetector
from src.exercise_monitor import ExerciseMonitor
from src.pose_corrector   import PoseCorrector
from src.safety_alerts    import SafetyAlerts
from src.coaching_engine  import CoachingEngine
from database.tracker     import ProgressTracker   # <── new database package

app = Flask(__name__)
CORS(app)

# Global variables - these are shared resources or stateless wrappers
camera = None
pose_detector = PoseDetector()
safety_alerts = SafetyAlerts()
progress_tracker = ProgressTracker()

# Session state - now multi-user aware
# Stores per-user: active status, exercise type, monitors, and coaching engine
user_sessions = {}

def get_camera():
    """Initialize and return camera"""
    global camera
    if camera is None or not camera.isOpened():
        camera = cv2.VideoCapture(0)
        # Lower resolution to drastically reduce processing & encoding overhead
        camera.set(cv2.CAP_PROP_FRAME_WIDTH, 640)
        camera.set(cv2.CAP_PROP_FRAME_HEIGHT, 480)
        camera.set(cv2.CAP_PROP_FPS, 30)
    return camera


def generate_frames():
    """Generate video frames with pose detection and feedback"""
    global user_sessions
    
    last_rep_count = 0 
    
    while True:
        success, frame = get_camera().read()
        if not success:
            break
        
        # Flip frame horizontally for mirror effect
        frame = cv2.flip(frame, 1)
        
        # Detect pose
        frame, results = pose_detector.find_pose(frame, draw=True)
        landmarks = pose_detector.get_position(frame, results, draw=False)
        
        # Identify all active sessions
        active_uids = [uid for uid, s in user_sessions.items() if s.get('active')]
        
        if len(landmarks) > 0 and active_uids:
            # For this single-camera setup, we use the first active session as the primary analyst
            primary_uid = active_uids[0]
            primary_sess = user_sessions[primary_uid]
            
            # Monitor exercise
            counter, stage = primary_sess['monitor'].monitor_exercise(landmarks)
            
            # Rep tracking & sync to DB
            if counter > primary_sess['repetitions']:
                for uid in active_uids:
                    user_sessions[uid]['repetitions'] = counter
                    user_sessions[uid]['engine'].log_rep()
                    # Run DB update in a background thread to prevent stutter during reps
                    # log_rep also calls update_active_session_reps internally
                    threading.Thread(
                        target=progress_tracker.log_rep, 
                        args=(uid, user_sessions[uid]['exercise'], counter), 
                        daemon=True
                    ).start()

            # Form & Safety Analysis
            feedback = primary_sess['corrector'].analyze_form(landmarks, stage=stage, counter=counter)
            alerts = safety_alerts.perform_safety_check(landmarks)
            
            # Sync findings to all active sessions
            for uid in active_uids:
                user_sessions[uid]['feedback'] = feedback
                user_sessions[uid]['alerts'] = alerts
                user_sessions[uid]['stage'] = stage
                user_sessions[uid]['engine'].log_feedback(feedback)

        elif not active_uids:
            # Show ready message when no sessions are active
            cv2.putText(frame, "Press START from Dashboard", 
                       (frame.shape[1]//2 - 250, frame.shape[0]//2),
                       cv2.FONT_HERSHEY_SIMPLEX, 1, (255, 255, 255), 2)
        
        # Encode and stream frame (optimized quality for lower CPU usage)
        encode_param = [int(cv2.IMWRITE_JPEG_QUALITY), 75]
        ret, buffer = cv2.imencode('.jpg', frame, encode_param)
        frame = buffer.tobytes()
        
        yield (b'--frame\r\n'
               b'Content-Type: image/jpeg\r\n\r\n' + frame + b'\r\n')


@app.route('/')
def index():
    """Main page"""
    return render_template('index.html')


@app.route('/video_feed')
def video_feed():
    """Video streaming route"""
    return Response(generate_frames(),
                   mimetype='multipart/x-mixed-replace; boundary=frame')


@app.route('/api/start_session', methods=['POST'])
def start_session():
    """Start workout session for a specific user"""
    global user_sessions
    
    data = request.json or {}
    ex_id = data.get('exercise', 'squat')
    user_id = data.get('user_id', 'anonymous')
    
    # Initialize per-user independent state
    engine = CoachingEngine()
    engine.start_session(ex_id)
    
    user_sessions[user_id] = {
        "active": True,
        "exercise": ex_id,
        "monitor": ExerciseMonitor(ex_id),
        "corrector": PoseCorrector(ex_id),
        "engine": engine,
        "start_time": time.time(),
        "repetitions": 0,
        "stage": "Ready",
        "feedback": ["Ready to start"],
        "alerts": []
    }
    
    # Track in database
    progress_tracker.start_active_session(user_id, ex_id)
    
    return jsonify({
        "status": "success",
        "message": f"Started {ex_id} session for {user_id}",
        "exercise": ex_id,
        "user_id": user_id
    })


@app.route('/api/stop_session', methods=['POST'])
def stop_session():
    """Stop workout session and save progress for a specific user"""
    global user_sessions
    
    data = request.json or {}
    user_id = data.get('user_id', 'anonymous')
    
    sess = user_sessions.get(user_id)
    if not sess or not sess.get('active'):
        return jsonify({"status": "error", "message": "No active session for this user"})
    
    sess['active'] = False
    duration = int(time.time() - sess['start_time'])
    stats = sess['monitor'].get_stats()
    
    # Save workout to DB and clear active session safely
    workout_id = None
    try:
        workout_id = progress_tracker.save_workout(
            user_id=user_id,
            exercise_type=sess['exercise'],
            repetitions=stats["repetitions"],
            duration=duration
        )
        progress_tracker.end_active_session(user_id)
    except Exception as e:
        print(f"Database error during stop_session: {e}")
        # Proceed with generating report even if DB fails so UI doesn't freeze
        
    # Generate final report
    report = sess['engine'].generate_report()
    
    # Save unique form errors found during session
    try:
        unique_errors = set(sess['engine'].session_errors)
        for error_msg in unique_errors:
            # Clean error message for DB storage
            clean_error = error_msg.replace("⚠️ ", "").split(":")[0].strip()
            progress_tracker.log_form_error(
                user_id=user_id,
                workout_id=workout_id,
                error_type=clean_error,
                message=error_msg,
                severity="warning"
            )
    except Exception as e:
        print(f"Error saving session form errors: {e}")

    return jsonify({
        "status": "success",
        "message": "Session saved",
        "workout_id": workout_id,
        "stats": {
            "exercise": sess['exercise'],
            "repetitions": stats["repetitions"],
            "duration": duration
        },
        "report": report
    })


@app.route('/api/reset_counter', methods=['POST'])
def reset_counter():
    """Reset exercise counter for a specific user"""
    data = request.json or {}
    user_id = data.get('user_id', 'anonymous')
    sess = user_sessions.get(user_id)
    
    if sess and sess.get('active'):
        sess['monitor'].reset_counter()
        sess['repetitions'] = 0
        return jsonify({"status": "success", "message": "Counter reset"})
    
    return jsonify({"status": "error", "message": "No active session"})


@app.route('/api/current_stats', methods=['GET'])
def get_current_stats():
    """Get real-time session statistics for a specific user"""
    user_id = request.args.get('user_id', 'anonymous')
    sess = user_sessions.get(user_id)
    
    if sess and sess.get('active'):
        return jsonify({
            "active": True,
            "exercise": sess['exercise'],
            "repetitions": sess['repetitions'],
            "stage": sess.get('stage', 'Ready'),
            "feedback": sess.get('feedback', []),
            "alerts": sess.get('alerts', [])
        })
    
    return jsonify({"active": False})


@app.route('/api/progress')
def get_progress():
    """Get workout progress history and totals for a specific user"""
    user_id = request.args.get('user_id', None)
    exercise = request.args.get('exercise', None)
    limit = int(request.args.get('limit', 10))
    
    history = progress_tracker.get_workout_history(user_id, exercise, limit)
    total_stats = progress_tracker.get_total_stats(user_id)
    achievements = progress_tracker.get_achievements(user_id)
    improvements = progress_tracker.get_exercise_improvements(user_id)
    total_errors = progress_tracker.get_total_errors(user_id)
    today_errors = progress_tracker.get_today_errors(user_id)
    errors_by_workout = progress_tracker.get_errors_by_workout(user_id)
    
    return jsonify({
        "history": history,
        "total_stats": total_stats,
        "achievements": achievements,
        "improvements": improvements,
        "total_errors": total_errors,
        "today_errors": today_errors,
        "errors_by_workout": errors_by_workout
    })


@app.route('/api/chart_data')
def get_chart_data():
    """Get multi-exercise progress data for dashboard charts"""
    user_id = request.args.get('user_id', None)
    days = int(request.args.get('days', 7))
    
    data = progress_tracker.get_chart_data(user_id, days)
    return jsonify(data)


@app.route('/api/exercise_stats/<exercise_type>')
def get_exercise_stats(exercise_type):
    """Get historical statistics for a specific exercise and user"""
    user_id = request.args.get('user_id', None)
    stats = progress_tracker.get_exercise_stats(exercise_type, user_id)
    recent = progress_tracker.get_recent_progress(exercise_type, user_id, days=7)
    personal_best = progress_tracker.get_personal_best(exercise_type, user_id)
    
    return jsonify({
        "stats": stats,
        "recent_progress": recent,
        "personal_best": personal_best
    })


@app.route('/api/exercises')
def get_exercises():
    """Get list of all supported workout types"""
    exercises = [
        {"id": "squat", "name": "Squats", "description": "Lower body strength"},
        {"id": "pushup", "name": "Push-ups", "description": "Upper body strength"},
        {"id": "curl", "name": "Bicep Curls", "description": "Arm strength"},
        {"id": "shoulder_press", "name": "Shoulder Press", "description": "Shoulder strength"}
    ]
    return jsonify(exercises)


if __name__ == '__main__':
    print("🏋️ Starting AI Fitness Trainer Backend...")
    print("📱 Dashboard available at: http://localhost:5000/dashboard")
    app.run(debug=True, host='0.0.0.0', port=5000, threaded=True)
