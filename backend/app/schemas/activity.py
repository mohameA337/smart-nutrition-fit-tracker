from pydantic import BaseModel
from datetime import datetime

# --- Meal Schemas ---
class MealBase(BaseModel):
    name: str
    weight: int
    calories: int

class MealCreate(MealBase):
    pass

class MealOut(MealBase):
    id: int
    created_at: datetime
    
    class Config:
        from_attributes = True

# --- Workout Schemas ---
class WorkoutBase(BaseModel):
    name: str
    duration: int
    caloriesBurned: int 

class WorkoutCreate(WorkoutBase):
    pass

class WorkoutOut(WorkoutBase):
    id: int
    created_at: datetime

    class Config:
        from_attributes = True