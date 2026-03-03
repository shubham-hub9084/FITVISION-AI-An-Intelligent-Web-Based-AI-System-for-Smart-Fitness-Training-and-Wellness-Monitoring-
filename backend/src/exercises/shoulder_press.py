import joblib
import pandas as pd
import os
from src.exercises.base import BaseExercise

class ShoulderPress(BaseExercise):
    def __init__(self, pose_detector, thresholds):
        super().__init__(pose_detector, thresholds)
        self.ml_model = self._load_model()
        
    def _load_model(self):
        try:
            model_path = os.path.join("models", "shoulder_press_model.joblib")
            if os.path.exists(model_path):
                print(f"✅ Loaded ML Model from {model_path}")
                return joblib.load(model_path)
            else:
                print(f"⚠️ Model not found at {model_path}")
                return None
        except Exception as e:
            print(f"❌ Failed to load ML Model: {e}")
            return None
    def count_reps(self, landmarks, stage, counter):
        # Calculate elbow angle (shoulder-elbow-wrist)
        # Landmark IDs: Shoulder=12, Elbow=14, Wrist=16
        angle = self.pose_detector.calculate_angle(landmarks, 12, 14, 16)
        
        # Check if going down (arms bent)
        if angle < self.thresholds["shoulder_press"]["down"]:
            stage = "down"
            
        # Check if going up (arms extended)
        if angle > self.thresholds["shoulder_press"]["up"] and stage == "down":
            stage = "up"
            counter += 1
            
        return counter, stage

    def check_form(self, landmarks):
        feedback = []
        try:
             # 1. Posture Checks
             # Lumbar Arching (hyperextension) check
             # Use Shoulder-Hip-Knee angle. If > 180 (hyperextended) or < 170 (flexion).
             # Usually people lean back -> Hyperextension.
             # Need side view. 
             hip_angle = self.pose_detector.calculate_angle(landmarks, 12, 24, 26)
             
             # If angle is significantly < 170 implies backward lean in many coord systems depending on orientation.
             # Assuming standard side view:
             # Straight = 180. Leaning back (shoulders behind hips) -> angle calculation logic depends.
             # Let's assume standard "straight" check.
             if hip_angle < 160: 
                 feedback.append("⚠️ Core Tight: Don't arch your back")

             # 2. Arm Symmetry (Front View)
             # Compare Right (12-14-16) vs Left (11-13-15) elbow angles.
             r_angle = self.pose_detector.calculate_angle(landmarks, 12, 14, 16)
             l_angle = self.pose_detector.calculate_angle(landmarks, 11, 13, 15)
             
             if abs(r_angle - l_angle) > 20:
                 feedback.append("⚠️ Symmetry: Push evenly")

             # 3. Range of Motion
             # Full Lockout
             avg_angle = (r_angle + l_angle) / 2
             if avg_angle < 60:
                 # Too low?
                 pass 
             elif avg_angle > 165:
                 feedback.append("✅ Full Lockout")
                 
             # 4. Wrist Alignment (Safety)
             # Hard in 2D Pose (Hands are points). 
             # Generic advice:
             # feedback.append("ℹ️ Wrists Neutral") - Might be annoying if spammy.

             if not feedback:
                  feedback.append("✅ Strong Press")

             # --- AI Model Integration (Advanced Form) ---
             if self.ml_model:
                 try:
                     input_df = pd.DataFrame(
                         [[hip_angle, r_angle, l_angle]], 
                         columns=["hip_angle", "r_angle", "l_angle"]
                     )
                     prediction = self.ml_model.predict(input_df)[0]
                     
                     if prediction == 1:
                         if not any("⚠️" in f for f in feedback):
                             feedback.append("✨ AI Coach: Excellent form & control!")
                     else:
                         if not any("⚠️" in f for f in feedback):
                              feedback.append("⚠️ AI Coach: Detected form sliding (arch/asymmetry)")
                 except Exception:
                     pass
                  
        except Exception:
             feedback.append("Unable to analyze form")
             
        return feedback
