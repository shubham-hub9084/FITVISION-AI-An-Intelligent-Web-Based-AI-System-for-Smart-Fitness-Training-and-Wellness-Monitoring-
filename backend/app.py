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

# Add src directory to path
sys.path.append(os.path.join(os.path.dirname(__file__), 'src'))

from src.pose_detector import PoseDetector
from src.exercise_monitor import ExerciseMonitor
from src.pose_corrector import PoseCorrector
from src.safety_alerts import SafetyAlerts
from src.progress_tracker import ProgressTracker
from src.coaching_engine import CoachingEngine # [NEW]

app = Flask(__name__)
CORS(app)

# Global variables
camera = None
pose_detector = PoseDetector()
exercise_monitor = None
pose_corrector = None
safety_alerts = SafetyAlerts()
progress_tracker = ProgressTracker()
coaching_engine = CoachingEngine() # [NEW]

# Session state
current_exercise = "squat"
session_start_time = None
session_active = False
current_alerts = [] # [NEW] Global variable for alerts


def get_camera():
    """Initialize and return camera"""
    global camera
    if camera is None or not camera.isOpened():
        camera = cv2.VideoCapture(0)
        camera.set(cv2.CAP_PROP_FRAME_WIDTH, 1280)
        camera.set(cv2.CAP_PROP_FRAME_HEIGHT, 720)
    return camera


def generate_frames():
    """Generate video frames with pose detection and feedback"""
    global exercise_monitor, pose_corrector, session_start_time, session_active, coaching_engine, current_alerts
    
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
        
        if len(landmarks) > 0 and session_active:
            # Monitor exercise
            counter, stage = exercise_monitor.monitor_exercise(landmarks)
            
            # [NEW] Log Reps to Engine
            if counter > last_rep_count:
                coaching_engine.log_rep()
                last_rep_count = counter

            # Get form feedback
            feedback = pose_corrector.analyze_form(landmarks)
            
            # [NEW] Log Feedback to Engine
            coaching_engine.log_feedback(feedback)
            
            # Check safety
            alerts = safety_alerts.perform_safety_check(landmarks)
            current_alerts = alerts # Store globally for API
        

        elif not session_active:
            # Show ready message
            cv2.putText(frame, "Press START to begin workout", 
                       (frame.shape[1]//2 - 300, frame.shape[0]//2),
                       cv2.FONT_HERSHEY_SIMPLEX, 1, (255, 255, 255), 2)
        
        # Encode frame
        ret, buffer = cv2.imencode('.jpg', frame)
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
    """Start workout session"""
    global exercise_monitor, pose_corrector, session_start_time, session_active, current_exercise, coaching_engine
    
    data = request.json
    current_exercise = data.get('exercise', 'squat')
    
    exercise_monitor = ExerciseMonitor(current_exercise)
    pose_corrector = PoseCorrector(current_exercise)
    coaching_engine.start_session(current_exercise) # [NEW] reset engine
    
    session_start_time = time.time()
    session_active = True
    
    return jsonify({
        "status": "success",
        "message": f"Started {current_exercise} session",
        "exercise": current_exercise
    })


@app.route('/api/stop_session', methods=['POST'])
def stop_session():
    """Stop workout session and save progress"""
    global session_start_time, session_active, exercise_monitor, coaching_engine
    
    if not session_active or not exercise_monitor:
        return jsonify({"status": "error", "message": "No active session"})
    
    session_active = False
    duration = int(time.time() - session_start_time)
    stats = exercise_monitor.get_stats()
    
    # Save to database
    workout_id = progress_tracker.save_workout(
        exercise_type=current_exercise,
        repetitions=stats["repetitions"],
        duration=duration
    )
    
    # [NEW] Generate Report
    report = coaching_engine.generate_report()
    
    return jsonify({
        "status": "success",
        "message": "Session saved",
        "workout_id": workout_id,
        "stats": {
            "exercise": current_exercise,
            "repetitions": stats["repetitions"],
            "duration": duration
        },
        "report": report # [NEW] Send report to frontend
    })


@app.route('/api/reset_counter', methods=['POST'])
def reset_counter():
    """Reset exercise counter"""
    global exercise_monitor
    
    if exercise_monitor:
        exercise_monitor.reset_counter()
        return jsonify({"status": "success", "message": "Counter reset"})
    
    return jsonify({"status": "error", "message": "No active session"})


@app.route('/api/current_stats')
def current_stats():
    """Get current session statistics"""
    if not session_active or not exercise_monitor:
        return jsonify({
            "active": False,
            "exercise": current_exercise
        })
    
    stats = exercise_monitor.get_stats()
    duration = int(time.time() - session_start_time) if session_start_time else 0
    
    return jsonify({
        "active": True,
        "exercise": current_exercise,
        "repetitions": stats["repetitions"],
        "stage": stats["stage"],
        "duration": duration,
        "feedback": pose_corrector.feedback if pose_corrector else [],
        "alerts": current_alerts # [NEW] Return alerts to frontend
    })


@app.route('/api/progress')
def get_progress():
    """Get workout progress history"""
    exercise = request.args.get('exercise', None)
    limit = int(request.args.get('limit', 10))
    
    history = progress_tracker.get_workout_history(exercise, limit)
    total_stats = progress_tracker.get_total_stats()
    achievements = progress_tracker.get_achievements()
    improvements = progress_tracker.get_exercise_improvements()
    total_errors = progress_tracker.get_total_errors()
    
    return jsonify({
        "history": history,
        "total_stats": total_stats,
        "achievements": achievements,
        "improvements": improvements,
        "total_errors": total_errors
    })


@app.route('/api/exercise_stats/<exercise_type>')
def get_exercise_stats(exercise_type):
    """Get statistics for specific exercise"""
    stats = progress_tracker.get_exercise_stats(exercise_type)
    recent = progress_tracker.get_recent_progress(exercise_type, days=7)
    personal_best = progress_tracker.get_personal_best(exercise_type)
    
    return jsonify({
        "stats": stats,
        "recent_progress": recent,
        "personal_best": personal_best
    })


@app.route('/dashboard')
def dashboard():
    """Progress dashboard page"""
    return render_template('dashboard.html')


@app.route('/api/exercises')
def get_exercises():
    """Get list of supported exercises"""
    exercises = [
        {"id": "squat", "name": "Squats", "description": "Lower body strength"},
        {"id": "pushup", "name": "Push-ups", "description": "Upper body strength"},
        {"id": "curl", "name": "Bicep Curls", "description": "Arm strength"},
        {"id": "shoulder_press", "name": "Shoulder Press", "description": "Shoulder strength"}
    ]
    return jsonify(exercises)


if __name__ == '__main__':
    print("🏋️ Starting AI Fitness Trainer...")
    print("📱 Open http://localhost:5000 in your browser")
    app.run(debug=True, host='0.0.0.0', port=5000, threaded=True)
