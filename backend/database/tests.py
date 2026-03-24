"""
database/tests.py
──────────────────
Integration test for all database operations.
Run from the backend directory:
    python -m database.tests
  OR
    python database/tests.py
"""

import sys, os
# Allow running directly: python database/tests.py
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from database.connection import test_connection
from database.tracker    import ProgressTracker


def run_tests():
    print("=" * 55)
    print("  FitVision AI — Database Integration Tests")
    print("=" * 55)

    # 1. Connection
    print("\n[1] Testing Aiven connection...")
    version = test_connection()
    print(f"    ✔  {version[:50]}")

    tracker = ProgressTracker()
    uid = "test_integration_user"

    # 2. ensure_user
    print("[2] ensure_user...")
    tracker.ensure_user(uid, "Test User", "test@example.com")
    print("    ✔  user registered (or already exists)")

    # 3. start session
    print("[3] start_active_session...")
    tracker.start_active_session(uid, "squat")
    print("    ✔  live session started")

    # 4. Log reps in real-time
    print("[4] log_rep (real-time, 3 reps)...")
    for i in range(1, 4):
        tracker.log_rep(uid, "squat", i)
        print(f"    ✔  rep {i} saved")

    # 5. Log a form error
    print("[5] log_form_error...")
    tracker.log_form_error(uid, "knee_cave", "Left knee caving inward", severity="warning")
    print("    ✔  form error saved")

    # 6. Save completed workout
    print("[6] save_workout...")
    wid = tracker.save_workout(uid, "squat", 3, 45, notes="test session")
    print(f"    ✔  workout saved (id={wid})")

    # 7. Stats
    print("[7] get_total_stats...")
    stats = tracker.get_total_stats(uid)
    assert stats["total_reps"] >= 3, "Stats error"
    print(f"    ✔  total_reps={stats['total_reps']}")

    # 8. Errors
    print("[8] get_total_errors...")
    errors = tracker.get_total_errors(uid)
    assert errors >= 1, "Error count wrong"
    print(f"    ✔  form_errors={errors}")

    # 9. Achievements
    print("[9] get_achievements...")
    ach = tracker.get_achievements(uid)
    assert len(ach) == 3
    print(f"    ✔  {len(ach)} achievements returned")

    print("\n" + "=" * 55)
    print("  ✅  All tests passed — database is healthy!")
    print("=" * 55)


if __name__ == "__main__":
    run_tests()
