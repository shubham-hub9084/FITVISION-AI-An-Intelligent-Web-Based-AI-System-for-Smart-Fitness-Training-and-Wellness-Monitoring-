import pandas as pd
import joblib
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import accuracy_score, classification_report
import os

def train_curl_model(data_path="data/curl_dataset.csv", model_path="models/curl_model.joblib"):
    print(f"Loading data from {data_path}...")
    
    if not os.path.exists(data_path):
        print(f"Error: Dataset not found at {data_path}")
        return
    
    df = pd.read_csv(data_path)
    
    # We generated elbow_angle, hip_angle, shoulder_flexion, label
    X = df[["elbow_angle", "hip_angle", "shoulder_flexion"]]
    y = df["label"]
    
    # Split training and testing data
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
    
    # Initialize Random Forest Classifier
    print("Training Random Forest Classifier on Bicep Curl metrics...")
    clf = RandomForestClassifier(n_estimators=100, random_state=42)
    clf.fit(X_train, y_train)
    
    # Evaluate model
    print("Evaluating model...")
    y_pred = clf.predict(X_test)
    accuracy = accuracy_score(y_test, y_pred)
    
    print(f"\nModel Accuracy: {accuracy * 100:.2f}%")
    print("\nClassification Report:")
    print(classification_report(y_test, y_pred))
    
    # Save model
    os.makedirs(os.path.dirname(model_path), exist_ok=True)
    joblib.dump(clf, model_path)
    print(f"Model saved to {model_path}")

if __name__ == "__main__":
    train_curl_model()
