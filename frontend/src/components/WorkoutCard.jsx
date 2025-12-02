import React from 'react';

const WorkoutCard = ({ data, theme, onDelete }) => {
  if (!data) return null;

  return (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'space-between', 
      alignItems: 'center', 
      padding: '12px', 
      background: theme.workoutBg || theme.itemBg, // Fallback if specific bg not defined
      borderRadius: '8px', 
      borderLeft: `4px solid ${theme.workoutBorder || theme.accentRed}`,
      border: `1px solid ${theme.itemBorder}`,
      marginBottom: '10px', // Spacing between cards
      color: theme.text
    }}>
       <div>
          <strong>{data.name}</strong> ({data.duration} min)
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span style={{ color: theme.accentRed, fontWeight: 'bold' }}>-{data.caloriesBurned} kcal</span>
          <button 
              onClick={onDelete} 
              style={{
                background: 'none',
                border: 'none',
                fontSize: '18px',
                cursor: 'pointer',
                opacity: 0.6,
                padding: '5px',
                transition: 'opacity 0.2s'
              }}
              title="Delete Workout"
              onMouseOver={(e) => e.target.style.opacity = 1}
              onMouseOut={(e) => e.target.style.opacity = 0.6}
          >
              🗑️
          </button>
      </div>
    </div>
  );
};

export default WorkoutCard;