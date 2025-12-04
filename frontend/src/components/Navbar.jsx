import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
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
        <Link to="/" style={{ color: 'white', textDecoration: 'none', marginRight: '20px' }}>Dashboard</Link>
        <Link to="/login" style={{ color: '#ecf0f1', textDecoration: 'none' }}>Login</Link>
      </div>
    </nav>
  );
};

export default Navbar;