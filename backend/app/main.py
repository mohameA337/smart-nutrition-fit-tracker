import time
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.exc import OperationalError
from app.core.database import engine, Base
from app.api.v1 import meals, auth, workouts, users, chatbot, water

# --- RETRY LOGIC FOR DB CONNECTION ---
# This prevents the app from crashing if the DB is waking up
MAX_RETRIES = 10
RETRY_DELAY = 2  # seconds

def create_tables_with_retry():
    retries = 0
    while retries < MAX_RETRIES:
        try:
            Base.metadata.create_all(bind=engine)
            print("Database connected and tables created!")
            return
        except OperationalError:
            retries += 1
            print(f"Database not ready... retrying ({retries}/{MAX_RETRIES})")
            time.sleep(RETRY_DELAY)
    print("Could not connect to Database after multiple attempts.")

# Run the retry logic
create_tables_with_retry()

app = FastAPI(title="Smart Nutrition & Fitness Tracker")

# --- CORS CONFIGURATION ---
origins = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
    "http://localhost:5173", # Vite
    "http://127.0.0.1:5173",
    "https://smart-nutrition-fit-tracker-p9lpdfggi-mohamea337s-projects.vercel.app", # Vercel Deployment
    "https://nutrition-backend-2s5b.onrender.com", # Self-reference

]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router, prefix="/api/v1/auth", tags=["Auth"])
app.include_router(meals.router, prefix="/api/v1/meals", tags=["Meals"])
app.include_router(workouts.router, prefix="/api/v1/workouts", tags=["Workouts"])
app.include_router(users.router, prefix="/api/v1/users", tags=["Users"])
app.include_router(water.router, prefix="/api/v1/water", tags=["Water"])
app.include_router(chatbot.router, prefix="/api/v1/chat", tags=["Chatbot"])

@app.get("/")
def read_root():
    return {"message": "System is running"}