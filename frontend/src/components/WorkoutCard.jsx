import React from 'react';

const WorkoutCard = ({ data, theme, onDelete }) => {
  if (!data) return null;

  return (
    <div style={{ 
      marginTop: "10px", 
      padding: "15px", 
      background: theme.accentRedbg, 
      borderRadius: "10px", 
      borderLeft: `5px solid ${theme.accentRed}`,
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
          <span>💪 {data.caloriesBurned} kcal ({data.duration}min)</span>
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
        title="Delete Workout"
        onMouseOver={(e) => e.target.style.opacity = 1}
        onMouseOut={(e) => e.target.style.opacity = 0.6}
      >
        🗑️
      </button>
    </div>
  );
};

export default WorkoutCard;