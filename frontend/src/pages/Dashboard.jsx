import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { PREDEFINED_MEALS, PREDEFINED_WORKOUTS } from '../data/constants';
import { THEMES } from '../theme/theme';
import { logWorkout, logMeal, getMeals, getWorkouts, deleteMeal, deleteWorkout, getUserProfile, getWaterIntake, logWater, resetWaterIntake, logWeight, getWeightHistory, sendChatMessage } from '../services/api';
import MealCard from '../components/MealCard';
import WorkoutCard from '../components/WorkoutCard';
import { calculateDailyCalories } from '../data/Nutrition Calc';
import CircularProgress from '../components/CircularProgress';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer } from 'recharts';

const Dashboard = () => {
  const navigate = useNavigate();

  // Theme State
  const [isDarkMode, setIsDarkMode] = useState(true);
  const theme = isDarkMode ? THEMES.dark : THEMES.light;
  const toggleTheme = () => setIsDarkMode(!isDarkMode);

  //  Water Tracker State 
  const [waterIntake, setWaterIntake] = useState(0);

  // Fetch Water Intake
  useEffect(() => {
    const fetchWater = async () => {
      try {
        const data = await getWaterIntake();
        setWaterIntake(data.total_amount);
      } catch (error) {
        console.error("Failed to fetch water", error);
      }
    };
    fetchWater();
  }, []);

  // User Profile State
  const [userProfile, setUserProfile] = useState({
    weight: 0,
    height: 0,
    age: 0,
    gender: 'Male',
    activityRate: 'Moderate',
    weeklyGoal: 'maintain',
    daily_calorie_goal: 2000,
    protein_goal: 150,
    carbs_goal: 200,
    fats_goal: 70,
    bmi: 0
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
            name: profile.full_name,
            weight: parseFloat(profile.weight) || 0,
            height: parseFloat(profile.height) || 0,
            age: parseFloat(profile.age) || 0,
            gender: profile.gender || 'Male',
            activityRate: profile.activity_rate || 'Moderate',
            weeklyGoal: savedGoal,
            daily_calorie_goal: profile.daily_calorie_goal,
            protein_goal: profile.protein_goal,
            carbs_goal: profile.carbs_goal,
            fats_goal: profile.fats_goal,
            bmi: profile.bmi
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

  // Analytics State
  const [weightHistory, setWeightHistory] = useState([]);
  const [currentWeight, setCurrentWeight] = useState('');

  useEffect(() => {
    const fetchWeight = async () => {
      try {
        const history = await getWeightHistory();
        const formatted = history.map(h => ({
          date: new Date(h.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }),
          weight: h.weight
        }));
        setWeightHistory(formatted);
      } catch (e) { console.error("Weight history failed", e); }
    };
    fetchWeight();
  }, []);

  const handleLogWeight = async () => {
    if (!currentWeight) return;
    try {
      await logWeight(parseFloat(currentWeight));
      const today = new Date().toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
      setWeightHistory(prev => {
        const exists = prev.find(h => h.date === today);
        if (exists) {
          return prev.map(h => h.date === today ? { ...h, weight: parseFloat(currentWeight) } : h);
        }
        return [...prev, { date: today, weight: parseFloat(currentWeight) }];
      });
      setUserProfile(prev => ({ ...prev, weight: parseFloat(currentWeight) }));
      setCurrentWeight('');
      alert("Weight logged & Goals Recalculated!");
    } catch (e) { alert("Failed to log weight"); }
  };

  // Smart Goals
  const dailyCalorieGoal = userProfile.daily_calorie_goal || 2000;


  // Calculate Water Goal
  const waterGoal = Math.round((userProfile.weight || 0) * 35);

  const handleAddWater = async (amount) => {
    try {
      await logWater(amount);
      setWaterIntake(prev => prev + amount);
    } catch (error) {
      console.error("Failed to log water");
    }
  };

  const handleResetWater = async () => {
    try {
      await resetWaterIntake();
      setWaterIntake(0);
    } catch (error) {
      console.error("Failed to reset water");
    }
  };

  // Meals & Exercises State
  const [selectedMealId, setSelectedMealId] = useState('');
  const [mealWeight, setMealWeight] = useState('');
  const [dailyMeals, setDailyMeals] = useState([]);
  const [mealLoading, setMealLoading] = useState(false);

  // Manual Meal State
  const [isManualMeal, setIsManualMeal] = useState(false);
  const [manualMealName, setManualMealName] = useState('');
  const [manualMealCals, setManualMealCals] = useState('');
  const [aiLoading, setAiLoading] = useState(false);

  const handleAskAI = async () => {
    if (!manualMealName) return alert("Enter a food name first!");
    setAiLoading(true);
    try {
      const query = `How many calories are in 100g of ${manualMealName}?`;
      const response = await sendChatMessage(query);

      const calMatch = response.match(/(\d+)\s*cal/i) || response.match(/\d+/);
      if (calMatch) setManualMealCals(calMatch[1] || calMatch[0]);

    } catch (e) { alert("AI request failed"); }
    finally { setAiLoading(false); }
  };

  const [selectedWorkoutId, setSelectedWorkoutId] = useState('');
  const [workoutDuration, setWorkoutDuration] = useState('');
  const [dailyExercises, setDailyExercises] = useState([]);
  const [exerciseLoading, setExerciseLoading] = useState(false);

  // Data Fetching
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
    setMealLoading(true);
    let mealData = null;

    if (isManualMeal) {
      if (!manualMealName || !manualMealCals || !mealWeight) {
        alert("Please fill all fields"); setMealLoading(false); return;
      }
      const weightFactor = parseInt(mealWeight) / 100;
      mealData = {
        name: manualMealName,
        weight: parseInt(mealWeight),
        calories: Math.round(parseInt(manualMealCals) * weightFactor)
      };
    } else {
      if (!selectedMealId || !mealWeight) { setMealLoading(false); return; }
      const meal = PREDEFINED_MEALS.find(m => m.id === selectedMealId);
      if (!meal) { setMealLoading(false); return; }

      const weightInt = parseInt(mealWeight);
      mealData = {
        name: meal.name,
        weight: weightInt,
        calories: Math.round(weightInt * meal.caloriesPerGram)
      };
    }

    try {
      const savedMeal = await logMeal(mealData);
      setDailyMeals([...dailyMeals, savedMeal]);
      if (isManualMeal) {
        setManualMealName(''); setManualMealCals(''); setMealWeight('');
      } else {
        setSelectedMealId(''); setMealWeight('');
      }
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
      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>

        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
          <div>
            <h1 style={{ margin: 0, fontSize: '28px' }}>Daily Dashboard</h1>
            <p style={{ margin: '5px 0 0 0', color: theme.subText }}>Welcome back, {userProfile.name || 'User'}!</p>
          </div>
          <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
            <div style={{ display: 'flex', gap: '5px', alignItems: 'center' }}>
              <input
                type="number"
                placeholder="Log Weight (kg)"
                value={currentWeight}
                onChange={e => setCurrentWeight(e.target.value)}
                style={{ ...inputStyle, width: '120px', padding: '10px' }}
              />
              <button onClick={handleLogWeight} style={{ ...buttonStyle, width: 'auto', background: theme.accentBlue, padding: '10px 15px' }}>Log</button>
            </div>
            <button onClick={toggleTheme} style={{ background: 'transparent', border: `2px solid ${theme.accentBlue}`, color: theme.text, padding: '8px 16px', borderRadius: '20px', cursor: 'pointer', fontWeight: 'bold' }}>
              {isDarkMode ? '☀️' : '🌙'}
            </button>
          </div>
        </div>

        {/* --- SMART TARGETS --- */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px', marginBottom: '30px' }}>
          {/* Calories */}
          <div style={{ ...sectionStyle, padding: '20px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <h3 style={{ margin: '0 0 10px 0', color: theme.subText }}>Calories</h3>
            <CircularProgress
              value={netCalories}
              max={dailyCalorieGoal}
              color={netCalories > dailyCalorieGoal ? '#e74c3c' : '#f1c40f'}
              size={120}
              label="Net"
              subLabel={`Goal: ${dailyCalorieGoal}`}
              theme={theme}
            />
            <div style={{ marginTop: '10px', fontSize: '14px' }}>
              <span style={{ color: '#27ae60' }}>In: {totalCaloriesIn}</span> • <span style={{ color: '#e74c3c' }}>Out: {totalBurned}</span>
            </div>
          </div>



          {/* Hydration */}
          <div style={{ ...sectionStyle, padding: '20px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <h3 style={{ margin: '0 0 10px 0', color: theme.subText }}>Hydration</h3>
            <CircularProgress
              value={waterIntake}
              max={waterGoal}
              color="#3498db"
              size={120}
              label="Water"
              subLabel={`${waterIntake} / ${waterGoal}ml`}
              theme={theme}
            />
            <div style={{ display: 'flex', gap: '5px', marginTop: '15px' }}>
              <button onClick={() => handleAddWater(250)} style={{ ...buttonStyle, background: theme.accentBlue, padding: '5px 10px', fontSize: '12px', width: 'auto' }}>+250ml</button>
              <button onClick={() => handleAddWater(500)} style={{ ...buttonStyle, background: theme.accentBlue, padding: '5px 10px', fontSize: '12px', width: 'auto' }}>+500ml</button>
              <button onClick={handleResetWater} style={{ ...buttonStyle, background: 'transparent', border: `1px solid ${theme.subText}`, color: theme.subText, padding: '5px 10px', fontSize: '12px', width: 'auto' }}>Reset</button>
            </div>
          </div>

          {/* BMI/Stats */}
          <div style={{ ...sectionStyle, padding: '20px' }}>
            <h3 style={{ margin: '0 0 15px 0', color: theme.subText }}>Stats</h3>
            <div style={{ fontSize: '14px', marginBottom: '10px' }}>
              <p><strong>BMI:</strong> {userProfile.bmi ? userProfile.bmi.toFixed(1) : 'N/A'}</p>
              <p><strong>Weight:</strong> {userProfile.weight} kg</p>
              <p><strong>Goal:</strong> {userProfile.weeklyGoal.replace('_', ' ')}</p>
            </div>
          </div>
        </div>

        {/* --- ANALYTICS --- */}
        <div style={{ ...sectionStyle, marginBottom: '30px' }}>
          <h3 style={{ margin: '0 0 20px 0', color: theme.text }}>Weight Trend</h3>
          <div style={{ width: '100%', height: 300 }}>
            {weightHistory.length > 0 ? (
              <ResponsiveContainer>
                <LineChart data={weightHistory}>
                  <CartesianGrid strokeDasharray="3 3" stroke={theme.itemBorder} />
                  <XAxis dataKey="date" stroke={theme.subText} />
                  <YAxis stroke={theme.subText} domain={['dataMin - 1', 'dataMax + 1']} />
                  <RechartsTooltip contentStyle={{ background: theme.cardBg, borderColor: theme.cardBorder }} />
                  <Line type="monotone" dataKey="weight" stroke="#8884d8" strokeWidth={2} dot={{ r: 4 }} />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <p style={{ textAlign: 'center', color: theme.subText, paddingTop: '100px' }}>Log your weight to see history!</p>
            )}
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '30px' }}>

          {/* Meals */}
          <div style={sectionStyle}>
            <h2 style={{ borderBottom: `3px solid`, paddingBottom: '10px', color: 'rgba(17, 238, 116, 1)', marginTop: 0 }}>🍕 Add Meal</h2>

            {/* Toggle */}
            <div style={{ display: 'flex', gap: '10px', marginBottom: '15px' }}>
              <button onClick={() => setIsManualMeal(false)} style={{ ...buttonStyle, background: !isManualMeal ? 'rgba(17, 238, 116, 1)' : theme.itemBg, color: !isManualMeal ? 'white' : theme.text }}>Existing</button>
              <button onClick={() => setIsManualMeal(true)} style={{ ...buttonStyle, background: isManualMeal ? 'rgba(17, 238, 116, 1)' : theme.itemBg, color: isManualMeal ? 'white' : theme.text }}>Custom / AI</button>
            </div>

            <div style={{ padding: '20px', borderRadius: '10px', border: `3px solid`, color: 'rgba(17, 238, 116, 1)', marginBottom: '20px' }}>

              {!isManualMeal ? (
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
              ) : (
                <>
                  <div style={{ marginBottom: '10px' }}>
                    <label style={{ display: 'block', marginBottom: '5px', color: theme.subText, fontSize: '14px' }}>Meal Name</label>
                    <input
                      type="text"
                      placeholder="e.g. Chicken Salad"
                      value={manualMealName}
                      onChange={e => setManualMealName(e.target.value)}
                      style={inputStyle}
                    />
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '10px', marginBottom: '10px' }}>
                    <div>
                      <label style={{ display: 'block', marginBottom: '5px', color: theme.subText, fontSize: '12px' }}>Cals /100g</label>
                      <input type="number" value={manualMealCals} onChange={e => setManualMealCals(e.target.value)} style={inputStyle} />
                    </div>
                  </div>
                  <button onClick={handleAskAI} disabled={aiLoading} style={{ ...buttonStyle, background: '#9b59b6', fontSize: '12px', padding: '10px', marginBottom: '15px' }}>
                    {aiLoading ? 'Asking AI for Macros...' : '✨ Auto-Fill with AI'}
                  </button>
                </>
              )}

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
                disabled={mealLoading}
                style={{ ...buttonStyle, backgroundColor: 'rgba(17, 238, 116, 1)', opacity: mealLoading ? 0.6 : 1 }}
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