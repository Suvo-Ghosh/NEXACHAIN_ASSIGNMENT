import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Register from './pages/Register';
import { verifyAuth } from './services/api';

// Upgraded Protected Route
const ProtectedRoute = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(null);

  useEffect(() => {
    const checkToken = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        setIsAuthenticated(false);
        return;
      }

      try {
        // Ping the backend to verify the token is valid and not expired
        await verifyAuth();
        setIsAuthenticated(true);
      } catch (error) {
        // If the backend rejects the token (401), clear it and deny access
        localStorage.removeItem('token');
        setIsAuthenticated(false);
      }
    };

    checkToken();
  }, []);

  // Show a loading screen while waiting for the backend to respond
  if (isAuthenticated === null) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-gray-500 font-medium">Verifying session...</div>
      </div>
    );
  }

  // If verified, render the protected component. Otherwise, boot them to login.
  return isAuthenticated ? children : <Navigate to="/login" replace />;
};

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />

          <Route path="/" element={<Navigate to="/dashboard" replace />} />

          <Route path="*" element={
            <div className="flex items-center justify-center min-h-screen">
              <h1 className="text-2xl font-bold text-gray-600">404 - Page Not Found</h1>
            </div>
          } />
        </Routes>
      </div>
    </Router>
  );
}

export default App;