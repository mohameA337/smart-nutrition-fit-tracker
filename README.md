# 🥗 Smart Nutrition & Fitness Tracker

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Python](https://img.shields.io/badge/python-3.10-blue.svg)
![React](https://img.shields.io/badge/react-18.0-blue.svg)
![FastAPI](https://img.shields.io/badge/FastAPI-0.95-green.svg)
![Docker](https://img.shields.io/badge/docker-compose-blue.svg)

A full-stack web application designed to help users manage their health goals. Track meals, log workouts, and get personalized nutrition advice from an AI Chatbot.

## 🚀 Live Demo
**[🔗 Click Here to View Production Site](https://smart-nutrition-fit-tracker-r0decasb3-mohamea337s-projects.vercel.app)**


---

## ✨ Features
*   **🔐 Secure Authentication**: User registration and login with JWT.
*   **📊 Dashboard**: Real-time overview of daily calories and progress.
*   **🍎 Meal Tracking**: Log food items with automatic calorie calculation.
*   **💪 Workout Tracking**: Log exercises and track calories burned.
*   **🤖 AI Nutritionist**: Chat with a Gemini-powered AI to get diet advice.
*   **📱 Responsive Design**: Works seamlessly on desktop and mobile.

---

## 🛠️ Tech Stack

### Backend
*   **Framework**: FastAPI (Python)
*   **Database**: PostgreSQL (Production) / SQLite (Dev)
*   **ORM**: SQLAlchemy
*   **AI**: Google Gemini API

### Frontend
*   **Framework**: React.js (Vite)
*   **Styling**: CSS Modules
*   **State Management**: React Hooks

### DevOps
*   **Containerization**: Docker & Docker Compose
*   **CI/CD**: GitHub Actions
*   **Hosting**: Render (Backend) & Vercel (Frontend)

---

## ⚙️ Installation & Setup

### Option 1: Using Docker (Recommended)
1.  **Clone the repository**:
    ```bash
    git clone https://github.com/mohameA337/smart-nutrition-fit-tracker.git
    cd your-repo
    ```
2.  **Set up Environment Variables**:
    Create a `.env` file in the `backend` folder:
    ```env
    GEMINI_API_KEY=your_google_api_key
    ```
3.  **Run with Docker Compose**:
    ```bash
    docker-compose up --build
    ```
4.  **Access the App**:
    *   Frontend: `http://localhost:3000`
    *   Backend API: `http://localhost:8000`

### Option 2: Manual Setup
**Backend**:
```bash
cd backend
pip install -r requirements.txt
uvicorn app.main:app --reload
```

**Frontend**:
```bash
cd frontend
npm install
npm run dev
```

---

## 🧪 Running Tests
This project uses `pytest` for automated backend testing.

```bash
cd backend
python -m pytest
```

---

## 📖 API Documentation
Once the backend is running, you can access the interactive API documentation (Swagger UI) at:
`http://localhost:8000/docs`

---

## 🤝 Contributing
1.  Fork the repository.
2.  Create a new branch (`git checkout -b feature/AmazingFeature`).
3.  Commit your changes (`git commit -m 'Add some AmazingFeature'`).
4.  Push to the branch (`git push origin feature/AmazingFeature`).
5.  Open a Pull Request.

---

## 📧 Contact
**Mohamed Khabiry** - [GitHub Profile](https://github.com/mohameA337)
