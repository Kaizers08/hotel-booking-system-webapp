import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { db } from '../firebase';
import { collection, getDocs } from 'firebase/firestore';
import './DashboardHeader.css';

const DashboardHeader = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    checkAdminStatus();
  }, [user]);

  const checkAdminStatus = async () => {
    if (!user) return;

    try {
      const adminDoc = await getDocs(collection(db, 'admins'));
      const adminEmails = adminDoc.docs.map(doc => doc.data().email);
      setIsAdmin(adminEmails.includes(user.email));
    } catch (error) {
      console.error('Error checking admin status:', error);
    }
  };

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
        <Link to="/dashboard" className={`nav-link ${location.pathname === '/dashboard' || location.pathname === '/booking' ? 'active' : ''}`}>Dashboard</Link>
        {isAdmin && <Link to="/admin" className={`nav-link ${location.pathname === '/admin' ? 'active' : ''}`}>Admin Panel</Link>}
        <span className="welcome-text">Welcome, {firstName}!</span>
        <button onClick={handleLogout} className="logout-btn">Logout</button>
      </nav>
    </header>
  );
};

export default DashboardHeader;
