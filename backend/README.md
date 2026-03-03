# 🏋️ AI Fitness Trainer

An intelligent web-based fitness trainer that uses computer vision and AI to provide real-time exercise monitoring, pose correction, progress tracking, and safety alerts during workouts.

## 🌟 Features

### 1. **Real-Time Exercise Monitoring**
- Live video feed from webcam
- Automatic rep counting for multiple exercises
- Stage tracking (up/down positions)
- Support for squats, push-ups, bicep curls, and shoulder press

### 2. **Pose Correction Algorithms**
- Real-time form analysis
- Immediate feedback on posture
- Exercise-specific correction tips
- Joint angle calculations for accuracy

### 3. **Safety Alert System**
- Detects dangerous postures
- Critical alerts for injury prevention
- Balance and alignment monitoring
- Knee, back, shoulder, and neck safety checks

### 4. **Progress Visualization**
- Interactive dashboard
- Workout history tracking
- Personal best records
- Exercise-specific statistics
- Time-based progress charts

## 🚀 Getting Started

### Prerequisites

- Python 3.8 or higher
- Webcam
- Modern web browser (Chrome, Firefox, Edge)

### Installation

1. **Clone or navigate to the project directory:**
   ```bash
   cd ai-fitness-trainer
   ```

2. **Create a virtual environment:**
   ```bash
   # Windows
   python -m venv venv
   venv\Scripts\activate

   # macOS/Linux
   python3 -m venv venv
   source venv/bin/activate
   ```

3. **Install dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

### Running the Application

1. **Start the Flask server:**
   ```bash
   python app.py
   ```

2. **Open your browser:**
   Navigate to `http://localhost:5000`

3. **Allow camera access:**
   Grant permission when prompted by your browser

4. **Start working out!**
   - Select an exercise
   - Click "Start Workout"
   - Follow the on-screen feedback

## 📁 Project Structure

```
ai-fitness-trainer/
├── app.py                      # Flask application (main entry point)
├── requirements.txt            # Python dependencies
├── README.md                   # Project documentation
├── .gitignore                 # Git ignore file
│
├── src/                       # Source code modules
│   ├── pose_detector.py       # MediaPipe pose detection
│   ├── exercise_monitor.py    # Exercise counting logic
│   ├── pose_corrector.py      # Form correction feedback
│   ├── safety_alerts.py       # Safety monitoring system
│   └── progress_tracker.py    # Database and statistics
│
├── templates/                 # HTML templates
│   ├── index.html             # Main workout page
│   └── dashboard.html         # Progress dashboard
│
├── static/                    # Static assets
│   ├── css/
│   │   └── style.css          # Application styles
│   └── js/
│       ├── app.js             # Workout page JavaScript
│       └── dashboard.js       # Dashboard JavaScript
│
├── data/                      # Data storage
│   └── workout_history.db     # SQLite database (auto-created)
│
└── models/                    # ML models (MediaPipe uses pre-trained)
```

## 🎯 How It Works

### 1. Pose Detection
The application uses **MediaPipe Pose** to detect 33 body landmarks in real-time:
- Tracks joint positions (shoulders, elbows, wrists, hips, knees, ankles)
- Calculates angles between joints
- Monitors movement patterns

### 2. Exercise Monitoring
For each exercise type, the system:
- Defines specific joint angle thresholds
- Tracks movement stages (up/down)
- Counts complete repetitions
- Provides real-time feedback

**Example - Squats:**
- Monitors knee angle (hip-knee-ankle)
- Down position: < 90 degrees
- Up position: > 160 degrees
- Counts rep when transitioning from down to up

### 3. Form Correction
The system analyzes:
- Joint alignment
- Body symmetry
- Range of motion
- Common form mistakes

**Feedback Types:**
- ✅ Good form confirmation
- ⚠️ Warning for minor issues
- 🚨 Critical alerts for dangerous positions

### 4. Safety Monitoring
Continuous checks for:
- Back alignment (prevents injury)
- Knee tracking (prevents valgus)
- Shoulder elevation (prevents strain)
- Balance issues (prevents falls)

## 💻 API Endpoints

### Session Management
- `POST /api/start_session` - Start workout session
- `POST /api/stop_session` - Stop and save session
- `POST /api/reset_counter` - Reset rep counter

### Statistics
- `GET /api/current_stats` - Get current session stats
- `GET /api/progress` - Get workout history
- `GET /api/exercise_stats/<type>` - Get exercise-specific stats
- `GET /api/exercises` - List supported exercises

## 🔧 Configuration

### Exercise Thresholds
Modify thresholds in `src/exercise_monitor.py`:

```python
self.thresholds = {
    "squat": {"down": 90, "up": 160},
    "pushup": {"down": 90, "up": 160},
    "curl": {"down": 40, "up": 160},
    "shoulder_press": {"down": 90, "up": 160}
}
```

### Camera Settings
Adjust camera resolution in `app.py`:

```python
camera.set(cv2.CAP_PROP_FRAME_WIDTH, 1280)
camera.set(cv2.CAP_PROP_FRAME_HEIGHT, 720)
```

## 📊 Supported Exercises

| Exercise | Description | Muscles Targeted |
|----------|-------------|------------------|
| **Squats** | Lower body compound movement | Quads, glutes, hamstrings |
| **Push-ups** | Upper body pressing movement | Chest, triceps, shoulders |
| **Bicep Curls** | Arm isolation exercise | Biceps |
| **Shoulder Press** | Overhead pressing movement | Shoulders, triceps |

## 🐛 Troubleshooting

### Camera Not Working
- Check browser permissions
- Ensure no other app is using the camera
- Try a different browser
- Restart the application

### Pose Detection Issues
- Ensure good lighting
- Stand 6-8 feet from camera
- Wear contrasting clothing
- Keep full body in frame

### Performance Issues
- Close other applications
- Reduce camera resolution
- Update graphics drivers
- Use a dedicated GPU if available

## 🔒 Privacy & Data

- **All processing is local** - No data sent to external servers
- Video feed is processed in real-time and not stored
- Only workout statistics (reps, duration) are saved locally
- Database file: `data/workout_history.db`

## 🛠️ Technologies Used

- **Backend:** Flask (Python web framework)
- **Computer Vision:** OpenCV (image processing)
- **AI/ML:** MediaPipe (pose estimation)
- **Database:** SQLite (local storage)
- **Frontend:** HTML5, CSS3, JavaScript (ES6+)
- **Data Processing:** NumPy, Pandas

## 📈 Future Enhancements

- [ ] Add more exercise types
- [ ] Voice feedback for hands-free coaching
- [ ] Mobile app version
- [ ] Social features (share progress)
- [ ] Custom workout routines
- [ ] Integration with fitness trackers
- [ ] Video recording and playback
- [ ] Multi-user support

## 🤝 Contributing

Contributions are welcome! Please feel free to submit pull requests or open issues for bugs and feature requests.

## 📄 License

This project is provided as-is for educational and personal use.

## 👏 Acknowledgments

- **MediaPipe** by Google for pose estimation technology
- **OpenCV** community for computer vision tools
- **Flask** team for the web framework

## 📧 Support

For questions or issues, please open an issue on the project repository.

---

**Stay safe, stay fit! 💪**

Built with ❤️ for fitness enthusiasts everywhere.
