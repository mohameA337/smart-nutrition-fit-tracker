from sqlalchemy import Column, Integer, String, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.core.database import Base

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
