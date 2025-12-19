# Deployment Guide

Since you have the **GitHub Student Developer Pack**, you have access to excellent premium hosting for free.

## Recommendation: DigitalOcean (Best Option)
**Why?** You get **$200 in credits** with the Student Pack. This allows you to rent a virtual server (Droplet) and run your application **exactly as it is now** using Docker Compose. You won't need to change your code structure.

### Step 1: Get Your Server
1.  Claim your DigitalOcean offer from the [GitHub Student Pack](https://education.github.com/pack).
2.  Create a new **Droplet**.
3.  Choose an image: **Docker** (under "Marketplace" tab).
4.  Choose a plan: **Basic** ($6-12/month plan is plenty).
5.  Create the droplet.

### Step 2: Deploy
1.  **SSH into your server**: `ssh root@your_server_ip`
2.  **Clone your repository**:
    ```bash
    git clone https://github.com/yourusername/your-repo.git
    cd your-repo
    ```
3.  **Setup Environment**:
    *   Create your `.env` file in the backend folder:
        ```bash
        cd backend
        nano .env
        # Paste your GEMINI_API_KEY and other settings
        # Press Ctrl+X, Y, Enter to save
        ```
4.  **Run with Docker Compose**:
    ```bash
    cd ..
    docker-compose up -d --build
    ```
5.  **Access**: Your app will be live at `http://your_server_ip:3000`.

---

## Alternative: Render + Vercel (Best "Forever Free")
If you want to split the frontend and backend to free-tier services.

### Part 1: Database & Backend (Render)
1.  Create an account on [Render](https://render.com).
2.  **Database**:
    *   Click "New" -> "PostgreSQL".
    *   Name it `nutrition-db`.
    *   Copy the `Internal Database URL`.
3.  **Backend**:
    *   Click "New" -> "Web Service".
    *   Connect your GitHub repo.
    *   **Root Directory**: `backend`.
    *   **Build Command**: `pip install -r requirements.txt`.
    *   **Start Command**: `uvicorn app.main:app --host 0.0.0.0 --port 10000`.
    *   **Environment Variables**:
        *   `DATABASE_URL`: Paste the Internal Database URL from step 2.
        *   `GEMINI_API_KEY`: Paste your key.
        *   `PYTHON_VERSION`: `3.10.0`

### Part 2: Frontend (Vercel)
1.  Create an account on [Vercel](https://vercel.com).
2.  Click "Add New" -> "Project".
3.  Import your GitHub repo.
4.  **Root Directory**: Edit this to select `frontend`.
5.  **Environment Variables**:
    *   You need to change your frontend code to read the API URL from an env var instead of hardcoding `localhost`.
    *   Add `VITE_API_URL` = `https://your-render-backend-url.onrender.com/api/v1`.
6.  Deploy.

## GitHub Student Pack Tools to Use
*   **DigitalOcean**: $200 credit (1 year). Best for Docker hosting.
*   **Namecheap**: 1 year free domain name (e.g., `yourname-fitness.me`).
*   **Heroku**: Student credits (alternative to Render).
*   **Termius**: Premium SSH client (great for managing your DigitalOcean server).
