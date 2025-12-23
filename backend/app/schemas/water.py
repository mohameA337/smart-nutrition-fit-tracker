from pydantic import BaseModel
from datetime import date

class WaterLog(BaseModel):
    amount: int  # in ml

class WaterResponse(BaseModel):
    id: int
    amount: int
    date: date
    user_id: int

    class Config:
        from_attributes = True

class DailyWaterTotal(BaseModel):
    total_amount: int
    date: date
