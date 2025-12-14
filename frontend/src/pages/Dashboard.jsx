import React, { useState } from 'react';

// Imports from the new modular structure
import { PREDEFINED_MEALS, PREDEFINED_WORKOUTS } from '../data/constants';
import { THEMES } from '../theme/theme';
import { mockLogWorkout,mockLogMeal } from '../services/api';
import MealCard from '../components/MealCard';
import WorkoutCard from '../components/WorkoutCard';
import StatCard from '../components/StatCard';

const Dashboard = () => {
  // Theme State
  const [isDarkMode, setIsDarkMode] = useState(false);
  const theme = isDarkMode ? THEMES.dark : THEMES.light;
  const toggleTheme = () => setIsDarkMode(!isDarkMode);

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

  // --- Handlers: Meals ---
  const handleMealSelect = (e) => setSelectedMealId(e.target.value);
  const handleWeightChange = (e) => setMealWeight(e.target.value);

const handleAddMeal = async () => {
    // 1. Validation
    if (!selectedMealId || !mealWeight) return;

    setMealLoading(true);

    // 2. Find Meal
    const meal = PREDEFINED_MEALS.find(m => m.id === selectedMealId);
    if (!meal) {
      setMealLoading(false);
      return;
    }
    
    // 3. Validate Input
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
        const savedMeal = await mockLogMeal(mealData);
        setDailyMeals([...dailyMeals, savedMeal]);
        
        // Reset
        setSelectedMealId('');
        setMealWeight('');
    } catch (err) {
        alert("Failed to add meal");
    } finally {
        setMealLoading(false);
    }
  };

  const handleDeleteMeal = (id) => {
    setDailyMeals(dailyMeals.filter(meal => meal.id !== id));
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
        caloriesBurned: caloriesBurned
      };
      const newWorkout = await mockLogWorkout(workoutData);
      setDailyExercises([...dailyExercises, newWorkout]);
      setSelectedWorkoutId('');
      setWorkoutDuration('');
    } catch (err) {
      alert("Failed to add workout.");
    } finally {
      setExerciseLoading(false);
    }
  };

  const handleDeleteWorkout = (id) => {
    setDailyExercises(dailyExercises.filter(ex => ex.id !== id));
  };

  // --- Calculations ---
  const totalCalories = dailyMeals.reduce((acc, curr) => acc + (parseInt(curr.calories) || 0), 0);
  const totalBurned = dailyExercises.reduce((acc, curr) => acc + (curr.caloriesBurned || 0), 0);

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
            {isDarkMode ? '☀️ Light Mode' : '🌙 Dark Mode'}
          </button>
        </div>

        {/* Summary Banner */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px', marginBottom: '40px', justifyContent: 'center' }}>
          <StatCard title="Calories In" value={totalCalories} color="#27ae60" theme={theme} />
          <StatCard title="Calories Burned" value={totalBurned} color="#e74c3c" theme={theme} />
          <StatCard title="Net Calories" value={totalCalories - totalBurned} color="#3498db" theme={theme} />
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
}
export default Dashboard;