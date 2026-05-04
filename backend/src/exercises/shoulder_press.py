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
        # Calculate right and left elbow angles
        r_angle = self.pose_detector.calculate_angle(landmarks, 12, 14, 16)
        l_angle = self.pose_detector.calculate_angle(landmarks, 11, 13, 15)
        
        # Check visibility
        right_vis = sum(landmarks[idx][4] for idx in [12, 14, 16]) / 3 if len(landmarks) > 0 and len(landmarks[0]) > 4 else 1.0
        left_vis = sum(landmarks[idx][4] for idx in [11, 13, 15]) / 3 if len(landmarks) > 0 and len(landmarks[0]) > 4 else 1.0
        
        # If both arms are reasonably visible, use their average to prevent fluctuating counts
        if right_vis > 0.5 and left_vis > 0.5:
            angle = (r_angle + l_angle) / 2
        else:
            angle = self.get_best_side_angle(landmarks, [12, 14, 16], [11, 13, 15])
        
        # Check if going down (arms bent)
        if angle < self.thresholds["shoulder_press"]["down"]:
            stage = "down"
            
        # Check if going up (arms extended)
        if angle > self.thresholds["shoulder_press"]["up"] and stage == "down":
            stage = "up"
            counter += 1
            
        return counter, stage

    def check_form(self, landmarks, stage=None, counter=0):
        feedback = []
        
        # Setup and Idle Pose Check
        try:
            # For shoulder press, arms should be up. Average both sides for robust check.
            wrist_y = (landmarks[15][2] + landmarks[16][2]) / 2
            shoulder_y = (landmarks[11][2] + landmarks[12][2]) / 2
            elbow_angle = self.get_best_side_angle(landmarks, [12, 14, 16], [11, 13, 15])
            
            shoulder_width_setup = abs(landmarks[11][1] - landmarks[12][1])
            if shoulder_width_setup == 0:
                shoulder_width_setup = 100
                
            # Check if wrists are significantly below shoulders (resting position)
            if wrist_y > shoulder_y + (shoulder_width_setup * 0.4): 
                if counter == 0:
                    if elbow_angle > 150:
                        return ["ℹ️ Setup: Bring hands up."]
                    else:
                        return ["ℹ️ Setup: Raise hands higher."]
                else:
                    return ["ℹ️ Idle: Raise hands to resume."]
            elif counter == 0 and stage is None:
                return ["✅ Ready: Press hands up."]
        except Exception:
            pass

        try:
             # 1. Posture Checks
             # Lumbar Arching (hyperextension) check
             hip_angle = self.get_best_side_angle(landmarks, [12, 24, 26], [11, 23, 25])
             
             # If angle is significantly < 170 implies backward lean in many coord systems depending on orientation.
             # Assuming standard side view:
             # Straight = 180. Leaning back (shoulders behind hips) -> angle calculation logic depends.
             # Let's assume standard "straight" check.
             if hip_angle < 155: 
                 feedback.append("⚠️ Leaning Back: Stand straight and tight.")

             # 2. Arm Symmetry (Front View)
             # Compare Right (12-14-16) vs Left (11-13-15) elbow angles.
             r_angle = self.pose_detector.calculate_angle(landmarks, 12, 14, 16)
             l_angle = self.pose_detector.calculate_angle(landmarks, 11, 13, 15)
             
             if abs(r_angle - l_angle) > 20:
                 left_wrist_y = landmarks[15][2]
                 right_wrist_y = landmarks[16][2]
                 
                 # In pixel coordinates, higher Y means physically lower.
                 if left_wrist_y > right_wrist_y + 30:
                     feedback.append("⚠️ Uneven: Your right hand is lower.")
                 elif right_wrist_y > left_wrist_y + 30:
                     feedback.append("⚠️ Uneven: Your left hand is lower.")
                 else:
                     feedback.append("⚠️ Uneven: Push evenly.")

             # 3. Range of Motion
             # Full Lockout
             avg_angle = (r_angle + l_angle) / 2
             if avg_angle < 60:
                 # Too low?
                 pass 
             elif avg_angle > 165:
                 feedback.append("✅ Arms Straight")
                 
             # 4. Wrist Alignment & Elbow Flaring
             shoulder_width = abs(landmarks[11][1] - landmarks[12][1])
             if shoulder_width > 0:
                 r_wrist_dev = abs(landmarks[16][1] - landmarks[14][1])
                 l_wrist_dev = abs(landmarks[15][1] - landmarks[13][1])
                 
                 # If horizontal deviation is more than 25% of shoulder width, wrists are not stacked
                 if r_wrist_dev > shoulder_width * 0.25 or l_wrist_dev > shoulder_width * 0.25:
                     feedback.append("⚠️ Wrists Out: Keep wrists right above your elbows.")

             # 5. Shoulder Shrugging Check
             nose_y = landmarks[0][2]
             shoulder_y_avg = (landmarks[11][2] + landmarks[12][2]) / 2
             shoulder_to_nose = shoulder_y_avg - nose_y
             
             if shoulder_width > 0 and shoulder_to_nose < shoulder_width * 0.35:
                 feedback.append("⚠️ Shrugging: Relax your shoulders.")

             if not feedback:
                  feedback.append("✅ Good Press")

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
                             feedback.append("✨ AI Coach: Awesome press!")
                     else:
                         if not any("⚠️" in f for f in feedback):
                              feedback.append("⚠️ AI Coach: Try to keep your back straight and push evenly.")
                 except Exception:
                     pass
                  
        except Exception:
             feedback.append("Unable to analyze form")
             
        return feedback
