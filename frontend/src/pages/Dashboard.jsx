import React, { useState } from 'react';

// constants

const PREDEFINED_MEALS = [
  { id: 'm1', name: 'Oatmeal with Berries', calories: 350, protein: '12g' },
  { id: 'm2', name: 'Greek Yogurt Parfait', calories: 250, protein: '15g' },
  { id: 'm3', name: 'Avocado Toast', calories: 320, protein: '8g' },
  { id: 'm4', name: 'Scrambled Eggs (3) & Toast', calories: 400, protein: '20g' },
  { id: 'm5', name: 'Grilled Chicken Salad', calories: 450, protein: '40g' },
  { id: 'm6', name: 'Tuna Sandwich', calories: 380, protein: '30g' },
  { id: 'm7', name: 'Turkey Wrap', calories: 350, protein: '25g' },
  { id: 'm8', name: 'Lentil Soup', calories: 280, protein: '18g' },
  { id: 'm9', name: 'Quinoa Bowl', calories: 420, protein: '14g' },
  { id: 'm10', name: 'Salmon & Asparagus', calories: 550, protein: '45g' },
  { id: 'm11', name: 'Steak & Sweet Potato', calories: 700, protein: '50g' },
  { id: 'm12', name: 'Pasta Primavera', calories: 600, protein: '12g' },
  { id: 'm13', name: 'Chicken Stir-Fry', calories: 500, protein: '35g' },
  { id: 'm14', name: 'Vegetable Curry', calories: 450, protein: '10g' },
  { id: 'm15', name: 'Beef Burger (No Bun)', calories: 480, protein: '30g' },
  { id: 'm16', name: 'Whey Protein Shake', calories: 180, protein: '25g' },
  { id: 'm17', name: 'Apple & Peanut Butter', calories: 200, protein: '4g' },
  { id: 'm18', name: 'Mixed Nuts (Handful)', calories: 170, protein: '6g' },
  { id: 'm19', name: 'Banana', calories: 105, protein: '1g' },
  { id: 'm20', name: 'Hummus & Carrots', calories: 150, protein: '5g' },
];

const PREDEFINED_WORKOUTS = [
  { id: 'w1', name: 'Running (Fast)', caloriesPerMinute: 13 },
  { id: 'w2', name: 'Cycling', caloriesPerMinute: 8 },
  { id: 'w3', name: 'Swimming', caloriesPerMinute: 10 },
  { id: 'w4', name: 'Jump Rope', caloriesPerMinute: 15 },
  { id: 'w5', name: 'Yoga', caloriesPerMinute: 3 },
  { id: 'w6', name: 'Pilates', caloriesPerMinute: 4 },
  { id: 'w7', name: 'HIIT Circuit', caloriesPerMinute: 12 },
  { id: 'w8', name: 'Weightlifting', caloriesPerMinute: 5 },
  { id: 'w9', name: 'Walking (Brisk)', caloriesPerMinute: 4 },
  { id: 'w10', name: 'Rowing Machine', caloriesPerMinute: 9 },
  { id: 'w11', name: 'Elliptical', caloriesPerMinute: 7 },
  { id: 'w12', name: 'Boxing', caloriesPerMinute: 11 },
  { id: 'w13', name: 'Zumba / Dancing', caloriesPerMinute: 7 },
  { id: 'w14', name: 'Hiking', caloriesPerMinute: 6 },
  { id: 'w15', name: 'Basketball', caloriesPerMinute: 10 },
];

// theme definitions
const THEMES = {
  light: {
    bg: '#f4f6f8',
    text: '#2c3e50',
    cardBg: '#ffffff',
    cardBorder: '#e0e0e0',
    subText: '#666',
    inputBg: '#ffffff',
    inputText: '#333',
    itemBg: '#f8f9fa',
    itemBorder: '#e9ecef',
    mealBg: '#e8f6f3',
    mealBorder: '#27ae60',
    accentBlue: '#3498db',
    accentRed: '#e74c3c'
  },
  dark: {
    bg: '#121212',
    text: '#e0e0e0',
    cardBg: '#1e1e1e',
    cardBorder: '#333',
    subText: '#a0a0a0',
    inputBg: '#2d2d2d',
    inputText: '#fff',
    itemBg: '#2d2d2d',
    itemBorder: '#404040',
    mealBg: '#1e3a2f',
    mealBorder: '#2ecc71',
    accentBlue: '#5dade2',
    accentRed: '#ec7063'
  }
};

// internal mock services

const mockLogWorkout = async (workoutData) => {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve({
                id: Date.now(),
                ...workoutData
            });
        }, 800);
    });
};

// sub-Components (updated with theme props)

const MealCard = ({ data, theme, onDelete }) => {
  if (!data) return null;
  return (
    <div style={{ 
      marginTop: "10px", 
      padding: "15px", 
      background: theme.mealBg, 
      borderRadius: "10px", 
      borderLeft: `5px solid ${theme.mealBorder}`,
      boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
      color: theme.text,
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center'
    }}>
      <div style={{ display: 'grid', gap: '4px', fontSize: '15px', flex: 1 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'bold' }}>
          <span>{data.name}</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', color: theme.subText }}>
          <span>🔥 {data.calories} kcal</span>
          <span style={{ color: theme.mealBorder }}>💪 {data.protein}</span>
        </div>
      </div>
      <button 
        onClick={onDelete}
        style={{
            background: 'none',
            border: 'none',
            fontSize: '18px',
            cursor: 'pointer',
            marginLeft: '15px',
            opacity: 0.6,
            transition: 'opacity 0.2s',
            padding: '5px'
        }}
        title="Delete Meal"
        onMouseOver={(e) => e.target.style.opacity = 1}
        onMouseOut={(e) => e.target.style.opacity = 0.6}
      >
        🗑️
      </button>
    </div>
  );
};

