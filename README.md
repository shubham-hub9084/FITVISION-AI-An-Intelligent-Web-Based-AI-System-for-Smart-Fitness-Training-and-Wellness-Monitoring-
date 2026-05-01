# FitVision AI

FitVision AI is an intelligent, AI-powered fitness trainer that uses computer vision to track your exercises in real-time. It provides actionable form correction, tracks your repetitions, and maintains a history of your workout progress to help you achieve your fitness goals safely and efficiently.

## 🚀 Features

- **Real-time Pose Estimation**: Powered by MediaPipe and OpenCV, tracking your body landmarks with high precision.
- **Exercise Tracking**: Currently supports tracking for Squats, Push-ups, Bicep Curls, and Shoulder Press.
- **Instant Form Correction**: Get real-time feedback on your form and posture to maximize workout efficiency.
- **Safety Alerts**: Receive immediate alerts if you're performing an exercise in a way that could cause injury.
- **Progress Tracking & Analytics**: Comprehensive dashboards to visualize your workout history, achievements, and improvements over time.
- **Modern User Interface**: A sleek, responsive dashboard built with React and Tailwind CSS.

## 🛠️ Technology Stack

- **Frontend**: React, Vite, Tailwind CSS
- **Backend**: Python, Flask, Flask-CORS
- **AI & Computer Vision**: OpenCV, MediaPipe, scikit-learn, NumPy
- **Database**: PostgreSQL (via psycopg2)
- **Data Processing**: Pandas, Matplotlib

## 📋 Prerequisites

Before you begin, ensure you have the following installed:
- [Python 3.10+](https://www.python.org/downloads/)
- [Node.js and npm](https://nodejs.org/)
- [PostgreSQL](https://www.postgresql.org/)

## ⚙️ Installation & Setup

### 1. Clone the Repository
```bash
git clone https://github.com/your-username/FitVision-AI.git
cd FitVision-AI
```

### 2. Backend Setup
Navigate to the backend directory, create a virtual environment, and install the required packages.
```bash
cd backend
python -m venv ai_env

# On Windows
.\ai_env\Scripts\activate
# On macOS/Linux
source ai_env/bin/activate

# Install dependencies
pip install -r requirements.txt
```

**Environment Variables:**
Create a `.env` file in the `backend` directory with your database configurations and any other required secrets.

**Run the Backend:**
```bash
python app.py
# The Flask server will start on http://localhost:5000
```

### 3. Frontend Setup
Open a new terminal window, navigate to the frontend directory, and install the Node modules.
```bash
cd frontend
npm install

# Start the Vite development server
npm run dev
```
The React application will be accessible at the URL provided by Vite (usually `http://localhost:5173`).

## 📚 Project Structure

- `backend/`: Contains the Flask server, AI models (`src/`), and database logic (`database/`).
- `frontend/`: Contains the React application, UI components, and Tailwind styling.

## 📄 License

This project is licensed under the MIT License.
