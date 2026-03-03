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
    def check_form(self, landmarks):
        """
        Analyze form and return list of feedback strings.
        """
        pass
