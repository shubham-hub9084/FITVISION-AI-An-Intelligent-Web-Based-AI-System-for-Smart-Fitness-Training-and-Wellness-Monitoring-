from .exercises.squat import Squat
from .exercises.pushup import Pushup
from .exercises.curl import Curl
from .exercises.shoulder_press import ShoulderPress

class ExerciseMonitor:
    def __init__(self, exercise_type="squat"):
        self.exercise_type = exercise_type.lower()
        self.counter = 0
        self.stage = None
        
        # Define thresholds for different exercises
        self.thresholds = {
            "squat": {"down": 100, "up": 150},
            "pushup": {"down": 90, "up": 160},
            "curl": {"down": 40, "up": 160},
            "shoulder_press": {"down": 90, "up": 160}
        }
        
        # We need a pose detector passed in, but the original code instantiated it inside __init__
        # However, app.py passes a global pose_detector usually?
        # Checking app.py: `exercise_monitor = ExerciseMonitor(current_exercise)`
        # It does NOT pass pose_detector. 
        # But wait, original code did `self.pose_detector = PoseDetector()`.
        # AND `count_squats` used `self.pose_detector`.
        # My BaseExercise requires `pose_detector`.
        # So I should instantiate it here or accept it.
        # To match original behavior (self contained), I will instantiate it here.
        
        from src.pose_detector import PoseDetector
        self.pose_detector = PoseDetector()
        
        # Initialize exercise instances
        self.exercises = {
            "squat": Squat(self.pose_detector, self.thresholds),
            "pushup": Pushup(self.pose_detector, self.thresholds),
            "curl": Curl(self.pose_detector, self.thresholds),
            "shoulder_press": ShoulderPress(self.pose_detector, self.thresholds)
        }
        
    def monitor_exercise(self, landmarks):
        """
        Monitor the selected exercise type
        """
        if self.exercise_type not in self.exercises:
            return self.counter, self.stage
            
        self.counter, self.stage = self.exercises[self.exercise_type].count_reps(
            landmarks, self.stage, self.counter
        )
            
        return self.counter, self.stage
    
    def reset_counter(self):
        """Reset the repetition counter"""
        self.counter = 0
        self.stage = None
    
    def get_stats(self):
        """
        Get current exercise statistics
        """
        return {
            "exercise_type": self.exercise_type,
            "repetitions": self.counter,
            "stage": self.stage if self.stage else "ready"
        }
