from sqlalchemy import Column, Integer, String, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.core.database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    full_name = Column(String, nullable=True)
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)

    # Relationships
    meals = relationship("Meal", back_populates="owner")
    workouts = relationship("Workout", back_populates="owner")

class Meal(Base):
    __tablename__ = "meals"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    weight = Column(Integer)  # grams
    calories = Column(Integer)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    # Link to User
    user_id = Column(Integer, ForeignKey("users.id"))
    owner = relationship("User", back_populates="meals")

class Workout(Base):
    __tablename__ = "workouts"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    duration = Column(Integer) # minutes
    caloriesBurned = Column(Integer) 
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    # Link to User
    user_id = Column(Integer, ForeignKey("users.id"))
    owner = relationship("User", back_populates="workouts")