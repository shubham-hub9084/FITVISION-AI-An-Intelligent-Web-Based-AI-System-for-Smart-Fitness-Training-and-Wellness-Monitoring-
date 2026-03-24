import pandas as pd
import joblib
from sklearn.metrics import accuracy_score, classification_report, confusion_matrix
import json
import os

exercises = ["squat", "pushup", "curl", "shoulder_press"]
results = {}

for ex in exercises:
    data_path = f"../data/{ex}_dataset.csv"
    model_path = f"../models/{ex}_model.joblib"
    
    if os.path.exists(data_path) and os.path.exists(model_path):
        df = pd.read_csv(data_path)
        X = df.drop(columns=["label"])
        y = df["label"]
        
        clf = joblib.load(model_path)
        y_pred = clf.predict(X)
        
        acc = accuracy_score(y, y_pred)
        report = classification_report(y, y_pred, output_dict=True)
        cm = confusion_matrix(y, y_pred).tolist()
        
        # We evaluate on the entire dataset to get overall true metrics stored in the model.
        # Note: The model was trained on 80% and tested on 20% originally. 
        # Evaluating on 100% gives an overall sense of fit.
        
        results[ex] = {
            "accuracy": acc,
            "report": report,
            "confusion_matrix": cm,
            "samples": len(df),
            "features": list(X.columns)
        }

with open("metrics_output.json", "w") as f:
    json.dump(results, f, indent=4)
print("Metrics saved to metrics_output.json")
