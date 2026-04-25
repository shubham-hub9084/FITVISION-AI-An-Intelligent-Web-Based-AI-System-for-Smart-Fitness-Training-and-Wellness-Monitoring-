from src.pose_detector import PoseDetector
from .exercises.squat import Squat
from .exercises.pushup import Pushup
from .exercises.curl import Curl
from .exercises.shoulder_press import ShoulderPress

class PoseCorrector:
    def __init__(self, exercise_type="squat"):
        self.exercise_type = exercise_type.lower()
        self.pose_detector = PoseDetector()
        self.feedback = []
        
        self.thresholds = {
            "squat": {"down": 90, "up": 160},
            "pushup": {"down": 90, "up": 150},
            "curl": {"down": 45, "up": 150},
            "shoulder_press": {"down": 90, "up": 160}
        }
        
        if self.exercise_type == "squat":
            self.exercise_logic = Squat(self.pose_detector, self.thresholds)
        elif self.exercise_type == "pushup":
            self.exercise_logic = Pushup(self.pose_detector, self.thresholds)
        elif self.exercise_type == "curl":
            self.exercise_logic = Curl(self.pose_detector, self.thresholds)
        elif self.exercise_type == "shoulder_press":
            self.exercise_logic = ShoulderPress(self.pose_detector, self.thresholds)
        else:
            self.exercise_logic = None

    def analyze_form(self, landmarks, stage=None, counter=0):
        """
        Analyze form for the selected exercise
        """
        self.feedback = []
        if self.exercise_logic:
             self.feedback = self.exercise_logic.check_form(landmarks, stage, counter)
        else:
             self.feedback = ["Exercise type not supported or logic missing"]
        
        return self.feedback

    # Backward compatibility wrappers if needed by app.py
    # app.py calls: pose_corrector.check_squat_form(lm_list) specifically?
    # Let's check app.py usage.
    # In generate_frames:
    # if current_exercise == "squat": pose_corrector.check_squat_form(lm_list)
    # else: pose_corrector.analyze_form(lm_list) ??
    # Actually I should verify app.py calls.
    # Reading app.py is safer.
    
    def check_squat_form(self, landmarks, stage=None, counter=0):
        return self.analyze_form(landmarks, stage, counter)
        
    def check_pushup_form(self, landmarks, stage=None, counter=0):
        return self.analyze_form(landmarks, stage, counter)
        
    def check_curl_form(self, landmarks, stage=None, counter=0):
        return self.analyze_form(landmarks, stage, counter)
        
    def check_shoulder_press_form(self, landmarks, stage=None, counter=0):
        return self.analyze_form(landmarks, stage, counter)

    def get_feedback_summary(self):
        """
        Get summary of current feedback
        """
        if not self.feedback:
            return "Ready to start"
        return " | ".join(self.feedback)
