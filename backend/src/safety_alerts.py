"""
Safety Alert Module
Detects dangerous postures and triggers warnings
"""

from pose_detector import PoseDetector
import time


class SafetyAlerts:
    """
    Monitors exercise safety and triggers alerts for risky postures
    Prevents injuries by detecting dangerous angles and positions
    """
    
    def __init__(self):
        """Initialize safety alert system"""
        self.pose_detector = PoseDetector()
        self.alerts = []
        self.last_alert_time = {}
        self.alert_cooldown = 3  # Seconds between repeated alerts
    
    def check_back_safety(self, landmarks):
        """
        Check for unsafe back positions
        
        Args:
            landmarks: Body landmarks
            
        Returns:
            alerts: List of safety warnings
        """
        alerts = []
        
        if len(landmarks) == 0:
            return alerts
        
        try:
            # Check spinal alignment (shoulder-hip-knee)
            back_angle = self.pose_detector.calculate_angle(landmarks, 12, 24, 26)
            
            # Dangerous back bend
            if back_angle < 120:
                alerts.append({
                    "level": "CRITICAL",
                    "message": "🚨 STOP: Dangerous back position detected!",
                    "action": "Straighten your back immediately"
                })
            elif back_angle < 140:
                alerts.append({
                    "level": "WARNING",
                    "message": "⚠️ Back rounding detected",
                    "action": "Keep your spine neutral"
                })
        except:
            pass
        
        return alerts
    
    def check_knee_safety(self, landmarks):
        """
        Check for unsafe knee positions
        
        Args:
            landmarks: Body landmarks
            
        Returns:
            alerts: List of safety warnings
        """
        alerts = []
        
        if len(landmarks) == 0:
            return alerts
        
        try:
            # Check knee angle
            knee_angle = self.pose_detector.calculate_angle(landmarks, 24, 26, 28)
            
            # Check knee over toes (dangerous in squats)
            knee_x = landmarks[26][1]
            ankle_x = landmarks[28][1]
            
            if knee_x > ankle_x + 80:
                alerts.append({
                    "level": "WARNING",
                    "message": "⚠️ Knees too far forward",
                    "action": "Push hips back, keep weight on heels"
                })
            
            # Knee hyperextension check
            if knee_angle > 185:
                alerts.append({
                    "level": "CRITICAL",
                    "message": "🚨 Knee hyperextension detected!",
                    "action": "Slightly bend your knees"
                })
            
            # Knee valgus (knees caving in) - check lateral alignment
            left_knee_x = landmarks[26][1]
            right_knee_x = landmarks[25][1]
            left_hip_x = landmarks[24][1]
            right_hip_x = landmarks[23][1]
            
            # Calculate if knees are closer together than hips
            knee_width = abs(left_knee_x - right_knee_x)
            hip_width = abs(left_hip_x - right_hip_x)
            
            if knee_width < hip_width * 0.7:
                alerts.append({
                    "level": "WARNING",
                    "message": "⚠️ Knees caving inward",
                    "action": "Push knees outward, align with toes"
                })
                
        except:
            pass
        
        return alerts
    
    def check_shoulder_safety(self, landmarks):
        """
        Check for unsafe shoulder positions
        
        Args:
            landmarks: Body landmarks
            
        Returns:
            alerts: List of safety warnings
        """
        alerts = []
        
        if len(landmarks) == 0:
            return alerts
        
        try:
            # Check shoulder elevation (both sides)
            left_shoulder_y = landmarks[11][2]
            right_shoulder_y = landmarks[12][2]
            left_ear_y = landmarks[7][2]
            right_ear_y = landmarks[8][2]
            
            # Shoulders too elevated (shrugging)
            if left_shoulder_y < left_ear_y or right_shoulder_y < right_ear_y:
                alerts.append({
                    "level": "WARNING",
                    "message": "⚠️ Shoulders elevated",
                    "action": "Relax shoulders, keep them down"
                })
            
            # Check for uneven shoulders
            shoulder_diff = abs(left_shoulder_y - right_shoulder_y)
            if shoulder_diff > 50:
                alerts.append({
                    "level": "WARNING",
                    "message": "⚠️ Uneven shoulders detected",
                    "action": "Balance your posture"
                })
                
        except:
            pass
        
        return alerts
    
    def check_neck_safety(self, landmarks):
        """
        Check for unsafe neck positions
        
        Args:
            landmarks: Body landmarks
            
        Returns:
            alerts: List of safety warnings
        """
        alerts = []
        
        if len(landmarks) == 0:
            return alerts
        
        try:
            # Check neck angle (nose-shoulder)
            nose_y = landmarks[0][2]
            shoulder_y = (landmarks[11][2] + landmarks[12][2]) / 2
            
            # Neck too far forward (tech neck)
            nose_x = landmarks[0][1]
            shoulder_x = (landmarks[11][1] + landmarks[12][1]) / 2
            
            forward_distance = abs(nose_x - shoulder_x)
            
            if forward_distance > 100:
                alerts.append({
                    "level": "WARNING",
                    "message": "⚠️ Neck protruding forward",
                    "action": "Keep head aligned with spine"
                })
                
        except:
            pass
        
        return alerts
    
    def check_balance(self, landmarks):
        """
        Check for balance and stability issues
        
        Args:
            landmarks: Body landmarks
            
        Returns:
            alerts: List of safety warnings
        """
        alerts = []
        
        if len(landmarks) == 0:
            return alerts
        
        try:
            # Check if person is leaning too much
            left_shoulder_x = landmarks[11][1]
            right_shoulder_x = landmarks[12][1]
            left_hip_x = landmarks[23][1]
            right_hip_x = landmarks[24][1]
            
            shoulder_center = (left_shoulder_x + right_shoulder_x) / 2
            hip_center = (left_hip_x + right_hip_x) / 2
            
            lean_distance = abs(shoulder_center - hip_center)
            
            if lean_distance > 80:
                alerts.append({
                    "level": "WARNING",
                    "message": "⚠️ Balance issue detected",
                    "action": "Center your weight, maintain balance"
                })
                
        except:
            pass
        
        return alerts
    
    def perform_safety_check(self, landmarks):
        """
        Perform comprehensive safety check
        
        Args:
            landmarks: Body landmarks
            
        Returns:
            all_alerts: Combined list of all safety alerts
        """
        all_alerts = []
        
        # Run all safety checks
        all_alerts.extend(self.check_back_safety(landmarks))
        all_alerts.extend(self.check_knee_safety(landmarks))
        all_alerts.extend(self.check_shoulder_safety(landmarks))
        all_alerts.extend(self.check_neck_safety(landmarks))
        all_alerts.extend(self.check_balance(landmarks))
        
        # Filter alerts with cooldown to avoid spam
        current_time = time.time()
        filtered_alerts = []
        
        for alert in all_alerts:
            alert_key = alert["message"]
            last_time = self.last_alert_time.get(alert_key, 0)
            
            if current_time - last_time > self.alert_cooldown:
                filtered_alerts.append(alert)
                self.last_alert_time[alert_key] = current_time
        
        self.alerts = filtered_alerts
        return filtered_alerts
    
    def has_critical_alerts(self):
        """
        Check if there are any critical safety alerts
        
        Returns:
            bool: True if critical alerts exist
        """
        return any(alert["level"] == "CRITICAL" for alert in self.alerts)
    
    def get_alert_summary(self):
        """
        Get summary of current alerts
        
        Returns:
            str: Combined alert messages
        """
        if not self.alerts:
            return "✅ Safe posture"
        
        messages = [alert["message"] for alert in self.alerts]
        return " | ".join(messages)
