
import joblib
import pandas as pd
import os

def test_model(model_path="models/squat_model.joblib"):
    print(f"Loading model from {model_path}...")
    
    if not os.path.exists(model_path):
        print(f"Error: Model not found at {model_path}")
        return

    model = joblib.load(model_path)
    
    # Define test cases (Knee, Hip, Back)
    test_cases = [
        {"desc": "Perfect Rep", "data": [85, 90, 160], "expected": 1},
        {"desc": "Too Shallow", "data": [130, 130, 160], "expected": 0},
        {"desc": "Bad Back (Hunched)", "data": [85, 90, 120], "expected": 0},
        {"desc": "Too Deep (Unsafe)", "data": [50, 50, 150], "expected": 0},
    ]
    
    print("\nRunning Manual Verification Tests:")
    print("-" * 60)
    print(f"{'Description':<20} | {'Input (K,H,B)':<15} | {'Expected':<10} | {'Predicted':<10} | {'Result'}")
    print("-" * 60)
    
    all_passed = True
    
    for case in test_cases:
        input_data = pd.DataFrame([case["data"]], columns=["knee_angle", "hip_angle", "back_angle"])
        prediction = model.predict(input_data)[0]
        
        result = "PASSED" if prediction == case["expected"] else "FAILED"
        if prediction != case["expected"]:
            all_passed = False
            
        print(f"{case['desc']:<20} | {str(case['data']):<15} | {case['expected']:<10} | {prediction:<10} | {result}")
        
    print("-" * 60)
    
    if all_passed:
        print("\n✅ Verification Successful: Model is behaving as expected!")
    else:
        print("\n❌ Verification Failed: Some test cases did not match expected output.")

if __name__ == "__main__":
    test_model()
