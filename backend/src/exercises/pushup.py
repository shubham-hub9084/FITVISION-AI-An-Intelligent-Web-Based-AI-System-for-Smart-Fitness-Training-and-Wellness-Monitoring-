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
        # Calculate elbow angle dynamically (Right: 12, 14, 16 | Left: 11, 13, 15)
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
        
        # Setup Pose Check
        if counter == 0 and stage is None:
            try:
                body_alignment = self.get_best_side_angle(landmarks, [12, 24, 28], [11, 23, 27])
                shoulder_y = landmarks[12][2]
                ankle_y = landmarks[28][2]
                
                dy = abs(ankle_y - shoulder_y)
                dx = abs(landmarks[28][1] - landmarks[12][1])
                
                if dy > dx * 1.5:
                    return ["ℹ️ Setup: Transition to the floor. Place hands wider than shoulders."]
                elif dy > dx:
                    return ["ℹ️ Setup: Get into a horizontal plank position."]
                elif body_alignment < 140:
                    return ["ℹ️ Setup: Align your shoulders, hips, and ankles into a straight line."]
                elif body_alignment >= 150:
                    return ["✅ Ready: Keep your core tight and lower your chest."]
                else:
                    return ["ℹ️ Setup: Keep your body straight like a plank."]
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
            if body_alignment < 165:
                feedback.append("⚠️ Keep Body Straight: Don't sag or pike hips")
                
            # B. Range of Motion (Movement Quality)
            if elbow_angle > 170:
                pass # Lockout is okay, but soft lock preferred
                # feedback.append("ℹ️ Soft Elbows: Don't snap extension")
            
            # In 'down' phase checks (dynamic check using stage would be better, but strict form check works too)
            # If angle is somewhat low but not deep enough
            if 90 < elbow_angle < 120:
                 feedback.append("ℹ️ Go Deeper: Chest to floor")

            # C. Elbow Flare Check
            # Normalize Y coords? simple check:
            # If we are horizontal (pushup position), shoulder Y ~ hip Y. 
            # If elbow Y is close to shoulder Y, that's a wide flare (T-shape).
            # Effective pushup: Arrow shape. 
            # But in side view, flare is hard to see. 
            # In front view, flare is obvious.
            # Assuming side view mostly for pushups:
            # We can check elbow X relative to shoulder/wrist X? 
            # Let's stick to Body Alignment as primary Safety check.
            
            # D. Cervical Spine (Head Position)
            # Use Nose (0) and highest shoulder to robustly check if head is dropping
            nose_y = landmarks[0][2]
            shoulder_y = min(landmarks[11][2], landmarks[12][2])
            
            if nose_y > shoulder_y: # Head dropping below shoulders
                feedback.append("⚠️ Head Neutral: Don't drop your head")

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
                            feedback.append("✨ AI Coach: Excellent form & control!")
                    else:
                        if not any("⚠️" in f for f in feedback):
                             feedback.append("⚠️ AI Coach: Detected subtle form breakdown")
                except Exception:
                    pass

            if not feedback:
                feedback.append("✅ Correct: Solid Plank Position")
                
        except Exception:
             feedback.append("Unable to analyze form")
        
        return feedback
