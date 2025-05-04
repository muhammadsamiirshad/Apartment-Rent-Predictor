import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import seaborn as sns
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
from sklearn.neighbors import KNeighborsClassifier
from sklearn.naive_bayes import GaussianNB
from sklearn.ensemble import RandomForestClassifier
from sklearn.cluster import KMeans
from sklearn.metrics import accuracy_score, precision_score, recall_score, f1_score
import pickle
import json
import os
import io
import base64
from sqlalchemy.orm import Session
from app.database import Prediction, create_tables

# Define global variables for trained models
knn_model = None
nb_model = None
rf_model = None
kmeans_model = None
X_train = None
X_test = None
y_train = None
y_test = None
scaler = None
features = None

def generate_dataset():
    """Generate a synthetic apartment rental dataset with at least 10,000 rows and 20+ features"""
    np.random.seed(42)
    n_samples = 10000
    
    data = {
        # Price and size related features
        'price': np.random.exponential(scale=1000, size=n_samples) + 500,
        'size': np.random.normal(loc=80, scale=30, size=n_samples),
        'rooms': np.random.randint(1, 6, size=n_samples),
        'bathroom': np.random.randint(1, 4, size=n_samples),
        'parking': np.random.randint(0, 2, size=n_samples),
        'furnished': np.random.randint(0, 2, size=n_samples),
        'elevator': np.random.randint(0, 2, size=n_samples),
        'balcony': np.random.randint(0, 2, size=n_samples),
        'floor': np.random.randint(0, 20, size=n_samples),
        'age': np.random.exponential(scale=10, size=n_samples),
        'location_score': np.random.randint(1, 11, size=n_samples),
    }
    
    # Create DataFrame
    df = pd.DataFrame(data)
    
    # Create a target variable (rental category)
    # Category 0: Budget, 1: Standard, 2: Premium
    conditions = [
        (df['price'] < 800) & (df['size'] < 70),
        (df['price'] >= 800) & (df['price'] < 1500),
        (df['price'] >= 1500)
    ]
    choices = [0, 1, 2]
    df['category'] = np.select(conditions, choices, default=1)
    
    # Save to CSV - fixed path using os.path.join
    data_dir = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), 'data')
    os.makedirs(data_dir, exist_ok=True)
    csv_path = os.path.join(data_dir, 'apartment_data.csv')
    
    print(f"Saving dataset to {csv_path}")
    print(f"Dataset shape: {df.shape}")
    print(f"Dataset columns: {df.columns.tolist()}")
    
    df.to_csv(csv_path, index=False)
    
    return df

def preprocess_data(df):
    """Preprocess the data for machine learning models"""
    # Select features and target
    X = df[['price', 'size', 'rooms', 'bathroom', 'parking', 'furnished', 
            'elevator', 'balcony', 'floor', 'age', 'location_score']]
    y = df['category']
    
    # Split data
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
    
    # Scale features
    scaler = StandardScaler()
    X_train_scaled = scaler.fit_transform(X_train)
    X_test_scaled = scaler.transform(X_test)
    
    return X_train_scaled, X_test_scaled, y_train, y_test, scaler, X.columns

def train_models(X_train, y_train):
    """Train KNN, Naive Bayes, and Random Forest models"""
    # KNN model
    knn = KNeighborsClassifier(n_neighbors=5)
    knn.fit(X_train, y_train)
    
    # Naive Bayes model
    nb = GaussianNB()
    nb.fit(X_train, y_train)
    
    # Random Forest model
    rf = RandomForestClassifier(n_estimators=100, random_state=42)
    rf.fit(X_train, y_train)
    
    return knn, nb, rf

def train_kmeans(X_train, n_clusters=3):
    """Train KMeans clustering model"""
    kmeans = KMeans(n_clusters=n_clusters, random_state=42)
    kmeans.fit(X_train)
    
    return kmeans

def evaluate_model(model, X_test, y_test):
    """Evaluate model performance using accuracy, precision, recall, and F1 score"""
    y_pred = model.predict(X_test)
    
    accuracy = accuracy_score(y_test, y_pred)
    precision = precision_score(y_test, y_pred, average='weighted')
    recall = recall_score(y_test, y_pred, average='weighted')
    f1 = f1_score(y_test, y_pred, average='weighted')
    
    return {
        'accuracy': accuracy,
        'precision': precision,
        'recall': recall,
        'f1_score': f1
    }

