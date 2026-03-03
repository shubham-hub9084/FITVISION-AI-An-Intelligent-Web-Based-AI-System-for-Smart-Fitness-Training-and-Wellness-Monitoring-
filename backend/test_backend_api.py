import urllib.request
import urllib.error
import json
import time

BASE_URL = "http://localhost:5000"

def make_request(method, endpoint, data=None):
    url = f"{BASE_URL}{endpoint}"
    req = urllib.request.Request(url, method=method)
    
    if data:
        json_data = json.dumps(data).encode('utf-8')
        req.add_header('Content-Type', 'application/json')
        req.add_header('Content-Length', len(json_data))
        try:
            with urllib.request.urlopen(req, data=json_data) as response:
                return response.status, json.loads(response.read().decode('utf-8'))
        except urllib.error.HTTPError as e:
            return e.code, None
        except urllib.error.URLError as e:
            return None, str(e)
    else:
        try:
            with urllib.request.urlopen(req) as response:
                return response.status, json.loads(response.read().decode('utf-8'))
        except urllib.error.HTTPError as e:
            return e.code, None
        except urllib.error.URLError as e:
            return None, str(e)

def test_api():
    print(f"Testing backend at {BASE_URL}...\n")
    
    # Test 1: Get exercises
    print("Test 1: GET /api/exercises")
    status, data = make_request('GET', '/api/exercises')
    if status == 200:
        print("✅ Success: Supported exercises retrieved")
        print(f"   Data: {data}")
    else:
        print(f"❌ Failed: Status {status}, Error: {data}")

    # Test 2: Start session
    print("\nTest 2: POST /api/start_session")
    status, data = make_request('POST', '/api/start_session', {"exercise": "squat"})
    if status == 200:
        print("✅ Success: Session started")
        print(f"   Data: {data}")
    else:
        print(f"❌ Failed: Status {status}, Error: {data}")
        
    # Wait for a moment to simulate active session
    time.sleep(1)

    # Test 3: Get current stats
    print("\nTest 3: GET /api/current_stats")
    status, data = make_request('GET', '/api/current_stats')
    if status == 200:
        print("✅ Success: Current stats retrieved")
        print(f"   Data: {data}")
    else:
        print(f"❌ Failed: Status {status}, Error: {data}")

    # Test 4: Stop session
    print("\nTest 4: POST /api/stop_session")
    status, data = make_request('POST', '/api/stop_session')
    if status == 200:
        print("✅ Success: Session stopped")
        print(f"   Data: {data}")
    else:
        print(f"❌ Failed: Status {status}, Error: {data}")

if __name__ == "__main__":
    test_api()
