import joblib
import pandas as pd
import os

def test_shoulder_press_model(model_path="models/shoulder_press_model.joblib"):
    print(f"Loading model from {model_path}...")
    
    if not os.path.exists(model_path):
        print(f"Error: Model not found at {model_path}")
        return

    model = joblib.load(model_path)
    
    # Define test cases (Hip Angle, Right Elbow, Left Elbow)
    test_cases = [
        {"desc": "Perfect Rep (Bottom)", "data": [175, 60, 60], "expected": 1},
        {"desc": "Perfect Lockout", "data": [175, 170, 170], "expected": 1},
        {"desc": "Severe Arching (Safety)", "data": [140, 90, 90], "expected": 0},
        {"desc": "Asymmetrical Push", "data": [175, 160, 90], "expected": 0},
        {"desc": "Double Fault (Arch+Asym)", "data": [130, 150, 70], "expected": 0},
    ]
    
    print("\nRunning Manual Verification Tests:")
    print("-" * 75)
    print(f"{'Description':<25} | {'Input (H,R,L)':<20} | {'Expected':<10} | {'Predicted':<10} | {'Result'}")
    print("-" * 75)
    
    all_passed = True
    
    for case in test_cases:
        input_data = pd.DataFrame([case["data"]], columns=["hip_angle", "r_angle", "l_angle"])
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
    test_shoulder_press_model()
