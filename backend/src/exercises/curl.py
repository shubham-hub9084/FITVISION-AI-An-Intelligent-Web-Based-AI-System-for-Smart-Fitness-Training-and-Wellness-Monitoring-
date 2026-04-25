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
        # Calculate elbow angle dynamically
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
        
        # Setup Pose Check
        if counter == 0 and stage is None:
            try:
                elbow_angle = self.get_best_side_angle(landmarks, [12, 14, 16], [11, 13, 15])
                hip_angle = self.get_best_side_angle(landmarks, [12, 24, 26], [11, 23, 25])
                
                if elbow_angle < 60:
                    return ["ℹ️ Setup: Lower the dumbbells fully to begin."]
                elif elbow_angle <= 150:
                    return ["ℹ️ Setup: Fully extend your arms down by your sides."]
                elif hip_angle < 150:
                    return ["ℹ️ Setup: Stand tall with a neutral spine."]
                else:
                    return ["✅ Ready: Pin elbows to your sides and curl upwards."]
            except Exception:
                pass

        try:
            # 1. Angles
            elbow_angle = self.get_best_side_angle(landmarks, [12, 14, 16], [11, 13, 15])
            
            # 2. Movement Quality (Momentum/Swinging)
            # Check Shoulder-Hip vertical alignment deviation. 
            # Or simplified: Check if shoulder moves significantly in X plain relative to hip.
            # normalized to image width is hard, but we can check absolute diff if assuming standard framing
            
            # Better check using angles:
            # Torso Swing: (Shoulder-Hip-Vertical). 
            # If torso reclines back (< 170 deg relative to vertical) it's cheating.
            # Using Hip-Shoulder-Elbow is proxy? No. 
            # Let's use Shoulder-Hip-Knee angle (Hip extension).
            # If hip angle < 170 during curl, they might be swinging back.
            hip_angle = self.get_best_side_angle(landmarks, [12, 24, 26], [11, 23, 25])
            
            if hip_angle < 160:
                feedback.append("⚠️ Strict Form: Don't swing back")

            # 3. Elbow Drift (Isolation)
            # Elbow should be "pinned" to side. 
            # Check absolute X distance between Shoulder and Elbow.
            # Only valid if facing camera? In side view, elbow should be vertically below shoulder.
            # Let's check Shoulder-Elbow-Hip angle?
            # Ideally Shoulder-Elbow line is vertical-ish. 
            # If Elbow is far forward (shoulder flexion), checking shoulder angle (Hip-Shoulder-Elbow).
            shoulder_flexion = self.get_best_side_angle(landmarks, [24, 12, 14], [23, 11, 13])
            if shoulder_flexion > 20: # Arm moving forward
                 feedback.append("⚠️ Pin Elbows: Keep elbows tucked at your sides")

            # 4. Range of Motion
            if elbow_angle > 160:
                pass 
                # feedback.append("✅ Full Extension")
            elif elbow_angle < 45:
                feedback.append("✅ Peak Contraction: Squeeze!")
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
                            feedback.append("✨ AI Coach: Excellent form & isolation!")
                    else:
                        if not any("⚠️" in f for f in feedback):
                             feedback.append("⚠️ AI Coach: Detected form sliding (swing/drift)")
                except Exception:
                    pass

            if not feedback:
                feedback.append("✅ Good Isolation")
                
        except Exception:
            feedback.append("Unable to analyze form")
            
        return feedback
