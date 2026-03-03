import pandas as pd
import numpy as np
import os

def generate_pushup_dataset(output_path="data/pushup_dataset.csv", num_samples=10000):
    print(f"Generating {num_samples} push-up data samples...")
    
    data = []
    
    # We will generate varying scenarios of push-up joint angles
    # Inputs: elbow_angle, body_alignment (Shoulder-Hip-Ankle)
    
    # 1. PERFECT FORM (Label: 1)
    # Body is roughly straight (160 to 180 degrees)
    # Elbow angle varies to simulate different points in the movement (mostly the bottom 70-100 deg)
    num_perfect = int(num_samples * 0.4)
    for _ in range(num_perfect):
        elbow = np.random.uniform(70, 150) # From deep pushup to moving up
        body = np.random.uniform(160, 185) # Straight body alignment
        data.append([elbow, body, 1])
        
    # 2. HIPS SAGGING (Label: 0)
    # Body alignment drops below 160
    num_sagging = int(num_samples * 0.2)
    for _ in range(num_sagging):
        elbow = np.random.uniform(70, 150)
        body = np.random.uniform(120, 159) # Hips dropping towards floor
        data.append([elbow, body, 0])
        
    # 3. HIPS TOO HIGH / PIKE (Label: 0)
    # Body alignment goes above 190 (forming a tent)
    num_high_hips = int(num_samples * 0.2)
    for _ in range(num_high_hips):
        elbow = np.random.uniform(70, 150)
        body = np.random.uniform(190, 230) # Butt in the air
        data.append([elbow, body, 0])
        
    # 4. HALF REPS / NOT DEEP ENOUGH (Label: 0)
    # Simulating the static "holding" or barely dipping, combined with strict deep checks.
    # We want the ML to know that if elbow is e.g. 140+ at the bottom of a rep, it's not a full rep.
    # But since model works per-frame, we focus on form failure. 
    # Just generic bad form random noise to make the model robust.
    num_random_bad = num_samples - (num_perfect + num_sagging + num_high_hips)
    for _ in range(num_random_bad):
        elbow = np.random.uniform(40, 180) 
        # Pick extreme body angles
        if np.random.random() > 0.5:
            body = np.random.uniform(90, 140) # Severe sag
        else:
            body = np.random.uniform(210, 260) # Severe pike
        data.append([elbow, body, 0])
        
    # Convert to DataFrame
    df = pd.DataFrame(data, columns=["elbow_angle", "body_alignment", "label"])
    
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
    generate_pushup_dataset()
