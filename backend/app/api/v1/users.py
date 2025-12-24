
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.core.deps import get_current_user
from app.models.user import User, WeightEntry
from app.schemas.user import UserOut, UserCreate, UserUpdate
from app.core.calculations import calculate_nutrition_goals
from datetime import datetime
from pydantic import BaseModel 

router = APIRouter()

@router.get("/me", response_model=UserOut)
def read_users_me(current_user: User = Depends(get_current_user)):
    return current_user

@router.put("/me", response_model=UserOut)
def update_user_me(
    user_in: UserUpdate, 
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    # Update user fields
    user_data = user_in.model_dump(exclude={"password"}, exclude_unset=True)
    
    # Check if calculation params changed
    calc_params = ["weight", "height", "age", "gender", "activity_rate", "goal_weight"]
    needs_recalc = any(k in user_data for k in calc_params)

    for key, value in user_data.items():
        setattr(current_user, key, value)

    if needs_recalc:
        # Determine goal type
        goal_type = "maintain"
        if current_user.goal_weight and current_user.weight:
            if current_user.goal_weight < current_user.weight:
                goal_type = "lose"
            elif current_user.goal_weight > current_user.weight:
                goal_type = "gain"

        goals = calculate_nutrition_goals(
            current_user.weight,
            current_user.height,
            current_user.age,
            current_user.gender,
            current_user.activity_rate,
            goal_type
        )
        # Update User with new goals
        current_user.daily_calorie_goal = goals.get("daily_calorie_goal", current_user.daily_calorie_goal)
        current_user.protein_goal = goals.get("protein_goal", current_user.protein_goal)
        current_user.carbs_goal = goals.get("carbs_goal", current_user.carbs_goal)
        current_user.fats_goal = goals.get("fats_goal", current_user.fats_goal)
        current_user.bmi = goals.get("bmi", current_user.bmi)

    db.add(current_user)
    db.commit()
    db.refresh(current_user)
    return current_user

# Weight History Endpoints

class WeightLog(BaseModel):
    weight: int

@router.post("/weight", response_model=UserOut)
def log_weight(
    entry: WeightLog,    
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Logs a new weight entry and updates current user weight.
    Recalculates goals based on new weight.
    """
    # 1. Create Entry
    new_entry = WeightEntry(weight=entry.weight, user_id=current_user.id, date=datetime.utcnow())
    db.add(new_entry)

    # 2. Update Current Weight
    current_user.weight = entry.weight
    
    # 3. Recalculate Logic (Same as update)
    goal_type = "maintain"
    if current_user.goal_weight:
        if current_user.goal_weight < current_user.weight:
            goal_type = "lose"
        elif current_user.goal_weight > current_user.weight:
            goal_type = "gain"

    goals = calculate_nutrition_goals(
        current_user.weight,
        current_user.height,
        current_user.age,
        current_user.gender,
        current_user.activity_rate,
        goal_type
    )

    current_user.daily_calorie_goal = goals.get("daily_calorie_goal", current_user.daily_calorie_goal)
    current_user.protein_goal = goals.get("protein_goal", current_user.protein_goal)
    current_user.carbs_goal = goals.get("carbs_goal", current_user.carbs_goal)
    current_user.fats_goal = goals.get("fats_goal", current_user.fats_goal)
    current_user.bmi = goals.get("bmi", current_user.bmi)

    db.add(current_user)
    db.commit()
    db.refresh(current_user)
    return current_user

@router.get("/weight/history")
def get_weight_history(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Returns list of past weights"""
    history = db.query(WeightEntry).filter(WeightEntry.user_id == current_user.id).order_by(WeightEntry.date.asc()).all()
    return history
