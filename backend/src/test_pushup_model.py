import joblib
import pandas as pd
import os

def test_pushup_model(model_path="models/pushup_model.joblib"):
    print(f"Loading model from {model_path}...")
    
    if not os.path.exists(model_path):
        print(f"Error: Model not found at {model_path}")
        return

    model = joblib.load(model_path)
    
    # Define test cases (Elbow Angle, Body Alignment)
    test_cases = [
        {"desc": "Perfect Rep (Deep)", "data": [85, 175], "expected": 1},
        {"desc": "Perfect Rep (Mid)", "data": [110, 175], "expected": 1},
        {"desc": "Hips Sagging", "data": [85, 140], "expected": 0},
        {"desc": "Hips High (Pike)", "data": [85, 210], "expected": 0},
        {"desc": "Severe Sagging", "data": [120, 100], "expected": 0},
        {"desc": "Severe Pike", "data": [120, 240], "expected": 0},
    ]
    
    print("\nRunning Manual Verification Tests:")
    print("-" * 65)
    print(f"{'Description':<22} | {'Input (E,B)':<15} | {'Expected':<10} | {'Predicted':<10} | {'Result'}")
    print("-" * 65)
    
    all_passed = True
    
    for case in test_cases:
        input_data = pd.DataFrame([case["data"]], columns=["elbow_angle", "body_alignment"])
        prediction = model.predict(input_data)[0]
        
        result = "PASSED" if prediction == case["expected"] else "FAILED"
        if prediction != case["expected"]:
            all_passed = False
            
        print(f"{case['desc']:<22} | {str(case['data']):<15} | {case['expected']:<10} | {prediction:<10} | {result}")
        
    print("-" * 65)
    
    if all_passed:
        print("\n✅ Verification Successful: Model is behaving perfectly!")
    else:
        print("\n❌ Verification Failed: Some test cases did not match expected output.")

if __name__ == "__main__":
    test_pushup_model()
