import csv
import random
import os

def generate_squat_data(num_samples=1000):
    """
    Generate synthetic data for Squat classification.
    Features: Knee Angle, Hip Angle, Back Angle
    Label: 1 (Correct), 0 (Incorrect)
    """
    data = []
    
    for _ in range(num_samples):
        # Determine if we want to generate a "Correct" or "Incorrect" sample
        # Let's target 50/50 balance
        is_correct = random.choice([True, False])
        
        if is_correct:
            # Generate metrics for a PERFECT squat
            
            # Knee Angle: 70-100 degrees (Deep enough, not harmful)
            knee_angle = random.uniform(70, 100)
            
            # Hip Angle: 70-110 degrees (Good depth)
            hip_angle = random.uniform(70, 110)
            
            # Back Angle: > 140 degrees (Straight back)
            back_angle = random.uniform(145, 175)
            
            label = 1
            
        else:
            # Generate metrics for an INCORRECT squat (Common mistakes)
            mistake_type = random.choice(['too_shallow', 'back_bent', 'too_deep'])
            
            if mistake_type == 'too_shallow':
                # Knees didn't bend enough
                knee_angle = random.uniform(110, 160)
                hip_angle = random.uniform(110, 160)
                back_angle = random.uniform(140, 170) # Back might still be okay
                
            elif mistake_type == 'back_bent':
                # Good depth but bad back
                knee_angle = random.uniform(70, 100) 
                hip_angle = random.uniform(70, 110)
                back_angle = random.uniform(90, 135) # Hunched over
                
            elif mistake_type == 'too_deep':
                # Unsafe depth
                knee_angle = random.uniform(30, 65)
                hip_angle = random.uniform(30, 65)
                back_angle = random.uniform(130, 170)
                
            label = 0
        
        # Add some noise to simulate real-world sensor jitter (optional)
        # knee_angle += random.uniform(-2, 2)
        
        data.append([knee_angle, hip_angle, back_angle, label])
        
    return data

def save_data(data, filename="data/squat_dataset.csv"):
    os.makedirs(os.path.dirname(filename), exist_ok=True)
    
    with open(filename, 'w', newline='') as f:
        writer = csv.writer(f)
        writer.writerow(["knee_angle", "hip_angle", "back_angle", "label"])
        writer.writerows(data)
    
    print(f"Successfully generated {len(data)} samples to {filename}")

if __name__ == "__main__":
    print("Generating synthetic Squat dataset...")
    dataset = generate_squat_data(2000)
    save_data(dataset)
