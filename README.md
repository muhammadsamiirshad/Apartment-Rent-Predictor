# ApartmentRentPredictor

A full-stack machine learning application for apartment rental price prediction and clustering using Python (FastAPI) and Next.js.

## Project Structure

```
📦 ApartmentRentPredictor
 ┣ 📂 backend
 ┃ ┣ 📂 app
 ┃ ┃ ┣ 📜 __init__.py
 ┃ ┃ ┣ 📜 database.py
 ┃ ┃ ┗ 📜 main.py
 ┃ ┣ 📂 data
 ┃ ┃ ┗ 📜 apartment_data.csv (generated on first run)
 ┃ ┣ 📂 models
 ┃ ┃ ┣ 📂 saved (trained models stored here)
 ┃ ┃ ┣ 📜 __init__.py
 ┃ ┃ ┗ 📜 ml_models.py
 ┃ ┗ 📜 main.py
 ┣ 📂 frontend
 ┃ ┣ 📂 public
 ┃ ┣ 📂 src
 ┃ ┃ ┣ 📂 app
 ┃ ┃ ┃ ┣ 📂 clustering
 ┃ ┃ ┃ ┃ ┗ 📜 page.tsx
 ┃ ┃ ┃ ┣ 📂 history
 ┃ ┃ ┃ ┃ ┗ 📜 page.tsx
 ┃ ┃ ┃ ┣ 📂 models
 ┃ ┃ ┃ ┃ ┗ 📜 page.tsx
 ┃ ┃ ┃ ┣ 📂 predict
 ┃ ┃ ┃ ┃ ┗ 📜 page.tsx
 ┃ ┃ ┃ ┣ 📜 globals.css
 ┃ ┃ ┃ ┣ 📜 layout.tsx
 ┃ ┃ ┃ ┗ 📜 page.tsx
 ┃ ┗ 📜 package.json
 ┗ 📜 README.md
```

## Features

- **Machine Learning Models**:
  - Classification: K-Nearest Neighbors, Naive Bayes, Random Forest
  - Clustering: K-Means
  - Model evaluation with metrics (accuracy, precision, recall, F1 score)
  - Feature importance visualization
  
- **Backend (FastAPI + SQLite)**:
  - RESTful API endpoints for predictions
  - Database for storing prediction history
  - Synthetic dataset generation
  - Visualization endpoints
  
- **Frontend (Next.js + Tailwind CSS)**:
  - Responsive dashboard UI
  - Apartment rental prediction form
  - Model comparison visualization
  - Clustering analysis
  - Prediction history table

## Requirements

- Python 3.8+
- Node.js 18+
- npm or yarn

## Setup Instructions

### Backend Setup

1. Navigate to the backend directory:
   ```
   cd backend
   ```

2. Create a virtual environment (optional but recommended):
   ```
   python -m venv venv
   ```

3. Activate the virtual environment:
   - Windows:
     ```
     venv\Scripts\activate
     ```
   - macOS/Linux:
     ```
     source venv/bin/activate
     ```

4. Install the required Python packages:
   ```
   pip install fastapi uvicorn sqlalchemy scikit-learn pandas matplotlib seaborn numpy pytest
   ```

5. Run the FastAPI backend server:
   ```
   python main.py
   ```
   
   The server will start at `http://localhost:8000`

### Frontend Setup

1. Navigate to the frontend directory:
   ```
   cd frontend
   ```

2. Install the required npm packages:
   ```
   npm install
   ```

3. Run the Next.js development server:
   ```
   npm run dev
   ```
   
   The frontend will be available at `http://localhost:3000`

## Usage

1. Open your browser and navigate to `http://localhost:3000`

2. Use the dashboard to:
   - Make apartment rental predictions using different ML models
   - Compare model performance metrics
   - Visualize apartment clusters
   - View prediction history

## API Endpoints

- `GET /`: Welcome message
- `POST /predict/`: Make a prediction with a specified model
- `GET /model-metrics/`: Get model evaluation metrics
- `GET /clustering/`: Get K-Means clustering results
- `GET /visualizations/{plot_type}`: Get visualizations (model_comparison, clustering, feature_importance)
- `GET /predictions/`: Get previous prediction history

## Dataset

On first run, the application generates a synthetic apartment rental dataset with features like:
- Price
- Size
- Room count
- Bathroom count
- Additional amenities (parking, furnished, elevator, balcony)
- Building details (floor, age)
- Location score

## Machine Learning Process

1. **Data Processing**: Standardization of features
2. **Model Training**: KNN, Naive Bayes, Random Forest classifiers
3. **Evaluation**: Metrics calculation (accuracy, precision, recall, F1)
4. **Clustering**: K-Means for market segmentation
5. **Visualization**: Performance charts and clustering analysis

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.