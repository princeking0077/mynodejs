import React, { useState } from 'react';
import AdminLogin from './components/AdminLogin';
import AdminDashboard from './components/AdminDashboard';
import './App.css';

function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [authError, setAuthError] = useState('');

  const handleLogin = async (email, password) => {
    try {
      // Replace with actual API call
      if (email === 'admin@example.com' && password === 'admin123') {
        setCurrentUser({
          name: 'Admin User',
          email: email,
          avatar: 'A'
        });
        setAuthError('');
      } else {
        setAuthError('Invalid credentials. Please check your email and password.');
      }
    } catch (error) {
      setAuthError('Login failed. Please try again.');
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setAuthError('');
  };

  return (
    <div className="app">
      {!currentUser ? (
        <AdminLogin onLogin={handleLogin} authError={authError} />
      ) : (
        <AdminDashboard user={currentUser} onLogout={handleLogout} />
      )}
    </div>
  );
}

export default App;
