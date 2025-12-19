from sqlalchemy import Column, Integer, String
from sqlalchemy.orm import relationship
from app.core.database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    full_name = Column(String, nullable=True)
    
    # Profile Fields
    gender = Column(String, nullable=True)
    age = Column(Integer, nullable=True)
    height = Column(Integer, nullable=True) # cm
    weight = Column(Integer, nullable=True) # kg
    target_weight = Column(Integer, nullable=True) # kg
    activity_rate = Column(String, nullable=True)
    start_weight = Column(Integer, nullable=True) # kg
    goal_weight = Column(Integer, nullable=True) # kg

    # Relationships
    meals = relationship("Meal", back_populates="owner", cascade="all, delete-orphan")
    workouts = relationship("Workout", back_populates="owner", cascade="all, delete-orphan")