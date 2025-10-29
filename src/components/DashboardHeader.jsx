import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import './DashboardHeader.css';

const DashboardHeader = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const firstName = user?.displayName?.split(' ')[0] || user?.email.split('@')[0] || 'User';

  return (
    <header className="dashboard-header">
      <div className="logo">GoldTech Hotel</div>
      <nav className="nav">
        <Link to="/" className={`nav-link`}>Home</Link>
        <Link to="/contact" className={`nav-link`}>Contact Us</Link>
        <Link to="/dashboard" className={`nav-link active`}>Dashboard</Link>
        <span className="welcome-text">Welcome, {firstName}!</span>
        <button onClick={handleLogout} className="logout-btn">Logout</button>
      </nav>
    </header>
  );
};

export default DashboardHeader;