const StatCard = ({ title, value, color, theme }) => (
  <div style={{ 
    background: theme.cardBg, 
    padding: '15px 25px', 
    borderRadius: '12px', 
    boxShadow: '0 4px 6px rgba(0,0,0,0.05)', 
    textAlign: 'center', 
    minWidth: '140px', 
    border: `1px solid ${theme.cardBorder}` 
  }}>
    <h3 style={{ margin: '0 0 5px 0', color: theme.subText, fontSize: '13px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{title}</h3>
    <div style={{ fontSize: '28px', fontWeight: '800', color: color }}>{value}</div>
  </div>
);

// main dashboard component

const Dashboard = () => {
  // theme state
  const [isDarkMode, setIsDarkMode] = useState(false);
  const theme = isDarkMode ? THEMES.dark : THEMES.light;

  const toggleTheme = () => setIsDarkMode(!isDarkMode);

  // state for meals 
  const [selectedMealId, setSelectedMealId] = useState('');
  const [dailyMeals, setDailyMeals] = useState([]);

  // state for exercises
  const [selectedWorkoutId, setSelectedWorkoutId] = useState('');
  const [workoutDuration, setWorkoutDuration] = useState('');
  const [dailyExercises, setDailyExercises] = useState([]);
  const [exerciseLoading, setExerciseLoading] = useState(false);

  // handlers for meals
  const handleMealSelect = (e) => setSelectedMealId(e.target.value);

  const handleAddMeal = () => {
    if (!selectedMealId) return;
    
    const mealToAdd = PREDEFINED_MEALS.find(m => m.id === selectedMealId);
    if (mealToAdd) {
      setDailyMeals([...dailyMeals, { ...mealToAdd, id: Date.now() }]);
      setSelectedMealId('');
    }
  };

  const handleDeleteMeal = (id) => {
    setDailyMeals(dailyMeals.filter(meal => meal.id !== id));
  };

  // handlers for exercises 
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
      alert("Failed to log workout.");
    } finally {
      setExerciseLoading(false);
    }
  };

  const handleDeleteWorkout = (id) => {
    setDailyExercises(dailyExercises.filter(ex => ex.id !== id));
  };

  // totals calculation 
  const totalCalories = dailyMeals.reduce((acc, curr) => acc + (parseInt(curr.calories) || 0), 0);
  const totalBurned = dailyExercises.reduce((acc, curr) => acc + (curr.caloriesBurned || 0), 0);

  // dynamic Styles
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

  const itemCardStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '12px',
    background: theme.itemBg,
    borderRadius: '8px',
    border: `1px solid ${theme.itemBorder}`,
    fontSize: '15px',
    color: theme.text
  };

  const deleteBtnStyle = {
    background: 'none',
    border: 'none',
    fontSize: '18px',
    cursor: 'pointer',
    opacity: 0.6,
    padding: '5px'
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
              <p style={{ margin: '0 0 10px 0', color: theme.subText }}>Select a meal from the list:</p>
              
              <select 
                value={selectedMealId} 
                onChange={handleMealSelect}
                style={{ ...inputStyle, cursor: 'pointer', marginBottom: '10px' }}
              >
                <option value="" disabled>-- Choose a Meal --</option>
                {PREDEFINED_MEALS.map(meal => (
                  <option key={meal.id} value={meal.id}>
                    {meal.name} ({meal.calories} kcal)
                  </option>
                ))}
              </select>

              <button 
                onClick={handleAddMeal} 
                disabled={!selectedMealId}
                style={{ ...buttonStyle, backgroundColor: theme.accentBlue, opacity: !selectedMealId ? 0.6 : 1 }}
              >
                Add Meal
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
            <h2 style={{ borderBottom: `2px solid ${theme.accentRed}`, paddingBottom: '10px', color: theme.accentRed, marginTop: 0 }}>🏃‍♂️ Add Exercise</h2>
            
            <div style={{ padding: '20px', borderRadius: '10px', border: `1px dashed ${theme.accentRed}`, marginBottom: '20px' }}>
              <div style={{ marginBottom: '10px' }}>
                <label style={{ display: 'block', marginBottom: '5px', color: theme.subText, fontSize: '14px' }}>Activity Type</label>
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
                {exerciseLoading ? "Adding..." : "Log Workout"}
              </button>
            </div>

            <h3>Today's Activity</h3>
            {dailyExercises.length === 0 ? <p style={{ color: theme.subText, fontStyle: 'italic' }}>No exercises logged yet.</p> : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {dailyExercises.map((ex) => (
                  <div key={ex.id} style={itemCardStyle}>
                    <div>
                        <strong>{ex.name}</strong> ({ex.duration} min)
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <span style={{ color: theme.accentRed, fontWeight: 'bold' }}>-{ex.caloriesBurned} kcal</span>
                        <button 
                            onClick={() => handleDeleteWorkout(ex.id)} 
                            style={deleteBtnStyle}
                            title="Delete Workout"
                            onMouseOver={(e) => e.target.style.opacity = 1}
                            onMouseOut={(e) => e.target.style.opacity = 0.6}
                        >
                            🗑️
                        </button>
                    </div>
                  </div>
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