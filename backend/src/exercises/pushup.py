import joblib
import pandas as pd
import os
from src.exercises.base import BaseExercise

class Pushup(BaseExercise):
    def __init__(self, pose_detector, thresholds):
        super().__init__(pose_detector, thresholds)
        self.ml_model = self._load_model()
        
    def _load_model(self):
        try:
            model_path = os.path.join("models", "pushup_model.joblib")
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
        
        # Check if going down
        if angle < self.thresholds["pushup"]["down"]:
            stage = "down"
            
        # Check if coming up
        if angle > self.thresholds["pushup"]["up"] and stage == "down":
            stage = "up"
            counter += 1
            
        return counter, stage

    def check_form(self, landmarks, stage=None, counter=0):
        feedback = []
        
        # Setup and Idle Pose Check
        try:
            body_alignment = self.get_best_side_angle(landmarks, [12, 24, 28], [11, 23, 27])
            shoulder_y = landmarks[12][2]
            ankle_y = landmarks[28][2]
            
            dy = abs(ankle_y - shoulder_y)
            dx = abs(landmarks[28][1] - landmarks[12][1])
            
            if dy > dx * 1.5:
                if counter == 0:
                    return ["ℹ️ Setup: Get on the floor with wide hands."]
                else:
                    return ["ℹ️ Idle: Get back on the floor."]
            elif dy > dx:
                if counter == 0:
                    return ["ℹ️ Setup: Get into a plank position."]
                else:
                    return ["ℹ️ Idle: Get back into a plank."]
            elif body_alignment < 130:
                if counter == 0:
                    return ["ℹ️ Setup: Make your body straight like a board."]
                else:
                    return ["ℹ️ Idle: Straighten your body."]
            elif counter == 0:
                if body_alignment >= 150:
                    return ["✅ Ready: Lower your chest to start."]
                else:
                    return ["ℹ️ Setup: Keep your body straight."]
        except Exception:
            pass

        try:
            # 1. Posture & Alignment
            elbow_angle = self.get_best_side_angle(landmarks, [12, 14, 16], [11, 13, 15])
            # Body Alignment (Shoulder - Hip - Ankle)
            body_alignment = self.get_best_side_angle(landmarks, [12, 24, 28], [11, 23, 27])
            
            # Elbow Flare Check (Shoulder-Elbow vs Vertical or Torso?)
            # Hard in 2D without top view.
            # Can proxy by checking if Elbow Y is close to Shoulder Y (flared) vs lower (tucked).
            # If Elbow Y < Shoulder Y (inverted in image coords? No, Y increases down).
            # If Elbow Y is same height as shoulder, it's flared 90 deg. 
            # We want elbows roughly 45 deg, so Elbow Y should be significantly lower (greater value) than Shoulder Y.
            
            # A. Core Stability (Safety)
            if body_alignment < 160:
                hip_y = landmarks[24][2]
                shoulder_y_core = landmarks[12][2]
                ankle_y_core = landmarks[28][2]
                
                if hip_y > (shoulder_y_core + ankle_y_core) / 2:
                    feedback.append("⚠️ Hips Low: Keep your hips up and body straight.")
                else:
                    feedback.append("⚠️ Hips High: Lower your hips to make a straight line.")
                
            # B. Range of Motion (Movement Quality)
            if 90 < elbow_angle < 120:
                 feedback.append("ℹ️ Go Deeper: Lower your chest closer to the floor.")

            # C. Elbow Flare Check
            elbow_y = min(landmarks[13][2], landmarks[14][2])
            shoulder_top_y = min(landmarks[11][2], landmarks[12][2])
            
            if elbow_angle < 130 and abs(elbow_y - shoulder_top_y) < 30:
                feedback.append("⚠️ Elbows: Keep elbows closer to your sides.")
            
            # D. Cervical Spine (Head Position)
            nose_y = landmarks[0][2]
            shoulder_y = min(landmarks[11][2], landmarks[12][2])
            
            if nose_y > shoulder_y:
                feedback.append("⚠️ Head Up: Look slightly ahead, don't drop your head.")

            # --- AI Model Integration (Advanced Form) ---
            if self.ml_model:
                try:
                    input_df = pd.DataFrame(
                        [[elbow_angle, body_alignment]], 
                        columns=["elbow_angle", "body_alignment"]
                    )
                    prediction = self.ml_model.predict(input_df)[0]
                    
                    if prediction == 1:
                        if not any("⚠️" in f for f in feedback):
                            feedback.append("✨ AI Coach: Awesome pushup!")
                    else:
                        if not any("⚠️" in f for f in feedback):
                             feedback.append("⚠️ AI Coach: Try to keep your body straight.")
                except Exception:
                    pass

            if not feedback:
                feedback.append("✅ Good Pushup")
                
        except Exception:
             feedback.append("Unable to analyze form")
        
        return feedback
