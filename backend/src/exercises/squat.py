import joblib
import pandas as pd
import os
from src.exercises.base import BaseExercise

class Squat(BaseExercise):
    def __init__(self, pose_detector, thresholds):
        super().__init__(pose_detector, thresholds)
        self.ml_model = self._load_model()
        
    def _load_model(self):
        try:
            model_path = os.path.join("models", "squat_model.joblib")
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
        # Calculate knee angle (hip-knee-ankle)
        # Landmark IDs: Hip=24, Knee=26, Ankle=28 (right side)
        angle = self.pose_detector.calculate_angle(landmarks, 24, 26, 28)
        
        # --- Front View Fallback Logic ---
        # Calculate vertical span of thigh vs shin
        hip_y = landmarks[24][2]
        knee_y = landmarks[26][2]
        ankle_y = landmarks[28][2]
        
        thigh_span = knee_y - hip_y
        shin_span = ankle_y - knee_y
        
        # Avoid division by zero
        ratio = thigh_span / (shin_span + 1e-6)
        
        # Check if going down
        if angle < self.thresholds["squat"]["down"] or ratio < 0.5:
            stage = "down"
        
        # Check if coming up
        if (angle > self.thresholds["squat"]["up"] or ratio > 0.8) and stage == "down":
            stage = "up"
            counter += 1
            print(f"\n✅ Rep Counted! Total: {counter}")
            
        return counter, stage

    def check_form(self, landmarks):
        feedback = []
        try:
            # 1. Posture & Alignment
            # Knee Angle: 24, 26, 28
            knee_angle = self.pose_detector.calculate_angle(landmarks, 24, 26, 28)
            # Hip Angle (Back alignment relative to thigh): 12, 24, 26
            hip_angle = self.pose_detector.calculate_angle(landmarks, 12, 24, 26)
            # Torso Angle (Shoulder - Hip - Vertical): Approximate vertical by using knee? 
            # Better: Check Shoulder-Hip-Knee (Hip hinge) - already captured in hip_angle
            
            # --- Biomechanical Checks ---
            
            # A. Depth Check (Movement Quality)
            if knee_angle < 70:
                feedback.append("⚠️ Too Deep: Limit range to protect knees")
            elif knee_angle > 110 and knee_angle < 150: # In "holding" zone or descent
                # Not parallel yet
                feedback.append("ℹ️ Go Lower: Thighs should be parallel to floor")
                
            # B. Neutral Spine (Posture)
            # Using Shoulder-Hip-Knee angle to approximate. 
            # If < 60, excessive forward lean.
            if hip_angle < 60:
                feedback.append("⚠️ Chest Up: Maintain neutral spine (don't fold)")
            
            # C. Knee Valgus / Stability (Safety)
            # 2D estimation: Knee x vs Ankle x interaction?
            # Hard to specificy without calibration, but we can check if knee is wobbling 
            # by comparing relative horizontal distance if reliable. 
            # Sticking to valid angle checks for now.
            
            # D. Extension (Movement Quality)
            # At top (angle > 160), hips should be extended.
            if knee_angle > 165 and hip_angle < 160:
                feedback.append("⚠️ Full Hip Extension: Squeeze glutes at top")

            # --- AI Model Integration (Advanced Form) ---
            if self.ml_model:
                try:
                    # Prepare features for model [knee, hip, back_angle from logic]
                    # Note: "back_angle" in original training was likely 12-24-26 (hip angle)
                    input_df = pd.DataFrame(
                        [[knee_angle, hip_angle, hip_angle]], 
                        columns=["knee_angle", "hip_angle", "back_angle"]
                    )
                    prediction = self.ml_model.predict(input_df)[0]
                    
                    if prediction == 1:
                        # Only show "Perfect" if no other warnings
                        if not any("⚠️" in f for f in feedback):
                            feedback.append("✨ AI Coach: Excellent form & control!")
                    else:
                        if not any("⚠️" in f for f in feedback):
                             feedback.append("⚠️ AI Coach: Detected subtle form breakdown")
                except Exception:
                    pass
            
            if not feedback:
                feedback.append("✅ Correct: Maintain rhythm")
                
        except Exception:
            feedback.append("Unable to analyze form")
            
        return feedback
