import React from 'react';

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

export default StatCard;