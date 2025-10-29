import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import './header.css';

const Header = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { user, logout } = useAuth();

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    const firstName = user?.displayName?.split(' ')[0] || user?.email.split('@')[0] || 'User';

    return (
        <header className="header">
            <div className="logo">GoldTech Hotel</div>
            <nav className="nav">
                <Link to="/" className={`nav-link ${location.pathname === '/' ? 'active' : ''}`}> Home </Link>
                <Link to="/contact" className={`nav-link ${location.pathname === '/contact' ? 'active' : ''}`}> Contact Us </Link>
                {user ? (
                    <>
                        <Link to="/dashboard" className={`nav-link ${location.pathname === '/dashboard' ? 'active' : ''}`}> Dashboard </Link>
                        <span className="welcome-text">Welcome, {firstName}!</span>
                        <button onClick={handleLogout} className="logout-btn">Logout</button>
                    </>
                ) : (
                    <Link to="/login" className={`nav-link ${location.pathname === '/login' || location.pathname === '/register' ? 'active' : ''}`}> Login </Link>
                )}
            </nav>
        </header>
    );
};

export default Header;
