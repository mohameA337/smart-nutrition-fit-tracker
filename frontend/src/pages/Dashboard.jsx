import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { PREDEFINED_MEALS, PREDEFINED_WORKOUTS } from '../data/constants';
import { THEMES } from '../theme/theme';
import { logWorkout, logMeal, getMeals, getWorkouts, deleteMeal, deleteWorkout, getUserProfile } from '../services/api';
import MealCard from '../components/MealCard';
import WorkoutCard from '../components/WorkoutCard';
import { calculateDailyCalories } from '../data/Nutrition Calc'; 
import CircularProgress from '../components/CircularProgress';

const Dashboard = () => {
  const navigate = useNavigate();
  
  // Theme State
  const [isDarkMode, setIsDarkMode] = useState(true);
  const theme = isDarkMode ? THEMES.dark : THEMES.light;
  const toggleTheme = () => setIsDarkMode(!isDarkMode);

  //  Water Tracker State 
  const [waterIntake, setWaterIntake] = useState(0);
  
  // User Profile State (This was missing in your code)
  const [userProfile, setUserProfile] = useState({
    weight: 0,
    height: 0,
    age: 0,
    gender: 'Male',
    activityRate: 'Moderate',
    weeklyGoal: 'maintain'
  });

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate('/login');
  };

  // Fetch fresh user data on mount
  useEffect(() => {
    const fetchUserData = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate('/login');
        return;
      }

      try {
        const profile = await getUserProfile();
        const savedGoal = localStorage.getItem('userWeeklyGoal') || 'maintain';
        
        if (profile) {
          // Update state with fetched data
          setUserProfile({
            weight: parseFloat(profile.weight) || 0,
            height: parseFloat(profile.height) || 0,
            age: parseFloat(profile.age) || 0,
            gender: profile.gender || 'Male', 
            activityRate: profile.activity_rate || 'Moderate',
            weeklyGoal: savedGoal
          });
          const existing = JSON.parse(localStorage.getItem("user") || '{}');
          localStorage.setItem("user", JSON.stringify({ ...existing, ...profile }));
        }
      } catch (err) {
        if (err.response && err.response.status === 401) {
          handleLogout();
        }
      }
    };
    fetchUserData();
  }, [navigate]);

  // Pass 'userProfile' (the data)
  const dailyCalorieGoal = calculateDailyCalories(userProfile,userProfile.weeklyGoal);

  // Calculate Water Goal: 35ml per kg (using profile weight)
  const waterGoal = Math.round((userProfile.weight || 0) * 35); 

  const handleAddWater = (amount) => {
    setWaterIntake(prev => {
      const newValue = prev + amount;
      return newValue > 5000 ? 5000 : newValue;
    });
  };

  const handleResetWater = () => setWaterIntake(0);

  // Meals & Exercises State
  const [selectedMealId, setSelectedMealId] = useState('');
  const [mealWeight, setMealWeight] = useState('');
  const [dailyMeals, setDailyMeals] = useState([]);
  const [mealLoading, setMealLoading] = useState(false);

  const [selectedWorkoutId, setSelectedWorkoutId] = useState('');
  const [workoutDuration, setWorkoutDuration] = useState('');
  const [dailyExercises, setDailyExercises] = useState([]);
  const [exerciseLoading, setExerciseLoading] = useState(false);

  // Data Fetching (Logs)
  useEffect(() => {
    const fetchData = async () => {
      try {
        const meals = await getMeals();
        setDailyMeals(meals);
        const workouts = await getWorkouts();
        setDailyExercises(workouts);
      } catch (error) {
        if (error.response && error.response.status === 401) {
          handleLogout();
        }
      }
    };
    fetchData();
  }, [navigate]);

  // Handlers
  const handleMealSelect = (e) => setSelectedMealId(e.target.value);
  const handleWeightChange = (e) => setMealWeight(e.target.value);

  const handleAddMeal = async () => {
    if (!selectedMealId || !mealWeight) return;
    
    // Exception Handling: Validation for weight
    const weightInt = parseInt(mealWeight);
    if (isNaN(weightInt) || weightInt <= 0) {
      alert("Please enter a valid weight greater than 0g.");
      return; 
    }

    setMealLoading(true);
    const meal = PREDEFINED_MEALS.find(m => m.id === selectedMealId);
    if (!meal) { setMealLoading(false); return; }
    
    const totalCalories = Math.round(weightInt * meal.caloriesPerGram);
    const mealData = { name: meal.name, weight: weightInt, calories: totalCalories };
    
    try {
      const savedMeal = await logMeal(mealData);
      setDailyMeals([...dailyMeals, savedMeal]);
      setSelectedMealId('');
      setMealWeight('');
    } catch (err) { alert("Failed to add meal"); } finally { setMealLoading(false); }
  };

  const handleDeleteMeal = async (id) => {
    try { await deleteMeal(id); setDailyMeals(dailyMeals.filter(meal => meal.id !== id)); } 
    catch (err) { alert("Failed to delete meal"); }
  };

  const handleWorkoutSelect = (e) => setSelectedWorkoutId(e.target.value);
  const handleDurationChange = (e) => setWorkoutDuration(e.target.value);

  const handleAddExercise = async () => {
    if (!selectedWorkoutId || !workoutDuration) return;

    // Exception Handling: Validation for duration
    const durationInt = parseInt(workoutDuration);
    if (isNaN(durationInt) || durationInt <= 0) {
      alert("Please enter a valid duration greater than 0 minutes.");
      return; 
    }

    setExerciseLoading(true);
    const workout = PREDEFINED_WORKOUTS.find(w => w.id === selectedWorkoutId);
    if (!workout) { setExerciseLoading(false); return; }

    const caloriesBurned = durationInt * workout.caloriesPerMinute;
    const workoutData = { name: workout.name, duration: durationInt, calories_burned: caloriesBurned };
    
    try {
      const newWorkout = await logWorkout(workoutData);
      const normalizedWorkout = { ...newWorkout, caloriesBurned: newWorkout.calories_burned || newWorkout.caloriesBurned };
      setDailyExercises([...dailyExercises, normalizedWorkout]);
      setSelectedWorkoutId('');
      setWorkoutDuration('');
    } catch (err) { alert("Failed to add workout."); } finally { setExerciseLoading(false); }
  };

  const handleDeleteWorkout = async (id) => {
    try { await deleteWorkout(id); setDailyExercises(dailyExercises.filter(ex => ex.id !== id)); } 
    catch (err) { alert("Failed to delete workout"); }
  };

  // Calculations
  const totalCaloriesIn = dailyMeals.reduce((acc, curr) => acc + (parseInt(curr.calories) || 0), 0);
  const totalBurned = dailyExercises.reduce((acc, curr) => {
    return acc + (curr.calories_burned || curr.caloriesBurned || 0);
  }, 0);
  const netCalories = totalCaloriesIn - totalBurned;

  // Styles 
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
            <button onClick={toggleTheme} style={{ background: 'transparent', border: `2px solid ${theme.accentBlue}`, color: theme.text, padding: '8px 16px', borderRadius: '20px', cursor: 'pointer', fontWeight: 'bold' }}>
                {isDarkMode ? '☀️ Light' : '🌙 Dark'}
            </button>
          </div>
        </div>

        {/* --- NEW VISUAL DASHBOARD --- */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '30px', marginBottom: '40px' }}>
            
            {/* Calorie Tracker */}
            <div style={{ ...sectionStyle, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                <h2 style={{ margin: '0 0 20px 0', color: theme.text }}>Daily Calorie Goal</h2>
                
                <div style={{ display: 'flex', alignItems: 'center', gap: '30px', flexWrap: 'wrap', justifyContent: 'center' }}>
                    {/* Circular Bar */}
                    <CircularProgress 
                        value={netCalories} 
                        max={dailyCalorieGoal} 
                        color={netCalories > dailyCalorieGoal ? '#ebe414ff' : '#7f27aeff'}
                        trackColor={theme.itemBg}
                        label="Net Calories"
                        subLabel={`Goal: ${dailyCalorieGoal}`}
                        theme={theme}
                        size={180}
                    />

                    {/* Side Stats */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                        <div style={{ textAlign: 'left' }}>
                            <div style={{ fontSize: '14px', color: theme.subText }}>Calories In</div>
                            <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#27ae60' }}>
                                🍜 {totalCaloriesIn}
                            </div>
                        </div>
                        <div style={{ textAlign: 'left' }}>
                            <div style={{ fontSize: '14px', color: theme.subText }}>Calories Out</div>
                            <div style={{ fontSize: '20px', fontWeight: 'bold', color: theme.accentRed }}>
                                🔥 {totalBurned}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Hydration Tracker */}
            <div style={{ ...sectionStyle, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                <h2 style={{ margin: '0 0 20px 0', color: theme.text }}>Daily Hydration Goal</h2>
                
                <div style={{ display: 'flex', alignItems: 'center', gap: '30px', flexWrap: 'wrap', justifyContent: 'center' }}>
                    <CircularProgress 
                        value={waterIntake} 
                        max={waterGoal} 
                        color="#3493dbff"
                        trackColor={theme.itemBg}
                        label="Water Intake"
                        subLabel={`Goal: ${waterGoal}ml`}
                        theme={theme}
                        size={180}
                    />

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                        <button onClick={() => handleAddWater(250)} style={{...buttonStyle, background: theme.accentBlue, padding: '8px 15px', width: 'auto'}}>+ 250ml💧</button>
                        <button onClick={() => handleAddWater(500)} style={{...buttonStyle, background: theme.accentBlue, padding: '8px 15px', width: 'auto'}}>+ 500ml💧</button>
                        <button onClick={handleResetWater} style={{...buttonStyle, background: 'transparent', color: theme.subText, border: `1px solid ${theme.cardBorder}`, padding: '8px 15px', width: 'auto'}}>Reset</button>
                    </div>
                </div>
            </div>

        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '30px' }}>
          
          {/* Meals */}
          <div style={sectionStyle}>
            <h2 style={{ borderBottom: `3px solid`, paddingBottom: '10px', color: 'rgba(17, 238, 116, 1)', marginTop: 0 }}>🍕 Add Meal</h2>
            
            <div style={{ padding: '20px', borderRadius: '10px', border: `3px solid`, color: 'rgba(17, 238, 116, 1)', marginBottom: '20px' }}>
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
                style={{ ...buttonStyle, backgroundColor: 'rgba(17, 238, 116, 1)', opacity: (mealLoading || !selectedMealId || !mealWeight) ? 0.6 : 1 }}
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

          {/* Workouts */}
          <div style={sectionStyle}>
            <h2 style={{ borderBottom: `3px solid ${theme.accentRed}`, paddingBottom: '10px', color: theme.accentRed, marginTop: 0 }}>🏃‍♂️ Add Workout</h2>
            
            <div style={{ padding: '20px', borderRadius: '10px', border: `3px solid ${theme.accentRed}`, marginBottom: '20px' }}>
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