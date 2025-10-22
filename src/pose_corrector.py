"""
Pose Correction Module
Analyzes exercise form and provides real-time feedback
"""

from pose_detector import PoseDetector


class PoseCorrector:
    """
    Analyzes pose and provides form correction feedback
    Checks alignment, angles, and posture for different exercises
    """
    
    def __init__(self, exercise_type="squat"):
        """
        Initialize pose corrector
        
        Args:
            exercise_type: Type of exercise to correct
        """
        self.exercise_type = exercise_type.lower()
        self.pose_detector = PoseDetector()
        self.feedback = []
    
    def check_squat_form(self, landmarks):
        """
        Check squat form and provide feedback
        
        Args:
            landmarks: Body landmarks
            
        Returns:
            feedback: List of form correction suggestions
        """
        self.feedback = []
        
        if len(landmarks) == 0:
            return self.feedback
        
        try:
            # Check knee angle
            knee_angle = self.pose_detector.calculate_angle(landmarks, 24, 26, 28)
            
            # Check hip angle
            hip_angle = self.pose_detector.calculate_angle(landmarks, 12, 24, 26)
            
            # Check back angle (shoulder-hip-knee)
            back_angle = self.pose_detector.calculate_angle(landmarks, 12, 24, 26)
            
            # Feedback based on angles
            if knee_angle < 70:
                self.feedback.append("⚠️ Going too deep - knees may be stressed")
            
            if knee_angle > 100 and knee_angle < 140:
                self.feedback.append("⚠️ Squat deeper for better results")
            
            # Check knee alignment (shouldn't go past toes)
            knee_x = landmarks[26][1]
            ankle_x = landmarks[28][1]
            
            if knee_x > ankle_x + 50:  # Threshold for knee over toes
                self.feedback.append("⚠️ Knees too far forward - push hips back")
            
            # Check back straightness
            if back_angle < 140:
                self.feedback.append("⚠️ Keep your back straight")
            
            if not self.feedback:
                self.feedback.append("✅ Good form!")
                
        except Exception as e:
            self.feedback.append("Unable to analyze form")
        
        return self.feedback
    
    def check_pushup_form(self, landmarks):
        """
        Check pushup form and provide feedback
        
        Args:
            landmarks: Body landmarks
            
        Returns:
            feedback: List of form correction suggestions
        """
        self.feedback = []
        
        if len(landmarks) == 0:
            return self.feedback
        
        try:
            # Check elbow angle
            elbow_angle = self.pose_detector.calculate_angle(landmarks, 12, 14, 16)
            
            # Check body alignment (shoulder-hip-ankle)
            body_angle = self.pose_detector.calculate_angle(landmarks, 12, 24, 28)
            
            # Check elbow position
            if elbow_angle < 70:
                self.feedback.append("⚠️ Going too low - risk of shoulder injury")
            
            if elbow_angle > 100 and elbow_angle < 140:
                self.feedback.append("⚠️ Go lower for full range of motion")
            
            # Check body alignment (should be straight)
            if body_angle < 160 or body_angle > 200:
                self.feedback.append("⚠️ Keep your body in a straight line")
            
            # Check if hips are sagging
            hip_y = landmarks[24][2]
            shoulder_y = landmarks[12][2]
            ankle_y = landmarks[28][2]
            
            if hip_y > max(shoulder_y, ankle_y) + 30:
                self.feedback.append("⚠️ Hips are sagging - engage your core")
            
            if not self.feedback:
                self.feedback.append("✅ Excellent form!")
                
        except Exception as e:
            self.feedback.append("Unable to analyze form")
        
        return self.feedback
    
    def check_curl_form(self, landmarks):
        """
        Check bicep curl form and provide feedback
        
        Args:
            landmarks: Body landmarks
            
        Returns:
            feedback: List of form correction suggestions
        """
        self.feedback = []
        
        if len(landmarks) == 0:
            return self.feedback
        
        try:
            # Check elbow angle
            elbow_angle = self.pose_detector.calculate_angle(landmarks, 12, 14, 16)
            
            # Check elbow position (should stay close to body)
            elbow_x = landmarks[14][1]
            shoulder_x = landmarks[12][1]
            
            elbow_distance = abs(elbow_x - shoulder_x)
            
            if elbow_distance > 80:
                self.feedback.append("⚠️ Keep elbows close to your body")
            
            # Check shoulder movement
            shoulder_y_diff = abs(landmarks[11][2] - landmarks[12][2])
            
            if shoulder_y_diff > 30:
                self.feedback.append("⚠️ Don't swing - use controlled motion")
            
            # Check range of motion
            if elbow_angle < 30:
                self.feedback.append("✅ Full contraction - great!")
            elif elbow_angle < 50:
                self.feedback.append("✅ Good form!")
            else:
                self.feedback.append("⚠️ Curl higher for better contraction")
                
        except Exception as e:
            self.feedback.append("Unable to analyze form")
        
        return self.feedback
    
    def analyze_form(self, landmarks):
        """
        Analyze form for the selected exercise
        
        Args:
            landmarks: Body landmarks
            
        Returns:
            feedback: List of form correction suggestions
        """
        if self.exercise_type == "squat":
            return self.check_squat_form(landmarks)
        elif self.exercise_type == "pushup":
            return self.check_pushup_form(landmarks)
        elif self.exercise_type == "curl":
            return self.check_curl_form(landmarks)
        else:
            return ["Exercise type not supported"]
    
    def get_feedback_summary(self):
        """
        Get summary of current feedback
        
        Returns:
            str: Combined feedback message
        """
        if not self.feedback:
            return "Ready to start"
        return " | ".join(self.feedback)
