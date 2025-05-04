from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import pandas as pd
import numpy as np
from typing import List, Dict
from pydantic import BaseModel
from .database import get_db, engine, SessionLocal
from sqlalchemy.orm import Session
import models.ml_models as ml_models
import json

app = FastAPI(title="Apartment Rental ML API")

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Define Pydantic models for request/response
class ApartmentFeatures(BaseModel):
    price: float
    size: float
    rooms: int
    bathroom: int
    parking: int
    furnished: int
    elevator: int
    balcony: int
    floor: int
    age: float
    location_score: int
    
class PredictionResponse(BaseModel):
    prediction: int
    probability: Dict[str, float]
    
class TrainingResult(BaseModel):
    algorithm: str
    accuracy: float
    precision: float
    recall: float
    f1_score: float
    
class ClusteringResult(BaseModel):
    cluster_id: int
    data_points: List[Dict[str, float]]
    centroid: Dict[str, float]

# Initialize ML models
@app.on_event("startup")
def startup_db_client():
    try:
        ml_models.initialize_models()
    except Exception as e:
        print(f"Error initializing models: {e}")

# Endpoints for prediction and model metrics
@app.get("/")
def read_root():
    return {"message": "Welcome to Apartment Rental ML API"}

@app.post("/predict/", response_model=PredictionResponse)
def predict_rental(features: ApartmentFeatures, model_name: str = "random_forest"):
    try:
        # Convert features to numpy array for prediction
        feature_array = np.array([[
            features.price, features.size, features.rooms, features.bathroom,
            features.parking, features.furnished, features.elevator, 
            features.balcony, features.floor, features.age, features.location_score
        ]])
        
        # Make prediction
        prediction, probabilities = ml_models.make_prediction(feature_array, model_name)
        
        # Convert probabilities to dictionary
        probs_dict = {str(i): float(prob) for i, prob in enumerate(probabilities[0])}
        
        # Store prediction in database
        db = SessionLocal()
        try:
            ml_models.store_prediction(db, features, prediction, model_name)
        finally:
            db.close()
            
        return {"prediction": int(prediction[0]), "probability": probs_dict}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Prediction error: {str(e)}")

@app.get("/model-metrics/", response_model=List[TrainingResult])
def get_model_metrics():
    try:
        metrics = ml_models.get_model_metrics()
        return metrics
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error retrieving metrics: {str(e)}")

@app.get("/clustering/", response_model=List[ClusteringResult])
def get_clustering_results():
    try:
        clustering_results = ml_models.get_clustering_results()
        return clustering_results
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error retrieving clustering results: {str(e)}")

@app.get("/visualizations/{plot_type}")
def get_visualization(plot_type: str):
    try:
        visualization_data = ml_models.get_visualization(plot_type)
        return {"data": json.loads(visualization_data)}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error retrieving visualization: {str(e)}")

@app.get("/predictions/", response_model=List[Dict])
def get_previous_predictions(db: Session = Depends(get_db)):
    try:
        predictions = ml_models.get_stored_predictions(db)
        return predictions
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error retrieving predictions: {str(e)}")