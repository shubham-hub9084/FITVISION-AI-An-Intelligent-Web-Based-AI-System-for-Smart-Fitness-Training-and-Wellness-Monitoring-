import joblib
import pandas as pd
import os
from src.exercises.base import BaseExercise

class Curl(BaseExercise):
    def __init__(self, pose_detector, thresholds):
        super().__init__(pose_detector, thresholds)
        self.ml_model = self._load_model()
        
    def _load_model(self):
        try:
            model_path = os.path.join("models", "curl_model.joblib")
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
        r_angle = self.pose_detector.calculate_angle(landmarks, 12, 14, 16)
        l_angle = self.pose_detector.calculate_angle(landmarks, 11, 13, 15)
        
        right_vis = sum(landmarks[idx][4] for idx in [12, 14, 16]) / 3 if len(landmarks) > 0 and len(landmarks[0]) > 4 else 1.0
        left_vis = sum(landmarks[idx][4] for idx in [11, 13, 15]) / 3 if len(landmarks) > 0 and len(landmarks[0]) > 4 else 1.0
        
        if right_vis > 0.5 and left_vis > 0.5:
            angle = (r_angle + l_angle) / 2
        else:
            angle = self.get_best_side_angle(landmarks, [12, 14, 16], [11, 13, 15])
        
        # Check if going up (curl is up-phase dominant)
        if angle > self.thresholds["curl"]["up"]:
            stage = "down" # Starting position
            
        # Check if curled up
        if angle < self.thresholds["curl"]["down"] and stage == "down": 
            stage = "up"
            counter += 1
            
        return counter, stage

    def check_form(self, landmarks, stage=None, counter=0):
        feedback = []
        
        # Setup and Idle Pose Check
        try:
            elbow_angle = self.get_best_side_angle(landmarks, [12, 14, 16], [11, 13, 15])
            hip_angle = self.get_best_side_angle(landmarks, [12, 24, 26], [11, 23, 25])
            
            if elbow_angle > 150 and hip_angle >= 150:
                if counter == 0:
                    return ["✅ Ready: Keep elbows still and curl up."]
                else:
                    return ["ℹ️ Idle: Curl your arms to resume."]
            elif counter == 0:
                if elbow_angle < 60:
                    return ["ℹ️ Setup: Lower your hands to start."]
                elif elbow_angle <= 150:
                    return ["ℹ️ Setup: Put your arms down by your sides."]
                elif hip_angle < 150:
                    return ["ℹ️ Setup: Stand up straight."]
        except Exception:
            pass

        try:
            # 1. Angles
            r_angle = self.pose_detector.calculate_angle(landmarks, 12, 14, 16)
            l_angle = self.pose_detector.calculate_angle(landmarks, 11, 13, 15)
            elbow_angle = self.get_best_side_angle(landmarks, [12, 14, 16], [11, 13, 15])
            
            # Arm Symmetry Check
            if abs(r_angle - l_angle) > 20:
                if r_angle > l_angle + 20:
                    feedback.append("⚠️ Dropped Arm: Keep your left arm up with your right.")
                elif l_angle > r_angle + 20:
                    feedback.append("⚠️ Dropped Arm: Keep your right arm up with your left.")
            
            # 2. Movement Quality (Momentum/Swinging)
            # If hip angle < 170 during curl, they might be swinging back.
            hip_angle = self.get_best_side_angle(landmarks, [12, 24, 26], [11, 23, 25])
            
            if hip_angle < 160:
                feedback.append("⚠️ No Swinging: Don't lean back to lift.")

            # 3. Elbow Drift (Isolation)
            shoulder_flexion = self.get_best_side_angle(landmarks, [24, 12, 14], [23, 11, 13])
            if shoulder_flexion > 20: # Arm moving forward
                 feedback.append("⚠️ Elbows Moving: Keep your elbows still by your sides.")

            # 4. Out of Bounds / Unnecessary Poses Check
            nose_y = landmarks[0][2]
            l_wrist_y = landmarks[15][2]
            r_wrist_y = landmarks[16][2]
            l_wrist_x = landmarks[15][1]
            r_wrist_x = landmarks[16][1]
            l_shoulder_x = landmarks[11][1]
            r_shoulder_x = landmarks[12][1]
            
            # Hands above face
            if l_wrist_y < nose_y or r_wrist_y < nose_y:
                feedback.append("⚠️ Too High: Stop lifting when hands reach shoulders.")
                
            # Arms crossing body midline
            center_x = (l_shoulder_x + r_shoulder_x) / 2
            buffer = abs(l_shoulder_x - r_shoulder_x) * 0.1
            if l_wrist_x < center_x - buffer or r_wrist_x > center_x + buffer:
                feedback.append("⚠️ Hands Crossing: Keep your hands straight ahead.")

            # 5. Range of Motion
            if elbow_angle > 160:
                pass 
                # feedback.append("✅ Full Extension")
            elif elbow_angle < 50:
                if not any("⚠️" in f for f in feedback):
                    feedback.append("✅ Squeeze: Hold your hands at the top for a second!")
            else:
                 # Mid rep
                 pass 

            # --- AI Model Integration (Advanced Form) ---
            if self.ml_model:
                try:
                    input_df = pd.DataFrame(
                        [[elbow_angle, hip_angle, shoulder_flexion]], 
                        columns=["elbow_angle", "hip_angle", "shoulder_flexion"]
                    )
                    prediction = self.ml_model.predict(input_df)[0]
                    
                    if prediction == 1:
                        if not any("⚠️" in f for f in feedback):
                            feedback.append("✨ AI Coach: Perfect bicep curl!")
                    else:
                        if not any("⚠️" in f for f in feedback):
                             feedback.append("⚠️ AI Coach: Keep your back straight and elbows still.")
                except Exception:
                    pass

            if not feedback:
                feedback.append("✅ Good Curl")
                
        except Exception:
            feedback.append("Unable to analyze form")
            
        return feedback
