import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

const ProtectedRoute = () => {
  // Check for the authentication token
  const token = localStorage.getItem('token');

  // If token exists, render the child routes (Outlet)
  // If not, redirect to the login page
  return token ? <Outlet /> : <Navigate to="/login" replace />;
};

export default ProtectedRoute;