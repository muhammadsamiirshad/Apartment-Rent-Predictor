import uvicorn
from app.main import app
from app.database import create_tables

if __name__ == "__main__":
    # Create database tables
    create_tables()
    
    # Run FastAPI server on default port 8000
    uvicorn.run(app, host="0.0.0.0", port=8000)