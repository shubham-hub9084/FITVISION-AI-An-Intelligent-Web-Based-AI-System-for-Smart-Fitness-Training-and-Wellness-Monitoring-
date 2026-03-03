import pandas as pd
import numpy as np
import os

def generate_shoulder_press_dataset(output_path="data/shoulder_press_dataset.csv", num_samples=10000):
    print(f"Generating {num_samples} shoulder press data samples...")
    
    data = []
    
    # Inputs: hip_angle (Lumbar Spine/Arch), r_angle (Right Elbow), l_angle (Left Elbow)
    
    # 1. PERFECT FORM (Label: 1)
    # Hip angle > 165 (Standing straight or seated with flat back, no severe hyperextension)
    # Left and Right elbow angles are roughly symmetrical (diff < 15 degrees)
    num_perfect = int(num_samples * 0.4)
    for _ in range(num_perfect):
        hip = np.random.uniform(165, 185) 
        r_angle = np.random.uniform(45, 175) # Full range of motion simulated
        l_angle = r_angle + np.random.uniform(-10, 10) # Symmetrical pushing
        data.append([hip, r_angle, l_angle, 1])
        
    # 2. HYPEREXTENDED LOWER BACK / ARCHING (Label: 0)
    # Hip angle < 160 (Dangerously leaning/arching backward to push weight)
    num_arching = int(num_samples * 0.25)
    for _ in range(num_arching):
        hip = np.random.uniform(120, 159) # Arching back
        r_angle = np.random.uniform(45, 175)
        l_angle = r_angle + np.random.uniform(-10, 10) 
        data.append([hip, r_angle, l_angle, 0])
        
    # 3. ASYMMETRICAL PUSHING (Label: 0)
    # Left and Right elbow angles are significantly different (diff > 20 degrees)
    # e.g., one arm is locking out while the other is struggling at 90 degrees
    num_asym = int(num_samples * 0.25)
    for _ in range(num_asym):
        hip = np.random.uniform(165, 185) 
        r_angle = np.random.uniform(45, 175)
        # Force a large difference (one arm lagging)
        if np.random.random() > 0.5:
            l_angle = r_angle + np.random.uniform(25, 60)
        else:
            l_angle = r_angle - np.random.uniform(25, 60)
            
        # Keep within valid joint ranges
        l_angle = max(30, min(180, l_angle))
        
        data.append([hip, r_angle, l_angle, 0])
        
    # 4. RANDOM BAD FORM / COMBINATIONS (Label: 0)
    # e.g., Arching back AND pushing asymmetrically
    num_random_bad = num_samples - (num_perfect + num_arching + num_asym)
    for _ in range(num_random_bad):
        hip = np.random.uniform(110, 150) # Severe arching
        r_angle = np.random.uniform(45, 175)
        l_angle = r_angle + np.random.uniform(30, 80) # Severe asymmetry
        l_angle = max(30, min(180, l_angle))
        data.append([hip, r_angle, l_angle, 0])
        
    # Convert to DataFrame
    df = pd.DataFrame(data, columns=["hip_angle", "r_angle", "l_angle", "label"])
    
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
    generate_shoulder_press_dataset()
