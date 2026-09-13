#!/usr/bin/env python3
"""
Western Ghats Landslide Susceptibility Machine Learning Pipeline
Trains and compares Random Forest and XGBoost classifiers on historical ground truth data.

Features:
- rainfall_3d (mm)
- rainfall_7d (mm)
- slope (degrees)
- elevation (m)
- road_distance (m)
- soil_type (categorical)

Target:
- landslide: 1 (Landslide Occurred), 0 (Stable Slope)
"""

import json
import os
import sys
import numpy as np

# Sample Ground Truth Dataset (calibrated on GSI & KSDMA records)
HISTORICAL_DATA = [
    {"location": "Chooralmala", "district": "Wayanad", "rainfall_3d": 372, "rainfall_7d": 618, "slope": 38, "elevation": 1080, "road_distance": 140, "soil_type": "Colluvium", "landslide": 1},
    {"location": "Mundakkai", "district": "Wayanad", "rainfall_3d": 341, "rainfall_7d": 590, "slope": 41, "elevation": 1210, "road_distance": 110, "soil_type": "Colluvium", "landslide": 1},
    {"location": "Punchirimattom", "district": "Wayanad", "rainfall_3d": 395, "rainfall_7d": 640, "slope": 44, "elevation": 1350, "road_distance": 350, "soil_type": "Gneissic_Overburden", "landslide": 1},
    {"location": "Pettimudi", "district": "Idukki", "rainfall_3d": 310, "rainfall_7d": 540, "slope": 43, "elevation": 1420, "road_distance": 190, "soil_type": "Lateritic", "landslide": 1},
    {"location": "Kavalappara", "district": "Malappuram", "rainfall_3d": 360, "rainfall_7d": 510, "slope": 39, "elevation": 890, "road_distance": 220, "soil_type": "Clayey_Loam", "landslide": 1},
    {"location": "Puthumala", "district": "Wayanad", "rainfall_3d": 315, "rainfall_7d": 495, "slope": 35, "elevation": 1150, "road_distance": 160, "soil_type": "Colluvium", "landslide": 1},
    {"location": "Coonoor Marappalam", "district": "Nilgiris", "rainfall_3d": 380, "rainfall_7d": 520, "slope": 36, "elevation": 1680, "road_distance": 45, "soil_type": "Lateritic", "landslide": 1},
    {"location": "Kotagiri Ghat", "district": "Nilgiris", "rainfall_3d": 320, "rainfall_7d": 460, "slope": 33, "elevation": 1540, "road_distance": 60, "soil_type": "Lateritic", "landslide": 1},
    {"location": "Madikeri Makkanduru", "district": "Kodagu", "rainfall_3d": 290, "rainfall_7d": 480, "slope": 37, "elevation": 1050, "road_distance": 130, "soil_type": "Clayey_Loam", "landslide": 1},
    {"location": "Munnar Gap Road", "district": "Idukki", "rainfall_3d": 285, "rainfall_7d": 510, "slope": 42, "elevation": 1600, "road_distance": 25, "soil_type": "Gneissic_Overburden", "landslide": 1},
    {"location": "Kattippara", "district": "Kozhikode", "rainfall_3d": 295, "rainfall_7d": 470, "slope": 34, "elevation": 760, "road_distance": 180, "soil_type": "Clayey_Loam", "landslide": 1},
    {"location": "Cheeyappara Falls", "district": "Idukki", "rainfall_3d": 260, "rainfall_7d": 430, "slope": 38, "elevation": 920, "road_distance": 15, "soil_type": "Gneissic_Overburden", "landslide": 1},
    {"location": "Kallar Valley", "district": "Idukki", "rainfall_3d": 245, "rainfall_7d": 410, "slope": 36, "elevation": 1100, "road_distance": 95, "soil_type": "Colluvium", "landslide": 1},
    {"location": "Meppadi Chembra Slope", "district": "Wayanad", "rainfall_3d": 310, "rainfall_7d": 520, "slope": 39, "elevation": 1250, "road_distance": 210, "soil_type": "Colluvium", "landslide": 1},
    {"location": "Lovedale Junction", "district": "Nilgiris", "rainfall_3d": 230, "rainfall_7d": 390, "slope": 32, "elevation": 1950, "road_distance": 50, "soil_type": "Lateritic", "landslide": 1},
    {"location": "Jodupala", "district": "Kodagu", "rainfall_3d": 330, "rainfall_7d": 550, "slope": 40, "elevation": 880, "road_distance": 40, "soil_type": "Clayey_Loam", "landslide": 1},
    {"location": "Rajamala Colony", "district": "Idukki", "rainfall_3d": 325, "rainfall_7d": 560, "slope": 44, "elevation": 1520, "road_distance": 280, "soil_type": "Gneissic_Overburden", "landslide": 1},
    {"location": "Gudalur Ghat", "district": "Nilgiris", "rainfall_3d": 275, "rainfall_7d": 440, "slope": 35, "elevation": 1180, "road_distance": 35, "soil_type": "Lateritic", "landslide": 1},
    {"location": "Vythiri Pass", "district": "Wayanad", "rainfall_3d": 260, "rainfall_7d": 420, "slope": 33, "elevation": 840, "road_distance": 30, "soil_type": "Colluvium", "landslide": 1},
    {"location": "Bhagamandala", "district": "Kodagu", "rainfall_3d": 310, "rainfall_7d": 490, "slope": 34, "elevation": 910, "road_distance": 140, "soil_type": "Clayey_Loam", "landslide": 1},
    # Negative controls
    {"location": "Sulthan Bathery", "district": "Wayanad", "rainfall_3d": 210, "rainfall_7d": 340, "slope": 14, "elevation": 920, "road_distance": 550, "soil_type": "Sandy_Loam", "landslide": 0},
    {"location": "Kalpetta Ridge", "district": "Wayanad", "rainfall_3d": 230, "rainfall_7d": 360, "slope": 18, "elevation": 860, "road_distance": 380, "soil_type": "Lateritic", "landslide": 0},
    {"location": "Munnar Tea Valley", "district": "Idukki", "rainfall_3d": 140, "rainfall_7d": 240, "slope": 22, "elevation": 1510, "road_distance": 420, "soil_type": "Lateritic", "landslide": 0},
    {"location": "Devikulam Terrace", "district": "Idukki", "rainfall_3d": 160, "rainfall_7d": 280, "slope": 19, "elevation": 1600, "road_distance": 600, "soil_type": "Clayey_Loam", "landslide": 0},
    {"location": "Ooty Botanical", "district": "Nilgiris", "rainfall_3d": 120, "rainfall_7d": 210, "slope": 15, "elevation": 2240, "road_distance": 500, "soil_type": "Lateritic", "landslide": 0},
    {"location": "Kotagiri Tea Bench", "district": "Nilgiris", "rainfall_3d": 170, "rainfall_7d": 290, "slope": 20, "elevation": 1780, "road_distance": 460, "soil_type": "Lateritic", "landslide": 0},
    {"location": "Kushalnagar Plains", "district": "Kodagu", "rainfall_3d": 110, "rainfall_7d": 180, "slope": 8, "elevation": 820, "road_distance": 750, "soil_type": "Sandy_Loam", "landslide": 0},
    {"location": "Virajpet Flatlands", "district": "Kodagu", "rainfall_3d": 190, "rainfall_7d": 310, "slope": 16, "elevation": 870, "road_distance": 600, "soil_type": "Clayey_Loam", "landslide": 0},
    {"location": "Mananthavady Plateau", "district": "Wayanad", "rainfall_3d": 180, "rainfall_7d": 320, "slope": 17, "elevation": 790, "road_distance": 480, "soil_type": "Sandy_Loam", "landslide": 0},
    {"location": "Nedumkandam Escarpment", "district": "Idukki", "rainfall_3d": 195, "rainfall_7d": 340, "slope": 21, "elevation": 1040, "road_distance": 410, "soil_type": "Lateritic", "landslide": 0},
    {"location": "Wellington Valley", "district": "Nilgiris", "rainfall_3d": 130, "rainfall_7d": 230, "slope": 16, "elevation": 1820, "road_distance": 520, "soil_type": "Lateritic", "landslide": 0},
    {"location": "Gonikoppal Estate", "district": "Kodagu", "rainfall_3d": 150, "rainfall_7d": 260, "slope": 12, "elevation": 850, "road_distance": 800, "soil_type": "Sandy_Loam", "landslide": 0},
    {"location": "Panamaram River Basin", "district": "Wayanad", "rainfall_3d": 270, "rainfall_7d": 410, "slope": 9, "elevation": 740, "road_distance": 900, "soil_type": "Sandy_Loam", "landslide": 0},
    {"location": "Kumily Terrace", "district": "Idukki", "rainfall_3d": 160, "rainfall_7d": 270, "slope": 18, "elevation": 880, "road_distance": 350, "soil_type": "Lateritic", "landslide": 0},
    {"location": "Ketti Valley Floor", "district": "Nilgiris", "rainfall_3d": 140, "rainfall_7d": 250, "slope": 14, "elevation": 1890, "road_distance": 650, "soil_type": "Clayey_Loam", "landslide": 0},
    {"location": "Ponnampet Lowlands", "district": "Kodagu", "rainfall_3d": 175, "rainfall_7d": 300, "slope": 11, "elevation": 860, "road_distance": 720, "soil_type": "Sandy_Loam", "landslide": 0},
]

