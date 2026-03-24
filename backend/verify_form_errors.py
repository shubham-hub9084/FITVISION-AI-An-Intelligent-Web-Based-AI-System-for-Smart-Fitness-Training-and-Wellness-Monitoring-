import sys
import os

# Add backend directory to path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from database.tracker import ProgressTracker
from src.coaching_engine import CoachingEngine

def verify_app_logic():
    tracker = ProgressTracker()
    engine = CoachingEngine()
    
    user_id = "test_form_errors_user"
    workout_id = 999 # Dummy
    
    # 1. Simulate some errors in the engine
    engine.session_errors = ["⚠️ Knee hyperextension", "⚠️ Low depth", "⚠️ Knee hyperextension"]
    
    # 2. Simulate the app.py stop_session logic
    print("Simulating stop_session logic...")
    tracker.ensure_user(user_id) # Ensure user exists for foreign key
    
    unique_errors = set(engine.session_errors)
    for error_msg in unique_errors:
        clean_error = error_msg.replace("⚠️ ", "").split(":")[0].strip()
        print(f"Logging error: {clean_error} ('{error_msg}')")
        tracker.log_form_error(
            user_id=user_id,
            workout_id=None, # In test we don't need a real workout_id
            error_type=clean_error,
            message=error_msg,
            severity="warning"
        )
    
    # 3. Verify total errors for this user
    total_errors = tracker.get_total_errors(user_id)
    print(f"\nTotal errors for {user_id}: {total_errors}")
    
    if total_errors >= 2:
        print("\n✅ Verification SUCCESS: Form errors are being saved.")
    else:
        print("\n❌ Verification FAILED: Form errors not found.")

if __name__ == "__main__":
    verify_app_logic()
