
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.core.security import create_access_token, verify_password, get_password_hash
from app.models.user import User
from app.schemas.user import UserCreate, UserLogin, Token, UserOut
from app.core.calculations import calculate_nutrition_goals # [NEW]

router = APIRouter()

@router.post("/register", response_model=UserOut)
def register(user_in: UserCreate, db: Session = Depends(get_db)):
    # Check if existing
    user = db.query(User).filter(User.email == user_in.email).first()
    if user:
        raise HTTPException(
            status_code=400,
            detail="Email already registered",
        )
    
    # Calculate Goals [NEW]
    goals = calculate_nutrition_goals(
        user_in.weight, 
        user_in.height, 
        user_in.age, 
        user_in.gender, 
        user_in.activity_rate, 
        "maintain" # Default or derive from goal_weight?
    )
    # Better logic: Determine goal based on start vs goal weight
    goal_type = "maintain"
    if user_in.goal_weight and user_in.weight:
        if user_in.goal_weight < user_in.weight:
            goal_type = "lose"
        elif user_in.goal_weight > user_in.weight:
            goal_type = "gain"

    goals = calculate_nutrition_goals(
        user_in.weight, 
        user_in.height, 
        user_in.age, 
        user_in.gender, 
        user_in.activity_rate, 
        goal_type
    )

    # Create User
    new_user = User(
        email=user_in.email,
        hashed_password=get_password_hash(user_in.password),
        full_name=user_in.full_name,
        gender=user_in.gender,
        age=user_in.age,
        height=user_in.height,
        weight=user_in.weight,
        target_weight=user_in.target_weight, # Deprecated? Schema has target_weight AND goal_weight?
        # Let's fix schema confusion. Model has target_weight AND goal_weight.
        # UserCreate schema has both.
        # Let's just map them.
        activity_rate=user_in.activity_rate,
        start_weight=user_in.start_weight,
        goal_weight=user_in.goal_weight,

        # New Fields
        daily_calorie_goal=goals.get("daily_calorie_goal"),
        protein_goal=goals.get("protein_goal"),
        carbs_goal=goals.get("carbs_goal"),
        fats_goal=goals.get("fats_goal"),
        bmi=goals.get("bmi")
    )
    
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return new_user

@router.post("/login", response_model=Token)
def login(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == form_data.username).first()
    if not user or not verify_password(form_data.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    access_token = create_access_token(data={"sub": user.email})
    return {"access_token": access_token, "token_type": "bearer"}