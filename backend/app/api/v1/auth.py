from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.models.user import User
from app.schemas.user import UserCreate, UserLogin, Token, UserOut
from app.core.security import get_password_hash, verify_password, create_access_token
from datetime import timedelta, datetime

router = APIRouter()

# 1. SIGNUP
@router.post("/register", response_model=UserOut)
def signup(user: UserCreate, db: Session = Depends(get_db)):
    # Check if user already exists
    db_user = db.query(User).filter(User.email == user.email).first()
    if db_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    # Create new user
    hashed_password = get_password_hash(user.password)
    new_user = User(
        email=user.email, 
        hashed_password=hashed_password, 
        full_name=user.full_name,
        gender=user.gender,
        age=user.age,
        height=user.height,
        weight=user.weight,
        target_weight=user.target_weight,
        activity_rate=user.activity_rate,
        start_weight=user.start_weight,
        goal_weight=user.goal_weight
    )
    
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return new_user

# 2. LOGIN
@router.post("/login", response_model=Token)
def login(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    # Find user
    print(f"DEBUG: Login attempt for username/email: '{form_data.username}'")
    user = db.query(User).filter(User.email == form_data.username).first()
    
    # Check password
    if not user:
        print(f"DEBUG: User not found for email: '{form_data.username}'")
    elif not verify_password(form_data.password, user.hashed_password):
        print(f"DEBUG: Password mismatch for user: '{form_data.username}'")

    if not user or not verify_password(form_data.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    # Generate Token
    access_token_expires = timedelta(minutes=30)
    access_token = create_access_token(
        data={"sub": user.email}, expires_delta=access_token_expires
    )
    
    return {"access_token": access_token, "token_type": "bearer"}