import joblib
import pandas as pd
import os

def test_curl_model(model_path="models/curl_model.joblib"):
    print(f"Loading model from {model_path}...")
    
    if not os.path.exists(model_path):
        print(f"Error: Model not found at {model_path}")
        return

    model = joblib.load(model_path)
    
    # Define test cases (Elbow Angle, Hip Angle, Shoulder Flexion)
    test_cases = [
        {"desc": "Perfect Rep (Bottom)", "data": [160, 180, 5], "expected": 1},
        {"desc": "Perfect Rep (Top)", "data": [40, 180, 5], "expected": 1},
        {"desc": "Torso Swinging", "data": [40, 140, 5], "expected": 0},
        {"desc": "Elbow Drift Forward", "data": [40, 180, 45], "expected": 0},
        {"desc": "Double Cheat (Swing+Drift)", "data": [40, 140, 45], "expected": 0},
    ]
    
    print("\nRunning Manual Verification Tests:")
    print("-" * 75)
    print(f"{'Description':<25} | {'Input (E,H,S)':<20} | {'Expected':<10} | {'Predicted':<10} | {'Result'}")
    print("-" * 75)
    
    all_passed = True
    
    for case in test_cases:
        input_data = pd.DataFrame([case["data"]], columns=["elbow_angle", "hip_angle", "shoulder_flexion"])
        prediction = model.predict(input_data)[0]
        
        result = "PASSED" if prediction == case["expected"] else "FAILED"
        if prediction != case["expected"]:
            all_passed = False
            
        print(f"{case['desc']:<25} | {str(case['data']):<20} | {case['expected']:<10} | {prediction:<10} | {result}")
        
    print("-" * 75)
    
    if all_passed:
        print("\n✅ Verification Successful: Model is behaving perfectly!")
    else:
        print("\n❌ Verification Failed: Some test cases did not match expected output.")

if __name__ == "__main__":
    test_curl_model()
