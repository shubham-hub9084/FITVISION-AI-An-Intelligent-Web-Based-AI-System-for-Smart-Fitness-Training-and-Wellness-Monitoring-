import pandas as pd
import numpy as np
import os

def generate_curl_dataset(output_path="data/curl_dataset.csv", num_samples=10000):
    print(f"Generating {num_samples} bicep curl data samples...")
    
    data = []
    
    # We will generate varying scenarios of bicep curl joint angles
    # Inputs: elbow_angle, hip_angle (Torso Swing), shoulder_flexion (Elbow Drift)
    
    # 1. PERFECT FORM (Label: 1)
    # Hip angle > 170 (Standing straight, no swinging)
    # Shoulder flexion < 15 (Elbows pinned to sides, not drifting forward)
    # Elbow angle varies (full range of motion: 30 to 170)
    num_perfect = int(num_samples * 0.4)
    for _ in range(num_perfect):
        elbow = np.random.uniform(30, 175)
        hip = np.random.uniform(170, 185) 
        shoulder_flexion = np.random.uniform(0, 15) 
        data.append([elbow, hip, shoulder_flexion, 1])
        
    # 2. TORSO SWINGING / CHEATING (Label: 0)
    # Hip angle < 165 (Leaning back to use momentum)
    num_swinging = int(num_samples * 0.25)
    for _ in range(num_swinging):
        elbow = np.random.uniform(30, 175)
        hip = np.random.uniform(130, 164) # Torso leaning back
        shoulder_flexion = np.random.uniform(0, 20) 
        data.append([elbow, hip, shoulder_flexion, 0])
        
    # 3. ELBOW DRIFT (Label: 0)
    # Shoulder flexion > 20 (Elbows moving forward, using front delts instead of biceps)
    num_drift = int(num_samples * 0.25)
    for _ in range(num_drift):
        elbow = np.random.uniform(30, 175)
        hip = np.random.uniform(165, 185) # Standing straight
        shoulder_flexion = np.random.uniform(21, 60) # Elbows flared forward
        data.append([elbow, hip, shoulder_flexion, 0])
        
    # 4. RANDOM BAD FORM / COMBINATIONS (Label: 0)
    # e.g., swinging AND drifting elbows
    num_random_bad = num_samples - (num_perfect + num_swinging + num_drift)
    for _ in range(num_random_bad):
        elbow = np.random.uniform(30, 175) 
        hip = np.random.uniform(120, 150) # Bad swinging
        shoulder_flexion = np.random.uniform(25, 70) # Bad drifting
        data.append([elbow, hip, shoulder_flexion, 0])
        
    # Convert to DataFrame
    df = pd.DataFrame(data, columns=["elbow_angle", "hip_angle", "shoulder_flexion", "label"])
    
    # Shuffle the dataset
    df = df.sample(frac=1.0, random_state=42).reset_index(drop=True)
    
    # Save to CSV
    os.makedirs(os.path.dirname(output_path), exist_ok=True)
    df.to_csv(output_path, index=False)
    
    print(f"Dataset generated successfully at {output_path}")
    print(f"Total Samples: {len(df)}")
    print("Label Distribution:")
    print(df['label'].value_counts(normalize=True))

if __name__ == "__main__":
    generate_curl_dataset()
