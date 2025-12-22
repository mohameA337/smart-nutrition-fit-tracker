import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

// Imports from the new modular structure
import { PREDEFINED_MEALS, PREDEFINED_WORKOUTS } from '../data/constants';
import { THEMES } from '../theme/theme';
import { 
  logWorkout, 
  logMeal, 
  getMeals, 
  getWorkouts, 
  deleteMeal, 
  deleteWorkout, 
  getUserProfile 
} from '../services/api';

import MealCard from '../components/MealCard';
import WorkoutCard from '../components/WorkoutCard';
import StatCard from '../components/StatCard';

const Dashboard = () => {
  const navigate = useNavigate();
  
  // Theme State
  const [isDarkMode, setIsDarkMode] = useState(true);
  const theme = isDarkMode ? THEMES.dark : THEMES.light;
  const toggleTheme = () => setIsDarkMode(!isDarkMode);

  // --- Water Tracker State ---
  const [waterIntake, setWaterIntake] = useState(0);
  
  // 1. Initialize weight from LocalStorage
  const [userWeight, setUserWeight] = useState(() => {
    try {
      const savedUser = localStorage.getItem("user");
      const parsedUser = savedUser ? JSON.parse(savedUser) : null;
      return parsedUser && parsedUser.weight ? parseFloat(parsedUser.weight) : 0;
    } catch (error) {
      console.error("Error parsing user weight:", error);
      return 0; 
    }
  });

  // Helper to handle logout
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate('/login');
  };

  // 2. Fetch fresh user data on mount
  useEffect(() => {
    const fetchUserData = async () => {
      const token = localStorage.getItem("token");
      console.log("Token in Dashboard:", token ? "Found" : "Missing"); // Debugging

      if (!token) {
        navigate('/login');
        return;
      }

      try {
        const profile = await getUserProfile();
        console.log("Profile fetched:", profile); // Debugging
        
        if (profile && profile.weight) {
          setUserWeight(profile.weight);
          const existing = JSON.parse(localStorage.getItem("user") || '{}');
          localStorage.setItem("user", JSON.stringify({ ...existing, ...profile }));
        }
      } catch (err) {
        console.error("Error fetching user profile:", err);
        if (err.response && err.response.status === 401) {
          console.warn("Session expired or invalid token. Logging out.");
          handleLogout();
        }
      }
    };

    fetchUserData();
  }, [navigate]);

  // Calculate Goal: 35ml per kg
  const waterGoal = Math.round(userWeight * 35); 
  const waterPercentage = waterGoal > 0 ? Math.min((waterIntake / waterGoal) * 100, 100) : 0;

  const handleAddWater = (amount) => {
    setWaterIntake(prev => {
      const newValue = prev + amount;
      return newValue > 5000 ? 5000 : newValue;
    });
  };

  const handleResetWater = () => setWaterIntake(0);

  // Meals State
  const [selectedMealId, setSelectedMealId] = useState('');
  const [mealWeight, setMealWeight] = useState('');
  const [dailyMeals, setDailyMeals] = useState([]);
  const [mealLoading, setMealLoading] = useState(false);

  // Exercises State
  const [selectedWorkoutId, setSelectedWorkoutId] = useState('');
  const [workoutDuration, setWorkoutDuration] = useState('');
  const [dailyExercises, setDailyExercises] = useState([]);
  const [exerciseLoading, setExerciseLoading] = useState(false);

  // --- Data Fetching (Logs) ---
  useEffect(() => {
    const fetchData = async () => {
      try {
        const meals = await getMeals();
        setDailyMeals(meals);
        const workouts = await getWorkouts();
        setDailyExercises(workouts);
      } catch (error) {
        console.error("Failed to fetch data", error);
        if (error.response && error.response.status === 401) {
          handleLogout();
        }
      }
    };
    fetchData();
  }, [navigate]);

  // --- Handlers: Meals ---
  const handleMealSelect = (e) => setSelectedMealId(e.target.value);
  const handleWeightChange = (e) => setMealWeight(e.target.value);

  const handleAddMeal = async () => {
    if (!selectedMealId || !mealWeight) return;

    setMealLoading(true);

    const meal = PREDEFINED_MEALS.find(m => m.id === selectedMealId);
    if (!meal) {
      setMealLoading(false);
      return;
    }
    
    const weightInt = parseInt(mealWeight);
    if (isNaN(weightInt) || weightInt <= 0) {
      alert("Please enter a valid weight in grams.");
      setMealLoading(false);
      return;
    }

    const totalCalories = Math.round(weightInt * meal.caloriesPerGram);
    const mealData = {
      name: meal.name,
      weight: weightInt,
      calories: totalCalories,
    };
    
    try {
      const savedMeal = await logMeal(mealData);
      setDailyMeals([...dailyMeals, savedMeal]);
      setSelectedMealId('');
      setMealWeight('');
    } catch (err) {
      console.error(err);
      alert("Failed to add meal");
    } finally {
      setMealLoading(false);
    }
  };

  const handleDeleteMeal = async (id) => {
    try {
      await deleteMeal(id);
      setDailyMeals(dailyMeals.filter(meal => meal.id !== id));
    } catch (err) {
      console.error(err);
      alert("Failed to delete meal");
    }
  };

  // --- Handlers: Exercises ---
  const handleWorkoutSelect = (e) => setSelectedWorkoutId(e.target.value);
  const handleDurationChange = (e) => setWorkoutDuration(e.target.value);

  const handleAddExercise = async () => {
    if (!selectedWorkoutId || !workoutDuration) return;
    setExerciseLoading(true);

    const workout = PREDEFINED_WORKOUTS.find(w => w.id === selectedWorkoutId);
    if (!workout) {
      setExerciseLoading(false);
      return;
    }

    const durationInt = parseInt(workoutDuration);
    if (isNaN(durationInt) || durationInt <= 0) {
      alert("Please enter a valid duration.");
      setExerciseLoading(false);
      return;
    }

    const caloriesBurned = durationInt * workout.caloriesPerMinute;

    try {
      const workoutData = {
        name: workout.name,
        duration: durationInt,
        calories_burned: caloriesBurned
      };
      
      const newWorkout = await logWorkout(workoutData);
      
      const normalizedWorkout = {
        ...newWorkout,
        caloriesBurned: newWorkout.calories_burned || newWorkout.caloriesBurned
      };

      setDailyExercises([...dailyExercises, normalizedWorkout]);
      setSelectedWorkoutId('');
      setWorkoutDuration('');
    } catch (err) {
      console.error(err);
      alert("Failed to add workout.");
    } finally {
      setExerciseLoading(false);
    }
  };

  const handleDeleteWorkout = async (id) => {
    try {
      await deleteWorkout(id);
      setDailyExercises(dailyExercises.filter(ex => ex.id !== id));
    } catch (err) {
      console.error(err);
      alert("Failed to delete workout");
    }
  };

  // --- Calculations ---
  const totalCalories = dailyMeals.reduce((acc, curr) => acc + (parseInt(curr.calories) || 0), 0);
  const totalBurned = dailyExercises.reduce((acc, curr) => {
    const burned = curr.calories_burned || curr.caloriesBurned || 0;
    return acc + burned;
  }, 0);

  // --- Styles ---
  const pageStyle = {
    minHeight: '100vh',
    background: theme.bg,
    color: theme.text,
    transition: 'background 0.3s, color 0.3s',
    padding: '20px',
    fontFamily: 'Arial, sans-serif'
  };

  const sectionStyle = {
    background: theme.cardBg,
    padding: '25px',
    borderRadius: '16px',
    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.05), 0 4px 6px -2px rgba(0, 0, 0, 0.025)',
    border: `1px solid ${theme.cardBorder}`,
    transition: 'background 0.3s, border 0.3s'
  };

  const inputStyle = {
    width: '100%',
    padding: '10px',
    borderRadius: '8px',
    border: `1px solid ${theme.cardBorder}`,
    boxSizing: 'border-box',
    fontSize: '15px',
    background: theme.inputBg,
    color: theme.inputText
  };

  const buttonStyle = {
    width: '100%',
    padding: '12px',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontWeight: 'bold',
    fontSize: '15px',
    transition: 'opacity 0.2s'
  };

  return (
    <div style={pageStyle}>
      <div style={{ maxWidth: "1000px", margin: "0 auto" }}>
        
        {/* Header & Toggle */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
          <h1 style={{ margin: 0 }}>Daily Dashboard</h1>
          <div style={{ display: 'flex', gap: '10px' }}>
            <button 
                onClick={toggleTheme}
                style={{
                background: 'transparent',
                border: `2px solid ${theme.accentBlue}`,
                color: theme.text,
                padding: '8px 16px',
                borderRadius: '20px',
                cursor: 'pointer',
                fontWeight: 'bold'
                }}
            >
                {isDarkMode ? '☀️ Light' : '🌙 Dark'}
            </button>
          </div>
        </div>

        {/* Summary Banner */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px', marginBottom: '40px', justifyContent: 'center' }}>
          <StatCard title="Calories Gained" value={totalCalories} color="#27ae60" theme={theme} />
          <StatCard title="Calories Burned" value={totalBurned} color="#e74c3c" theme={theme} />
          <StatCard title="Net Calories" value={totalCalories - totalBurned} color="#3498db" theme={theme} />
        </div>

        {/* --- WATER TRACKER SECTION --- */}
        <div style={{ ...sectionStyle, marginBottom: '30px', textAlign: 'center' }}>
          <h2 style={{ color: theme.accentBlue, marginTop: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
            🫗 Hydration Tracker
          </h2>
          <p style={{ color: theme.subText, marginBottom: '20px' }}>
            Daily Goal: <strong>{waterGoal}ml</strong> (based on {userWeight}kg body weight × 35ml)
          </p>
            
          {/* Progress Bar Container */}
          <div style={{ 
            height: '30px', 
            background: theme.itemBg, 
            borderRadius: '15px', 
            border: `1px solid ${theme.itemBorder}`,
            overflow: 'hidden', 
            maxWidth: '600px', 
            margin: '0 auto 20px auto',
            position: 'relative'
          }}>
            {/* Fill */}
            <div style={{
              width: `${waterPercentage}%`,
              height: '100%',
              background: `linear-gradient(90deg, #3498db 0%, #5dade2 100%)`, 
              transition: 'width 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              color: 'white',
              fontSize: '13px',
              fontWeight: 'bold',
              textShadow: '0 1px 2px rgba(0,0,0,0.2)'
            }}>
              {Math.round(waterPercentage)}%
            </div>
          </div>

          <div style={{ fontSize: '24px', fontWeight: '800', marginBottom: '20px', color: theme.text }}>
            {waterIntake} <span style={{fontSize: '16px', color: theme.subText, fontWeight: 'normal'}}>/ {waterGoal} ml</span>
          </div>

          <div style={{ display: 'flex', gap: '15px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <button 
              onClick={() => handleAddWater(250)} 
              style={{...buttonStyle, width: 'auto', background: theme.accentBlue, padding: '10px 20px'}}
            >
              + 250ml
            </button>
            <button 
              onClick={() => handleAddWater(500)} 
              style={{...buttonStyle, width: 'auto', background: theme.accentBlue, padding: '10px 20px'}}
            >
              + 500ml
            </button>
            <button 
              onClick={handleResetWater} 
              style={{
                ...buttonStyle, 
                width: 'auto', 
                background: 'transparent', 
                color: theme.subText, 
                border: `1px solid ${theme.cardBorder}`,
                padding: '10px 20px'
              }}
            >
              Reset
            </button>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '30px' }}>
          
          {/* LEFT COLUMN: NUTRITION */}
          <div style={sectionStyle}>
            <h2 style={{ borderBottom: `2px solid ${theme.accentBlue}`, paddingBottom: '10px', color: theme.accentBlue, marginTop: 0 }}>🥑 Add Meal</h2>
            
            <div style={{ padding: '20px', borderRadius: '10px', border: `1px dashed ${theme.accentBlue}`, marginBottom: '20px' }}>
              <div style={{ marginBottom: '10px' }}>
                <label style={{ display: 'block', marginBottom: '5px', color: theme.subText, fontSize: '14px' }}>Select Meal</label>
                <select 
                  value={selectedMealId} 
                  onChange={handleMealSelect}
                  style={{ ...inputStyle, cursor: 'pointer' }}
                >
                  <option value="" disabled>-- Choose Meal --</option>
                  {PREDEFINED_MEALS.map(meal => (
                    <option key={meal.id} value={meal.id}>
                      {meal.name} (~{meal.caloriesPerGram} cal/g)
                    </option>
                  ))}
                </select>
              </div>

              <div style={{ marginBottom: '10px' }}>
                <label style={{ display: 'block', marginBottom: '5px', color: theme.subText, fontSize: '14px' }}>Weight (grams)</label>
                <input 
                  type="number" 
                  placeholder="e.g. 150" 
                  value={mealWeight} 
                  onChange={handleWeightChange} 
                  style={inputStyle}
                  min="1"
                />
              </div>

              <button 
                onClick={handleAddMeal} 
                disabled={mealLoading || !selectedMealId || !mealWeight}
                style={{ ...buttonStyle, backgroundColor: theme.accentBlue, opacity: (mealLoading || !selectedMealId || !mealWeight) ? 0.6 : 1 }}
              >
                {mealLoading ? "Adding..." : "Add Meal"}
              </button>
            </div>

            <h3>Today's Meals</h3>
            {dailyMeals.length === 0 ? <p style={{ color: theme.subText, fontStyle: 'italic' }}>No meals added yet.</p> : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {dailyMeals.map((meal) => (
                  <MealCard 
                    key={meal.id} 
                    data={meal} 
                    theme={theme} 
                    onDelete={() => handleDeleteMeal(meal.id)}
                  />
                ))}
              </div>
            )}
          </div>

          {/* RIGHT COLUMN: EXERCISE */}
          <div style={sectionStyle}>
            <h2 style={{ borderBottom: `2px solid ${theme.accentRed}`, paddingBottom: '10px', color: theme.accentRed, marginTop: 0 }}>🏃‍♂️ Add Workout</h2>
            
            <div style={{ padding: '20px', borderRadius: '10px', border: `1px dashed ${theme.accentRed}`, marginBottom: '20px' }}>
              <div style={{ marginBottom: '10px' }}>
                <label style={{ display: 'block', marginBottom: '5px', color: theme.subText, fontSize: '14px' }}>Select Workout</label>
                <select 
                  value={selectedWorkoutId} 
                  onChange={handleWorkoutSelect}
                  style={{ ...inputStyle, cursor: 'pointer' }}
                >
                  <option value="" disabled>-- Choose Workout --</option>
                  {PREDEFINED_WORKOUTS.map(w => (
                    <option key={w.id} value={w.id}>
                      {w.name} (~{w.caloriesPerMinute} cal/min)
                    </option>
                  ))}
                </select>
              </div>
              
              <div style={{ marginBottom: '10px' }}>
                <label style={{ display: 'block', marginBottom: '5px', color: theme.subText, fontSize: '14px' }}>Duration (mins)</label>
                <input 
                  type="number" 
                  placeholder="e.g. 30"
                  value={workoutDuration}
                  onChange={handleDurationChange}
                  style={inputStyle}
                  min="1"
                />
              </div>

              <button 
                onClick={handleAddExercise} 
                disabled={exerciseLoading || !selectedWorkoutId || !workoutDuration}
                style={{ ...buttonStyle, backgroundColor: theme.accentRed, opacity: (exerciseLoading || !selectedWorkoutId || !workoutDuration) ? 0.6 : 1 }}
              >
                {exerciseLoading ? "Adding..." : "Add Workout"}
              </button>
            </div>

            <h3>Today's Workouts</h3>
            {dailyExercises.length === 0 ? <p style={{ color: theme.subText, fontStyle: 'italic' }}>No exercises added yet.</p> : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {dailyExercises.map((ex) => (
                  <WorkoutCard 
                    key={ex.id}
                    data={ex} 
                    theme={theme}
                    onDelete={() => handleDeleteWorkout(ex.id)}
                  />
                ))}
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
};

export default Dashboard;