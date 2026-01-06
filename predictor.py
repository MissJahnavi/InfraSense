
import os
import joblib
import cv2
import numpy as np
import tensorflow as tf

# ---------- CONFIG ----------
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
TEXT_MODEL_PATH = os.path.join(BASE_DIR, "models", "text", "severity_model.pkl")
VECTORIZER_PATH = os.path.join(BASE_DIR, "models", "text", "vectorizer.pkl")
IMAGE_MODEL_PATH = os.path.join(BASE_DIR, "models", "image", "image_model.h5")

LABELS = ['High', 'Low', 'Medium']
IMG_SIZE = 224

# ---------- LOAD MODELS ----------
# Global loading to avoid overhead per request
print("Loading Text Models...")
try:
    text_model = joblib.load(TEXT_MODEL_PATH)
    text_vectorizer = joblib.load(VECTORIZER_PATH)
    print("Text Models Loaded.")
except Exception as e:
    print(f"Error loading text models: {e}")
    text_model = None
    text_vectorizer = None

print("Loading Image Model...")
try:
    image_model = tf.keras.models.load_model(IMAGE_MODEL_PATH)
    print("Image Model Loaded.")
except Exception as e:
    print(f"Error loading image model: {e}")
    image_model = None


# ---------- TEXT OPS ----------
def predict_text_severity(text):
    """
    Returns:
    0 -> Low
    1 -> Medium
    2 -> High
    """
    if not text_model or not text_vectorizer:
        raise RuntimeError("Text model not loaded")
    
    text_vector = text_vectorizer.transform([text])
    prediction = text_model.predict(text_vector)[0]
    return int(prediction)

# ---------- IMAGE OPS ----------
def preprocess_image(image_bytes):
    # Convert bytes to numpy array
    nparr = np.frombuffer(image_bytes, np.uint8)
    img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)

    if img is None:
        raise ValueError("Could not decode image")

    img = cv2.resize(img, (IMG_SIZE, IMG_SIZE))
    img = img / 255.0
    img = np.expand_dims(img, axis=0)
    return img

def predict_image_severity(image_bytes):
    if not image_model:
        raise RuntimeError("Image model not loaded")

    img_processed = preprocess_image(image_bytes)
    preds = image_model.predict(img_processed)
    
    idx = np.argmax(preds)
    confidence = float(np.max(preds))
    
    return {
        "severity": LABELS[idx],
        "confidence": confidence,
        "raw_scores": preds.tolist()
    }

SEVERITY_TO_SCORE = {
    "Low": 0,
    "Medium": 1,
    "High": 2
}

# ---------- COMBINE OPS ----------
def combine_predictions(text_score, image_score, image_confidence):
    # Rule 1: Text HIGH dominates
    if text_score == 2:
        return "High"

    # Rule 2: Confident image HIGH can upgrade
    if image_score == 2 and image_confidence >= 0.7:
        return "High"

    # Rule 3: Weighted fusion
    final_score = (0.65 * text_score) + (0.35 * image_score)

    # Thresholds
    if final_score < 0.6:
        return "Low"
    elif final_score < 1.6:
        return "Medium"
    else:
        return "High"

def predict_final(text, image_bytes):
    # 1. Text Prediction
    text_score_val = predict_text_severity(text) # 0, 1, 2
    
    # 2. Image Prediction
    img_res = predict_image_severity(image_bytes)
    image_severity_str = img_res["severity"] # String
    image_score_val = SEVERITY_TO_SCORE[image_severity_str] # 0, 1, 2
    
    # 3. Combine
    final = combine_predictions(text_score_val, image_score_val, img_res["confidence"])
    
    return {
        "text_severity_index": text_score_val,
        "image_analysis": img_res,
        "final_severity": final
    }
