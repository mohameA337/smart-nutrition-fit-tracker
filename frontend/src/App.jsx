import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Import Components
import Navbar from './components/Navbar';

// Import Pages
import Dashboard from './pages/Dashboard';
import Login from './pages/Login'; // <--- Import the new Login page

function App() {
  return (
    <Router>
      <div className="app-container">
        {/* Navbar stays at the top */}
        <Navbar />
        
        {/* Routes switch the content below */}
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/login" element={<Login />} /> {/* <--- Add this Route */}
        </Routes>
      </div>
    </Router>
  );
}

export default App;