def initialize_models():
    """Initialize and train all models"""
    global knn_model, nb_model, rf_model, kmeans_model
    global X_train, X_test, y_train, y_test, scaler, features
    
    # Get the correct path for the data directory
    data_dir = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), 'data')
    os.makedirs(data_dir, exist_ok=True)
    
    # Check if dataset exists, if not generate it
    data_path = os.path.join(data_dir, 'apartment_data.csv')
    if not os.path.exists(data_path):
        df = generate_dataset()
    else:
        df = pd.read_csv(data_path)
    
    # Preprocess data
    X_train, X_test, y_train, y_test, scaler, features = preprocess_data(df)
    
    # Train classification models
    knn_model, nb_model, rf_model = train_models(X_train, y_train)
    
    # Train clustering model
    kmeans_model = train_kmeans(X_train)
    
    # Create tables
    create_tables()
    
    # Save the models
    save_models()

def save_models():
    """Save trained models to disk"""
    # Get the correct path for the models/saved directory
    saved_dir = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'saved')
    os.makedirs(saved_dir, exist_ok=True)
    
    with open(os.path.join(saved_dir, 'knn_model.pkl'), 'wb') as f:
        pickle.dump(knn_model, f)
    
    with open(os.path.join(saved_dir, 'nb_model.pkl'), 'wb') as f:
        pickle.dump(nb_model, f)
    
    with open(os.path.join(saved_dir, 'rf_model.pkl'), 'wb') as f:
        pickle.dump(rf_model, f)
    
    with open(os.path.join(saved_dir, 'kmeans_model.pkl'), 'wb') as f:
        pickle.dump(kmeans_model, f)
    
    with open(os.path.join(saved_dir, 'scaler.pkl'), 'wb') as f:
        pickle.dump(scaler, f)

def load_models():
    """Load trained models from disk"""
    global knn_model, nb_model, rf_model, kmeans_model, scaler
    
    # Get the correct path for the models/saved directory
    saved_dir = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'saved')
    
    try:
        with open(os.path.join(saved_dir, 'knn_model.pkl'), 'rb') as f:
            knn_model = pickle.load(f)
        
        with open(os.path.join(saved_dir, 'nb_model.pkl'), 'rb') as f:
            nb_model = pickle.load(f)
        
        with open(os.path.join(saved_dir, 'rf_model.pkl'), 'rb') as f:
            rf_model = pickle.load(f)
        
        with open(os.path.join(saved_dir, 'kmeans_model.pkl'), 'rb') as f:
            kmeans_model = pickle.load(f)
        
        with open(os.path.join(saved_dir, 'scaler.pkl'), 'rb') as f:
            scaler = pickle.load(f)
            
        return True
    except Exception as e:
        print(f"Error loading models: {e}")
        return False

def make_prediction(features_array, model_name="random_forest"):
    """Make a prediction using the specified model"""
    # Load models if not initialized
    if knn_model is None or nb_model is None or rf_model is None:
        load_models_success = load_models()
        if not load_models_success:
            initialize_models()
    
    # Scale features
    scaled_features = scaler.transform(features_array)
    
    # Select model
    if model_name == "knn":
        prediction = knn_model.predict(scaled_features)
        probabilities = knn_model.predict_proba(scaled_features)
    elif model_name == "naive_bayes":
        prediction = nb_model.predict(scaled_features)
        probabilities = nb_model.predict_proba(scaled_features)
    else:  # default to random_forest
        prediction = rf_model.predict(scaled_features)
        probabilities = rf_model.predict_proba(scaled_features)
    
    return prediction, probabilities

def get_model_metrics():
    """Get evaluation metrics for all models"""
    # Load models if not initialized
    if knn_model is None or nb_model is None or rf_model is None:
        load_models_success = load_models()
        if not load_models_success:
            initialize_models()
    
    # Evaluate models
    knn_metrics = evaluate_model(knn_model, X_test, y_test)
    nb_metrics = evaluate_model(nb_model, X_test, y_test)
    rf_metrics = evaluate_model(rf_model, X_test, y_test)
    
    return [
        {"algorithm": "K-Nearest Neighbors", **knn_metrics},
        {"algorithm": "Naive Bayes", **nb_metrics},
        {"algorithm": "Random Forest", **rf_metrics}
    ]

def get_clustering_results():
    """Get K-Means clustering results"""
    # Load models if not initialized
    if kmeans_model is None:
        load_models_success = load_models()
        if not load_models_success:
            initialize_models()
    
    # Get cluster labels and centroids
    cluster_labels = kmeans_model.labels_
    centroids = kmeans_model.cluster_centers_
    
    # Prepare clustering results
    results = []
    for cluster_id in range(len(centroids)):
        # Get data points in this cluster
        cluster_points_idx = np.where(cluster_labels == cluster_id)[0]
        cluster_points = X_train[cluster_points_idx]
        
        # Convert to list of dictionaries for JSON serialization
        data_points = []
        for point in cluster_points[:100]:  # Limit to 100 points per cluster
            point_dict = {f"feature_{i}": float(val) for i, val in enumerate(point)}
            data_points.append(point_dict)
        
        # Convert centroid to dictionary
        centroid_dict = {f"feature_{i}": float(val) for i, val in enumerate(centroids[cluster_id])}
        
        results.append({
            "cluster_id": int(cluster_id),
            "data_points": data_points,
            "centroid": centroid_dict
        })
    
    return results

