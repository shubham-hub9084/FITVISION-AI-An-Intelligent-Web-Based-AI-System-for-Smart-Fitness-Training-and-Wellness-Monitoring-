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
        # Calculate elbow angle (shoulder-elbow-wrist)
        # Landmark IDs: Shoulder=12, Elbow=14, Wrist=16 (right side)
        angle = self.pose_detector.calculate_angle(landmarks, 12, 14, 16)
        
        # Check if going down
        if angle < self.thresholds["pushup"]["down"]:
            stage = "down"
            
        # Check if coming up
        if angle > self.thresholds["pushup"]["up"] and stage == "down":
            stage = "up"
            counter += 1
            
        return counter, stage

    def check_form(self, landmarks):
        feedback = []
        try:
            # 1. Posture & Alignment
            # Elbow Angle: 12, 14, 16
            elbow_angle = self.pose_detector.calculate_angle(landmarks, 12, 14, 16)
            # Body Alignment (Shoulder - Hip - Ankle): 11, 23, 27 (Left) or 12, 24, 28 (Right)
            # Using left side for consistency or average? Let's use Right (12, 24, 28)
            body_alignment = self.pose_detector.calculate_angle(landmarks, 12, 24, 28)
            
            # Elbow Flare Check (Shoulder-Elbow vs Vertical or Torso?)
            # Hard in 2D without top view.
            # Can proxy by checking if Elbow Y is close to Shoulder Y (flared) vs lower (tucked).
            # If Elbow Y < Shoulder Y (inverted in image coords? No, Y increases down).
            # If Elbow Y is same height as shoulder, it's flared 90 deg. 
            # We want elbows roughly 45 deg, so Elbow Y should be significantly lower (greater value) than Shoulder Y.
            
            # A. Core Stability (Safety)
            if body_alignment < 160:
                feedback.append("⚠️ Hips Sagging: Engage core / glutes")
            elif body_alignment > 200: # 180 +/- tolerance
                feedback.append("⚠️ Hips High: Form a straight line")
                
            # B. Range of Motion (Movement Quality)
            if elbow_angle > 170:
                pass # Lockout is okay, but soft lock preferred
                # feedback.append("ℹ️ Soft Elbows: Don't snap extension")
            
            # In 'down' phase checks (dynamic check using stage would be better, but strict form check works too)
            # If angle is somewhat low but not deep enough
            if 90 < elbow_angle < 130:
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
            # Ear (8) - Shoulder (12) alignment? 
            # If Ear Y is much lower than Shoulder Y, head is drooping.
            ear_y = landmarks[8][2]
            shoulder_y = landmarks[12][2]
            if ear_y > shoulder_y: # Head dropping below shoulders
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