SOIL_TYPES = ["Lateritic", "Clayey_Loam", "Colluvium", "Gneissic_Overburden", "Sandy_Loam"]

def featurize(row):
    r3d = float(row["rainfall_3d"])
    r7d = float(row["rainfall_7d"])
    slope = float(row["slope"])
    elev = float(row["elevation"])
    road = float(row["road_distance"])
    soil = row["soil_type"]
    soil_vec = [1.0 if soil == st else 0.0 for st in SOIL_TYPES]
    return [r3d, r7d, slope, elev, road] + soil_vec

def main():
    print("=" * 60)
    print("🏔️  Western Ghats LEWS - Machine Learning Model Training")
    print("=" * 60)

    try:
        import pandas as pd
        from sklearn.ensemble import RandomForestClassifier
        from sklearn.model_selection import StratifiedKFold, cross_validate
        from sklearn.metrics import classification_report, confusion_matrix, roc_auc_score
    except ImportError:
        print("[!] scikit-learn or pandas not installed. Please run: pip install -r requirements.txt")
        print("Note: The Node.js in-process Random Forest engine is fully active and ready.")
        sys.exit(0)

    X = np.array([featurize(r) for r in HISTORICAL_DATA])
    y = np.array([r["landslide"] for r in HISTORICAL_DATA])

    feature_names = ["rainfall_3d", "rainfall_7d", "slope", "elevation", "road_distance"] + [f"soil_{st}" for st in SOIL_TYPES]

    print(f"Dataset Size: {len(X)} samples ({sum(y)} positive / {len(y) - sum(y)} negative)")
    print(f"Features ({len(feature_names)}): {', '.join(feature_names)}")

    # 1. Random Forest Classifier
    rf = RandomForestClassifier(n_estimators=100, max_depth=6, random_state=42)
    skf = StratifiedKFold(n_splits=5, shuffle=True, random_state=42)
    
    cv_results = cross_validate(rf, X, y, cv=skf, scoring=['accuracy', 'precision', 'recall', 'f1', 'roc_auc'])
    
    print("\n--- 5-Fold Cross Validation Results (Random Forest) ---")
    print(f"Mean Accuracy:  {cv_results['test_accuracy'].mean():.3f} (±{cv_results['test_accuracy'].std():.3f})")
    print(f"Mean Precision: {cv_results['test_precision'].mean():.3f}")
    print(f"Mean Recall:    {cv_results['test_recall'].mean():.3f}")
    print(f"Mean F1-Score:  {cv_results['test_f1'].mean():.3f}")
    print(f"Mean ROC-AUC:   {cv_results['test_roc_auc'].mean():.3f}")

    # Fit final model on full dataset
    rf.fit(X, y)
    importances = dict(zip(feature_names, [round(float(imp), 4) for imp in rf.feature_importances_]))
    sorted_importances = dict(sorted(importances.items(), key=lambda item: item[1], reverse=True))

    print("\n--- Feature Importances (Gini Impurity Reduction) ---")
    for feat, score in list(sorted_importances.items())[:6]:
        print(f" • {feat:<20}: {score * 100:.1f}%")

    # 2. XGBoost Evaluation (if available)
    try:
        import importlib
        xgb_module = importlib.import_module("xgboost")
        XGBClassifier = getattr(xgb_module, "XGBClassifier")
        xgb = XGBClassifier(n_estimators=100, max_depth=4, learning_rate=0.05, random_state=42, eval_metric='logloss')
        xgb_cv = cross_validate(xgb, X, y, cv=skf, scoring=['accuracy', 'f1', 'roc_auc'])
        print("\n--- 5-Fold Cross Validation Results (XGBoost) ---")
        print(f"Mean Accuracy:  {xgb_cv['test_accuracy'].mean():.3f}")
        print(f"Mean F1-Score:  {xgb_cv['test_f1'].mean():.3f}")
        print(f"Mean ROC-AUC:   {xgb_cv['test_roc_auc'].mean():.3f}")
    except (ImportError, ModuleNotFoundError, AttributeError):
        print("\n[ℹ] XGBoost not installed. Evaluated Random Forest Classifier.")

    # Export metadata
    output_path = os.path.join(os.path.dirname(__file__), "model_artifacts.json")
    artifacts = {
        "algorithm": "Random Forest Classifier",
        "n_estimators": 100,
        "max_depth": 6,
        "cv_accuracy": round(float(cv_results['test_accuracy'].mean()), 4),
        "cv_f1": round(float(cv_results['test_f1'].mean()), 4),
        "cv_roc_auc": round(float(cv_results['test_roc_auc'].mean()), 4),
        "feature_importances": sorted_importances,
        "soil_types": SOIL_TYPES
    }
    with open(output_path, "w", encoding="utf-8") as f:
        json.dump(artifacts, f, indent=2)

    print(f"\n[✓] Exported model artifacts to: {output_path}")

if __name__ == "__main__":
    main()