def get_visualization(plot_type):
    """Generate visualizations for model evaluation and clustering results"""
    plt.figure(figsize=(10, 6))
    
    if plot_type == "model_comparison":
        # Compare model performance
        metrics = get_model_metrics()
        
        algorithms = [m["algorithm"] for m in metrics]
        accuracy = [m["accuracy"] for m in metrics]
        precision = [m["precision"] for m in metrics]
        recall = [m["recall"] for m in metrics]
        f1 = [m["f1_score"] for m in metrics]
        
        x = np.arange(len(algorithms))
        width = 0.2
        
        plt.bar(x - width*1.5, accuracy, width, label='Accuracy')
        plt.bar(x - width/2, precision, width, label='Precision')
        plt.bar(x + width/2, recall, width, label='Recall')
        plt.bar(x + width*1.5, f1, width, label='F1 Score')
        
        plt.xlabel('Algorithm')
        plt.ylabel('Score')
        plt.title('Model Comparison')
        plt.xticks(x, algorithms)
        plt.legend()
        
    elif plot_type == "clustering":
        # Visualize clustering results using first two dimensions
        if kmeans_model is None:
            load_models_success = load_models()
            if not load_models_success:
                initialize_models()
        
        # Use PCA to reduce to 2D for visualization
        from sklearn.decomposition import PCA
        pca = PCA(n_components=2)
        X_train_2d = pca.fit_transform(X_train)
        centroids_2d = pca.transform(kmeans_model.cluster_centers_)
        
        # Plot cluster points and centroids
        plt.scatter(X_train_2d[:, 0], X_train_2d[:, 1], c=kmeans_model.labels_, cmap='viridis', alpha=0.5)
        plt.scatter(centroids_2d[:, 0], centroids_2d[:, 1], c='red', marker='X', s=100)
        
        plt.xlabel('PCA Component 1')
        plt.ylabel('PCA Component 2')
        plt.title('K-Means Clustering Results')
        
    elif plot_type == "feature_importance":
        # Feature importance from Random Forest
        if rf_model is None:
            load_models_success = load_models()
            if not load_models_success:
                initialize_models()
        
        importances = rf_model.feature_importances_
        indices = np.argsort(importances)[::-1]
        feature_names = features
        
        plt.bar(range(len(importances)), importances[indices])
        plt.xticks(range(len(importances)), [feature_names[i] for i in indices], rotation=90)
        plt.xlabel('Features')
        plt.ylabel('Importance')
        plt.title('Feature Importance (Random Forest)')
    
    # Convert plot to base64 string
    buf = io.BytesIO()
    plt.tight_layout()
    plt.savefig(buf, format='png')
    buf.seek(0)
    plt.close()
    
    # Convert to JSON-serializable format
    img_str = base64.b64encode(buf.read()).decode('utf-8')
    return json.dumps({'image': img_str})

def store_prediction(db: Session, features, prediction, model_name):
    """Store prediction in SQLite database"""
    db_prediction = Prediction(
        price=features.price,
        size=features.size,
        rooms=features.rooms,
        bathroom=features.bathroom,
        parking=features.parking,
        furnished=features.furnished,
        elevator=features.elevator,
        balcony=features.balcony,
        floor=features.floor,
        age=features.age,
        location_score=features.location_score,
        prediction_result=int(prediction[0]),
        model_used=model_name
    )
    db.add(db_prediction)
    db.commit()
    db.refresh(db_prediction)
    return db_prediction

def get_stored_predictions(db: Session):
    """Get predictions from SQLite database"""
    predictions = db.query(Prediction).order_by(Prediction.timestamp.desc()).limit(100).all()
    
    # Convert to list of dictionaries
    result = []
    for p in predictions:
        result.append({
            "id": p.id,
            "price": p.price,
            "size": p.size,
            "rooms": p.rooms,
            "bathroom": p.bathroom,
            "parking": p.parking,
            "furnished": p.furnished,
            "elevator": p.elevator,
            "balcony": p.balcony,
            "floor": p.floor,
            "age": p.age,
            "location_score": p.location_score,
            "prediction_result": p.prediction_result,
            "model_used": p.model_used,
            "timestamp": p.timestamp.isoformat()
        })
    
    return result