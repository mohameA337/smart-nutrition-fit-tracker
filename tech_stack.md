# Project Technology Stack

## Backend
*   **Language**: Python 3.x
*   **Framework**: FastAPI
    *   High-performance, easy-to-learn, fast to code, ready for production.
*   **Key Libraries**:
    *   `SQLAlchemy`: ORM for database interactions.
    *   `Pydantic`: Data validation and settings management.
    *   `Python-Jose`: For JWT (JSON Web Token) authentication.
    *   `Google-GenerativeAI`: For the AI Chatbot features.

## Database
*   **Primary (Docker)**: PostgreSQL
    *   Used when running the application via Docker Compose.
    *   Robust, open-source relational database.
*   **Development (Local)**: SQLite
    *   Used for local testing without Docker.
    *   Lightweight, file-based database.

## API Architecture
*   **Style**: REST API (Representational State Transfer)
*   **Structure**:
    *   Resources are accessed via standard HTTP methods (`GET`, `POST`, `PUT`, `DELETE`).
    *   Endpoints are organized by resource (e.g., `/api/v1/meals`, `/api/v1/auth`).
    *   Data format: JSON.
    *   Documentation: OpenAPI (Swagger UI) is automatically generated at `/docs`.

## Frontend
*   **Library**: React.js
*   **Build Tool**: Vite
*   **Styling**: CSS Modules / Standard CSS
*   **HTTP Client**: Axios (for making requests to the Backend REST API).
