import React from 'react';

const CircularProgress = ({ 
  value, 
  max, 
  size = 180, 
  strokeWidth = 15, 
  color = '#3498db', 
  trackColor = '#e0e0e0',
  label,
  subLabel,
  theme
}) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  
  // Ensure value acts as progress (can go over max for overlap effect)
  const safeMax = max > 0 ? max : 1; 
  const percentage = (value / safeMax) * 100;
  
  // Main offset calculation
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  // Overlap logic: if > 100%, we calculate the "extra" bit
  const isOver = percentage > 100;
  const extraPercentage = isOver ? percentage - 100 : 0;
  const extraOffset = circumference - (extraPercentage / 100) * circumference;

  return (
    <div style={{ position: 'relative', width: size, height: size, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
        {/* Background Track */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={trackColor}
          strokeWidth={strokeWidth}
          fill="transparent"
        />
        
        {/* Main Progress Bar */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={color}
          strokeWidth={strokeWidth}
          fill="transparent"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          style={{ transition: 'stroke-dashoffset 0.5s ease' }}
        />

        {/* Overlap Bar (Darker shade to show "wrapping") */}
        {isOver && (
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={color} // Could darken this if desired, or keep same to just "fill"
            strokeWidth={strokeWidth}
            fill="transparent"
            strokeDasharray={circumference}
            strokeDashoffset={extraOffset}
            strokeLinecap="round"
            style={{ opacity: 0.5, transition: 'stroke-dashoffset 0.5s ease' }}
          />
        )}
      </svg>

      {/* Centered Text */}
      <div style={{ position: 'absolute', textAlign: 'center', color: theme.text }}>
        <div style={{ fontSize: '24px', fontWeight: '800' }}>{Math.round(value)}</div>
        <div style={{ fontSize: '12px', color: theme.subText }}>{label}</div>
        {subLabel && <div style={{ fontSize: '12px', color: theme.subText }}>{subLabel}</div>}
      </div>
    </div>
  );
};

export default CircularProgress;