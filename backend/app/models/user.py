from sqlalchemy import Column, Integer, String, Float, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from datetime import datetime
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

    # Smart Goals (Auto-calculated)
    daily_calorie_goal = Column(Integer, default=2000)
    protein_goal = Column(Integer, default=150) # grams
    carbs_goal = Column(Integer, default=200)   # grams
    fats_goal = Column(Integer, default=70)     # grams
    bmi = Column(Float, nullable=True)

    # Relationships
    meals = relationship("Meal", back_populates="owner", cascade="all, delete-orphan")
    workouts = relationship("Workout", back_populates="owner", cascade="all, delete-orphan")
    water_entries = relationship("WaterEntry", back_populates="owner", cascade="all, delete-orphan")
    weight_history = relationship("WeightEntry", back_populates="owner", cascade="all, delete-orphan")

class WeightEntry(Base):
    __tablename__ = "weight_entries"

    id = Column(Integer, primary_key=True, index=True)
    weight = Column(Integer, nullable=False) # kg
    date = Column(DateTime, default=datetime.utcnow)
    user_id = Column(Integer, ForeignKey("users.id"))

    owner = relationship("User", back_populates="weight_history")
