from sqlalchemy import Column, Integer, Date, ForeignKey
from sqlalchemy.orm import relationship
from datetime import date
from app.core.database import Base

class WaterEntry(Base):
    __tablename__ = "water_entries"

    id = Column(Integer, primary_key=True, index=True)
    amount = Column(Integer, nullable=False)  # in ml
    date = Column(Date, default=date.today, nullable=False, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)

    owner = relationship("User", back_populates="water_entries")
