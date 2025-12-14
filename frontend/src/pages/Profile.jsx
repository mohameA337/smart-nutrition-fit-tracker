import React, { useState } from 'react';
import { THEMES } from '../theme/theme';

const Profile = () => {
  // Theme State
  const [isDarkMode, setIsDarkMode] = useState(true);
  const theme = isDarkMode ? THEMES.dark : THEMES.light;
  
  // Toggle Handler
  const toggleTheme = () => setIsDarkMode(!isDarkMode);

  // Edit Mode State
  const [isEditing, setIsEditing] = useState(false);

  // User Data State
  const [user, setUser] = useState({
    name: "user1",
    email: "user1@gmail.com",
    gender: "Male", 
    age: 28,
    height: 178, // cm
    weight: 74,  // kg (Current Weight)
    activityRate: "High",
    startWeight: 70, 
    goalWeight: 80   
  });

  const [formData, setFormData] = useState(user);

  // --- Handlers ---
  const handleEditClick = () => {
    setFormData(user); 
    setIsEditing(true);
  };

  const handleCancelClick = () => {
    setIsEditing(false);
  };

  const handleSaveClick = () => {
    setUser(formData); 
    setIsEditing(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handlePasswordReset = () => {
    alert(`A password reset confirmation has been sent to ${user.email}`);
  };

  // --- INTELLIGENT PROGRESS LOGIC ---
  const isBulking = user.goalWeight > user.startWeight;
  const isMaintenance = user.goalWeight === user.startWeight;

  const totalChangeNeeded = user.startWeight - user.goalWeight;
  const currentChange = user.startWeight - user.weight; 
  
  let progressPercentage = 0;
  if (!isMaintenance) {
      progressPercentage = Math.min(Math.max((currentChange / totalChangeNeeded) * 100, 0), 100);
  } else {
      progressPercentage = 100; 
  }

  // Dynamic Text Helpers (Fixed to 2 decimals)
  const amountChanged = Math.abs(user.weight - user.startWeight).toFixed(2);
  const amountRemaining = Math.abs(user.goalWeight - user.weight).toFixed(2);
  
  const progressColor = isBulking ? '#8e44ad' : theme.accentBlue; 

  // --- Styles ---
  const pageStyle = {
    minHeight: '100vh',
    background: theme.bg,
    color: theme.text,
    transition: 'background 0.3s, color 0.3s',
    padding: '20px',
    fontFamily: 'Arial, sans-serif'
  };

  const cardStyle = {
    background: theme.cardBg,
    padding: '30px',
    borderRadius: '16px',
    boxShadow: '0 4px 6px rgba(0,0,0,0.05)',
    border: `1px solid ${theme.cardBorder}`,
    maxWidth: '600px',
    margin: '0 auto 20px auto',
    transition: 'background 0.3s, border 0.3s'
  };

  const labelStyle = { 
    display: 'block', 
    color: theme.subText, 
    fontSize: '13px', 
    marginBottom: '5px',
    fontWeight: 'bold',
    transition: 'color 0.3s'
  };

  const inputStyle = {
    width: '100%',
    padding: '10px',
    borderRadius: '8px',
    border: `1px solid ${theme.cardBorder}`,
    background: isEditing ? theme.inputBg : 'transparent',
    color: theme.inputText,
    fontSize: '16px',
    marginBottom: '15px',
    boxSizing: 'border-box',
    outline: 'none',
    borderColor: isEditing ? theme.cardBorder : 'transparent',
    paddingLeft: isEditing ? '10px' : '0',
    transition: 'background 0.3s, color 0.3s, border-color 0.3s'
  };

  const buttonStyle = {
    padding: '10px 20px',
    borderRadius: '8px',
    border: 'none',
    cursor: 'pointer',
    fontWeight: 'bold',
    marginRight: '10px',
    transition: 'opacity 0.2s, background 0.3s, color 0.3s'
  };

  return (
    <div style={pageStyle}>
      <div style={{ maxWidth: "1000px", margin: "0 auto" }}>
        
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
          <h1 style={{ margin: 0 }}>My Profile</h1>
          
          <button 
            onClick={toggleTheme}
            style={{
              background: 'transparent',
              border: `2px solid ${theme.accentBlue}`,
              color: theme.text,
              padding: '8px 16px',
              borderRadius: '20px',
              cursor: 'pointer',
              fontWeight: 'bold',
              transition: 'color 0.3s, border-color 0.3s'
            }}
          >
            {isDarkMode ? '☀️ Light Mode' : '🌙 Dark Mode'}
          </button>
        </div>

        {/* Profile Info Form */}
        <div style={cardStyle}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', borderBottom: `2px solid ${theme.accentBlue}`, paddingBottom: '10px' }}>
            <h2 style={{ margin: 0 }}>👤 Personal Details</h2>
            {!isEditing && (
                <button 
                    onClick={handleEditClick}
                    style={{ ...buttonStyle, background: theme.accentBlue, color: 'white' }}
                >
                    Edit Info
                </button>
            )}
          </div>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
            
            {/* Name */}
            <div style={{ gridColumn: 'span 2' }}>
              <label style={labelStyle}>Full Name</label>
              {isEditing ? (
                  <input 
                    name="name" 
                    value={formData.name} 
                    onChange={handleChange} 
                    style={inputStyle} 
                  />
              ) : (
                  <div style={inputStyle}>{user.name}</div>
              )}
            </div>

            {/* Email (Read Only) */}
            <div style={{ gridColumn: 'span 2' }}>
              <label style={labelStyle}>Email (Cannot be changed)</label>
              <input 
                value={user.email} 
                readOnly 
                disabled
                style={{ ...inputStyle, opacity: 0.7, cursor: 'not-allowed', background: theme.itemBg }} 
              />
            </div>

            {/* Age */}
            <div>
              <label style={labelStyle}>Age</label>
              {isEditing ? (
                  <input 
                    type="number" 
                    name="age" 
                    value={formData.age} 
                    onChange={handleChange} 
                    style={inputStyle} 
                  />
              ) : (
                  <div style={inputStyle}>{user.age}</div>
              )}
            </div>

            {/* Gender */}
            <div>
              <label style={labelStyle}>Gender</label>
              {isEditing ? (
                  <select 
                    name="gender" 
                    value={formData.gender} 
                    onChange={handleChange}
                    style={{ ...inputStyle, cursor: 'pointer' }}
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                  </select>
              ) : (
                  <div style={inputStyle}>{user.gender}</div>
              )}
            </div>

            {/* Height */}
            <div>
              <label style={labelStyle}>Height (cm)</label>
              {isEditing ? (
                  <input 
                    type="number" 
                    name="height" 
                    value={formData.height} 
                    onChange={handleChange} 
                    style={inputStyle} 
                  />
              ) : (
                  <div style={inputStyle}>{user.height} cm</div>
              )}
            </div>

            {/* Weight */}
            <div>
              <label style={labelStyle}>Weight (kg)</label>
              {isEditing ? (
                  <input 
                    type="number" 
                    name="weight" 
                    value={formData.weight} 
                    onChange={handleChange} 
                    style={inputStyle} 
                  />
              ) : (
                  <div style={inputStyle}>{user.weight} kg</div>
              )}
            </div>

            {/* Activity Rate (Dropbox) */}
            <div style={{ gridColumn: 'span 2' }}>
              <label style={labelStyle}>Activity Rate</label>
              {isEditing ? (
                  <select 
                    name="activityRate" 
                    value={formData.activityRate} 
                    onChange={handleChange}
                    style={{ ...inputStyle, cursor: 'pointer' }}
                  >
                    <option value="Low">Low</option>
                    <option value="Moderate">Moderate</option>
                    <option value="High">High</option>
                  </select>
              ) : (
                  <div style={inputStyle}>{user.activityRate}</div>
              )}
            </div>
            
            {/* Start Weight */}
            <div>
              <label style={labelStyle}>Start Weight (kg)</label>
              {isEditing ? (
                  <input 
                    type="number" 
                    name="startWeight" 
                    value={formData.startWeight} 
                    onChange={handleChange} 
                    style={inputStyle} 
                  />
              ) : (
                  <div style={inputStyle}>{user.startWeight} kg</div>
              )}
            </div>

            {/* GOAL WEIGHT */}
            <div>
              <label style={labelStyle}>Goal Weight (kg)</label>
              {isEditing ? (
                  <input 
                    type="number" 
                    name="goalWeight" 
                    value={formData.goalWeight} 
                    onChange={handleChange} 
                    style={inputStyle} 
                  />
              ) : (
                  <div style={inputStyle}>{user.goalWeight} kg</div>
              )}
            </div>

          </div>

          {/* Action Buttons */}
          {isEditing && (
              <div style={{ marginTop: '20px', display: 'flex', gap: '10px' }}>
                  <button 
                    onClick={handleSaveClick}
                    style={{ ...buttonStyle, background: '#27ae60', color: 'white', flex: 1 }}
                  >
                    Save Changes
                  </button>
                  <button 
                    onClick={handleCancelClick}
                    style={{ ...buttonStyle, background: theme.itemBg, color: theme.text, border: `1px solid ${theme.cardBorder}`, flex: 1 }}
                  >
                    Cancel
                  </button>
              </div>
          )}
        </div>

        {/* Progress Bar */}
        <div style={cardStyle}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: `2px solid ${theme.accentRed}`, paddingBottom: '10px', marginBottom: '15px' }}>
            <h2 style={{ margin: 0 }}>
              {isBulking ? "💪 Bulk Progress" : "🔥 Cut Progress"}
            </h2>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px', fontSize: '14px' }}>
             <span>Start: <strong>{user.startWeight}kg</strong></span>
             <span>Goal: <strong>{user.goalWeight}kg</strong></span>
          </div>

          <div style={{
            height: '25px',
            width: '100%',
            backgroundColor: theme.itemBg,
            borderRadius: '15px',
            overflow: 'hidden',
            marginTop: '10px',
            border: `1px solid ${theme.itemBorder}`,
            transition: 'background 0.3s, border 0.3s'
          }}>
            <div style={{
                height: '100%',
                width: `${progressPercentage}%`,
                backgroundColor: progressColor, // Dynamic Color
                transition: 'width 0.5s ease-in-out',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'flex-end',
                paddingRight: '10px',
                color: 'white',
                fontSize: '12px',
                fontWeight: 'bold'
            }}>
              {Math.round(progressPercentage)}%
            </div>
          </div>
          
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '15px', paddingTop: '15px', borderTop: `1px dashed ${theme.itemBorder}` }}>
             <div style={{ textAlign: 'center' }}>
                <div style={labelStyle}>{isBulking ? "Total Gained" : "Total Lost"}</div>
                <div style={{ fontSize: '18px', fontWeight: 'bold', color: progressColor }}>
                    {amountChanged} kg
                </div>
             </div>
             <div style={{ textAlign: 'center' }}>
                <div style={labelStyle}>Current Weight</div>
                <div style={{ fontSize: '22px', fontWeight: 'bold', color: theme.text }}>
                    {user.weight} kg
                </div>
             </div>
             <div style={{ textAlign: 'center' }}>
                <div style={labelStyle}>{isBulking ? "To Gain" : "To Lose"}</div>
                <div style={{ fontSize: '18px', fontWeight: 'bold', color: theme.subText }}>
                    {amountRemaining} kg
                </div>
             </div>
          </div>
        </div>

        {/* Security / Password */}
        <div style={cardStyle}>
            <h3 style={{ margin: '0 0 15px 0', color: theme.subText }}>Security</h3>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '14px' }}>Need to update your password?</span>
                <button 
                    onClick={handlePasswordReset}
                    style={{ 
                        ...buttonStyle, 
                        background: 'transparent', 
                        border: `1px solid ${theme.accentRed}`, 
                        color: theme.accentRed 
                    }}
                >
                    Reset Password via Email
                </button>
            </div>
        </div>

      </div>
    </div>
  );
};

export default Profile;