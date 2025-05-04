from sqlalchemy import create_engine, Column, Integer, Float, String, DateTime
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
import datetime

# Create SQLite database engine
SQLALCHEMY_DATABASE_URL = "sqlite:///./apartment_rentals.db"
engine = create_engine(SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False})

# Create sessionmaker
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Create base class for SQLAlchemy models
Base = declarative_base()

# Define SQLAlchemy models
class Prediction(Base):
    __tablename__ = "predictions"

    id = Column(Integer, primary_key=True, index=True)
    price = Column(Float)
    size = Column(Float)
    rooms = Column(Integer)
    bathroom = Column(Integer)
    parking = Column(Integer)
    furnished = Column(Integer)
    elevator = Column(Integer)
    balcony = Column(Integer)
    floor = Column(Integer)
    age = Column(Float)
    location_score = Column(Integer)
    prediction_result = Column(Integer)
    model_used = Column(String)
    timestamp = Column(DateTime, default=datetime.datetime.utcnow)

# Create tables
def create_tables():
    Base.metadata.create_all(bind=engine)

# Dependency to get DB session
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()