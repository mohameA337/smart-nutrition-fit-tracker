from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from app.core.database import get_db
from app.core.deps import get_current_user
from app.models.meal import Meal
from app.models.user import User
from app.schemas.activity import MealCreate, MealOut

router = APIRouter()

@router.get("/", response_model=List[MealOut])
def get_meals(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return db.query(Meal).filter(Meal.user_id == current_user.id).all()

@router.post("/", response_model=MealOut)
def create_meal(
    meal: MealCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    new_meal = Meal(**meal.model_dump(), user_id=current_user.id)
    db.add(new_meal)
    db.commit()
    db.refresh(new_meal)
    return new_meal

@router.delete("/{meal_id}")
def delete_meal(
    meal_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    meal = db.query(Meal).filter(Meal.id == meal_id, Meal.user_id == current_user.id).first()
    if not meal:
        raise HTTPException(status_code=404, detail="Meal not found")
    
    db.delete(meal)
    db.commit()
    return {"message": "Meal deleted"}
