import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Import Components
import Navbar from './components/Navbar';

// Import Pages
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Profile from './pages/Profile'; // Import Profile

function App() {
  return (
    <Router>
      <div className="app-container">
        <Navbar />
        
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/login" element={<Login />} />
          <Route path="/profile" element={<Profile />} /> {/* Add Route */}
        </Routes>
      </div>
    </Router>
  );
}

export default App;