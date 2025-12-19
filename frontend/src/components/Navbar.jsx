import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Navbar = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <nav style={{
      backgroundColor: '#2c3e50',
      padding: '1rem 2rem',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      color: 'white',
      marginBottom: '0'
    }}>
      <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>
        🥑 Smart Fit
      </div>
      <div>
        {token ? (
          <>
            <Link to="/dashboard" style={{ color: 'white', textDecoration: 'none', marginRight: '20px' }}>Dashboard</Link>
            <Link to="/profile" style={{ color: 'white', textDecoration: 'none', marginRight: '20px' }}>Profile</Link>
            <Link to="/chatbot" style={{ color: 'white', textDecoration: 'none', marginRight: '20px' }}>AI Chat</Link>
            <button
              onClick={handleLogout}
              style={{
                background: 'none',
                border: 'none',
                color: 'white',
                cursor: 'pointer',
                fontSize: '1rem',
                textDecoration: 'underline'
              }}
            >
              Logout
            </button>
          </>
        ) : (
          <Link to="/login" style={{ color: 'white', textDecoration: 'none' }}>Login</Link>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
