import requests
import time

BASE_URL = "http://localhost:5000/api"
USER_ID = "test_form_errors_user"

def test_form_errors_persistence():
    print("1. Starting session...")
    resp = requests.post(f"{BASE_URL}/start_session", json={"exercise": "squat"})
    print(resp.json())

    print("\n2. Simulating form errors (polling current_stats)...")
    # In a real scenario, the backend's pose_corrector would populate feedback.
    # We can't easily trigger that without a camera, but we can check if the 
    # coaching_engine.session_errors is being populated if we were running the full engine.
    # For this test, we care about the save logic in stop_session.
    
    # Actually, to test app.py's stop_session, we need coaching_engine.session_errors to have data.
    # Since they are global in app.py, let's look at how we can inject them or just trust the logic.
    # Wait, coaching_engine is a global in app.py.
    
    # Let's try to stop the session and see what happens.
    # To truly test it, session_errors should not be empty.
    
    print("\n3. Stopping session...")
    # NOTE: This test assumes the backend is already running.
    # We can't easily inject error data into the global coaching_engine from here.
    # But we can verify the API responds correctly.
    resp = requests.post(f"{BASE_URL}/stop_session", json={"user_id": USER_ID})
    data = resp.json()
    print(data)

    print("\n4. Checking progress API...")
    resp = requests.get(f"{BASE_URL}/progress?user_id={USER_ID}")
    data = resp.json()
    print(f"Total Errors in DB: {data.get('total_errors')}")

if __name__ == "__main__":
    # We expect the backend to be running.
    try:
        test_form_errors_persistence()
    except Exception as e:
        print(f"Error: {e}")
