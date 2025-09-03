import numpy as np
from deepface import DeepFace
import json

def encode_face(img_path: str):
    """Generate face embedding using ArcFace."""
    try:
        embedding = DeepFace.represent(img_path=img_path, model_name="ArcFace")[0]["embedding"]
        return np.array(embedding)
    except Exception as e:
        print("Encoding error:", e)
        return None

def compare_faces(known_encoding, unknown_encoding, threshold=0.6):
    """Compare two embeddings using cosine similarity."""
    if known_encoding is None or unknown_encoding is None:
        return False

    known = np.array(json.loads(known_encoding))
    distance = np.linalg.norm(known - unknown_encoding)
    return distance < threshold
