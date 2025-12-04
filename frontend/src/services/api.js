import axios from 'axios';

// In a real app, this would be an env variable
const API_URL = 'http://localhost:8000'; 

export const mockLogWorkout = async (workoutData) => {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve({
                id: Date.now(),
                ...workoutData
            });
        }, 800);
    });
};

// Placeholder for future real API calls
// export const logWorkout = async (data) => {
//     const response = await axios.post(`${API_URL}/workouts`, data);
//     return response.data;
// }