from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from datetime import date
from app.core.database import get_db
from app.core.deps import get_current_user
from app.models.user import User
from app.models.water import WaterEntry
from app.schemas.water import WaterLog, WaterResponse, DailyWaterTotal
from sqlalchemy import func

router = APIRouter()

@router.get("/", response_model=DailyWaterTotal)
def get_todays_water(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    today = date.today()
    total = db.query(func.sum(WaterEntry.amount)).filter(
        WaterEntry.user_id == current_user.id,
        WaterEntry.date == today
    ).scalar()
    
    return {"total_amount": total or 0, "date": today}

@router.post("/", response_model=WaterResponse)
def log_water(
    water: WaterLog,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    if water.amount <= 0:
        raise HTTPException(status_code=400, detail="Amount must be positive")
        
    entry = WaterEntry(
        amount=water.amount,
        user_id=current_user.id,
        date=date.today()
    )
    db.add(entry)
    db.commit()
    db.refresh(entry)
    return entry

@router.delete("/", status_code=status.HTTP_204_NO_CONTENT)
def reset_todays_water(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    today = date.today()
    db.query(WaterEntry).filter(
        WaterEntry.user_id == current_user.id,
        WaterEntry.date == today
    ).delete(synchronize_session=False)
    db.commit()
