from abc import ABC, abstractmethod
import numpy as np

class BaseExercise(ABC):
    def __init__(self, pose_detector, thresholds):
        self.pose_detector = pose_detector
        self.thresholds = thresholds
        
    @abstractmethod
    def count_reps(self, landmarks, stage, counter):
        """
        Count repetitions based on landmarks.
        Returns: (counter, stage, feedback_data)
        """
        pass
        
    @abstractmethod
    def check_form(self, landmarks, stage=None, counter=0):
        """
        Analyze form and return list of feedback strings.
        """
        pass
        
    def get_best_side_angle(self, landmarks, right_ids, left_ids):
        """
        Dynamically calculate the angle using the most visible side.
        Avoids tracking errors if the user is facing sideways.
        """
        # Ensure landmarks have visibility data (backward compatibility)
        if len(landmarks) > 0 and len(landmarks[0]) > 4:
            right_vis = sum(landmarks[idx][4] for idx in right_ids) / len(right_ids)
            left_vis = sum(landmarks[idx][4] for idx in left_ids) / len(left_ids)
            
            if left_vis > right_vis and left_vis > 0.5:
                best_ids = left_ids
            else:
                best_ids = right_ids
        else:
            best_ids = right_ids
            
        return self.pose_detector.calculate_angle(landmarks, *best_ids)
