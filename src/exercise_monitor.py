"""
Exercise Monitoring Module
Tracks specific exercises and counts repetitions
"""

from pose_detector import PoseDetector


class ExerciseMonitor:
    """
    Monitors exercises and counts repetitions based on pose angles
    Supports squats, pushups, bicep curls, and more
    """
    
    def __init__(self, exercise_type="squat"):
        """
        Initialize exercise monitor
        
        Args:
            exercise_type: Type of exercise to monitor (squat, pushup, curl)
        """
        self.exercise_type = exercise_type.lower()
        self.counter = 0
        self.stage = None  # Track exercise stage (up/down)
        self.pose_detector = PoseDetector()
        
        # Define thresholds for different exercises
        self.thresholds = {
            "squat": {"down": 90, "up": 160},
            "pushup": {"down": 90, "up": 160},
            "curl": {"down": 40, "up": 160},
            "shoulder_press": {"down": 90, "up": 160}
        }
    
    def count_squats(self, landmarks):
        """
        Count squat repetitions
        
        Args:
            landmarks: Body landmarks from pose detector
            
        Returns:
            counter: Number of repetitions
            stage: Current stage (up/down)
        """
        if len(landmarks) > 0:
            # Calculate knee angle (hip-knee-ankle)
            # Landmark IDs: Hip=24, Knee=26, Ankle=28 (right side)
            angle = self.pose_detector.calculate_angle(landmarks, 24, 26, 28)
            
            # Check if going down
            if angle < self.thresholds["squat"]["down"]:
                self.stage = "down"
            
            # Check if coming up
            if angle > self.thresholds["squat"]["up"] and self.stage == "down":
                self.stage = "up"
                self.counter += 1
        
        return self.counter, self.stage
    
    def count_pushups(self, landmarks):
        """
        Count pushup repetitions
        
        Args:
            landmarks: Body landmarks from pose detector
            
        Returns:
            counter: Number of repetitions
            stage: Current stage (up/down)
        """
        if len(landmarks) > 0:
            # Calculate elbow angle (shoulder-elbow-wrist)
            # Landmark IDs: Shoulder=12, Elbow=14, Wrist=16 (right side)
            angle = self.pose_detector.calculate_angle(landmarks, 12, 14, 16)
            
            # Check if going down
            if angle < self.thresholds["pushup"]["down"]:
                self.stage = "down"
            
            # Check if coming up
            if angle > self.thresholds["pushup"]["up"] and self.stage == "down":
                self.stage = "up"
                self.counter += 1
        
        return self.counter, self.stage
    
    def count_curls(self, landmarks):
        """
        Count bicep curl repetitions
        
        Args:
            landmarks: Body landmarks from pose detector
            
        Returns:
            counter: Number of repetitions
            stage: Current stage (up/down)
        """
        if len(landmarks) > 0:
            # Calculate elbow angle (shoulder-elbow-wrist)
            # Landmark IDs: Shoulder=12, Elbow=14, Wrist=16 (right side)
            angle = self.pose_detector.calculate_angle(landmarks, 12, 14, 16)
            
            # Check if curling up
            if angle < self.thresholds["curl"]["down"]:
                self.stage = "up"
            
            # Check if extending down
            if angle > self.thresholds["curl"]["up"] and self.stage == "up":
                self.stage = "down"
                self.counter += 1
        
        return self.counter, self.stage
    
    def count_shoulder_press(self, landmarks):
        """
        Count shoulder press repetitions
        
        Args:
            landmarks: Body landmarks from pose detector
            
        Returns:
            counter: Number of repetitions
            stage: Current stage (up/down)
        """
        if len(landmarks) > 0:
            # Calculate elbow angle (shoulder-elbow-wrist)
            angle = self.pose_detector.calculate_angle(landmarks, 12, 14, 16)
            
            # Check if pressing up
            if angle > self.thresholds["shoulder_press"]["up"]:
                self.stage = "up"
            
            # Check if lowering down
            if angle < self.thresholds["shoulder_press"]["down"] and self.stage == "up":
                self.stage = "down"
                self.counter += 1
        
        return self.counter, self.stage
    
    def monitor_exercise(self, landmarks):
        """
        Monitor the selected exercise type
        
        Args:
            landmarks: Body landmarks from pose detector
            
        Returns:
            counter: Number of repetitions
            stage: Current stage
        """
        if self.exercise_type == "squat":
            return self.count_squats(landmarks)
        elif self.exercise_type == "pushup":
            return self.count_pushups(landmarks)
        elif self.exercise_type == "curl":
            return self.count_curls(landmarks)
        elif self.exercise_type == "shoulder_press":
            return self.count_shoulder_press(landmarks)
        else:
            return self.counter, self.stage
    
    def reset_counter(self):
        """Reset the repetition counter"""
        self.counter = 0
        self.stage = None
    
    def get_stats(self):
        """
        Get current exercise statistics
        
        Returns:
            dict: Statistics including counter, stage, exercise_type
        """
        return {
            "exercise_type": self.exercise_type,
            "repetitions": self.counter,
            "stage": self.stage if self.stage else "ready"
        }
