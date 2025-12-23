import axios from 'axios';

// In a real app, this would be an env variable. 
// Using /api/v1 because that is what your backend logs show: "GET /api/v1/users/me"
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1';

// Create axios instance
const api = axios.create({
    baseURL: API_URL,
});

// Create axios instance

// Add interceptor to inject token
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});

// --- AUTH ---
export const login = async (credentials) => {
    // Backend expects OAuth2PasswordRequestForm (form-data)
    const formData = new FormData();
    formData.append('username', credentials.email);
    formData.append('password', credentials.password);

    const response = await api.post('/auth/login', formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
    return response.data;
};

export const register = async (userData) => {
    // Backend expects JSON for signup
    const response = await api.post('/auth/register', userData);
    return response.data;
};

// --- CHATBOT ---
export const sendChatMessage = async (message) => {
    const response = await api.post("/chat/", { message });
    return response.data;
};

// --- MEALS ---
export const getMeals = async () => {
    const response = await api.get('/meals/');
    return response.data;
};

export const logMeal = async (mealData) => {
    // Backend expects: name, weight, calories
    const response = await api.post('/meals/', mealData);
    return response.data;
};

export const deleteMeal = async (mealId) => {
    const response = await api.delete(`/meals/${mealId}`);
    return response.data;
};

// --- WORKOUTS ---
export const getWorkouts = async () => {
    const response = await api.get('/workouts/');
    return response.data;
};

export const logWorkout = async (workoutData) => {
    // Backend expects: name, duration, calories_burned
    const response = await api.post('/workouts/', workoutData);
    return response.data;
};

export const deleteWorkout = async (workoutId) => {
    const response = await api.delete(`/workouts/${workoutId}`);
    return response.data;
};

// --- USER PROFILE ---
export const getUserProfile = async () => {
    const response = await api.get('/users/me');
    return response.data;
};

export const updateUserProfile = async (userData) => {
    const response = await api.put('/users/me', userData);
    return response.data;
};

// --- WATER ---
export const getWaterIntake = async () => {
    const response = await api.get('/water/');
    return response.data;
};

export const logWater = async (amount) => {
    const response = await api.post('/water/', { amount });
    return response.data;
};

export const resetWaterIntake = async () => {
    const response = await api.delete('/water/');
    return response.data;
};

// --- WEIGHT & ANALYTICS ---
export const logWeight = async (weight) => {
    const response = await api.post('/users/weight', { weight });
    return response.data;
};

export const getWeightHistory = async () => {
    const response = await api.get('/users/weight/history');
    return response.data;
};

export default api;