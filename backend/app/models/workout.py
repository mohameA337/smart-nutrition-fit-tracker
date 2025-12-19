from sqlalchemy import Column, Integer, String, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.core.database import Base

class Workout(Base):
    __tablename__ = "workouts"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    duration = Column(Integer) # minutes
    calories_burned = Column(Integer) 
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    # Link to User
    user_id = Column(Integer, ForeignKey("users.id"))
    owner = relationship("User", back_populates="workouts")
