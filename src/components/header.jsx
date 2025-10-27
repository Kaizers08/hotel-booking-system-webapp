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

    return (
        <header className="header">
            <div className="logo">GoldTech Hotel</div>
            <nav className="nav">
                <Link to="/" className={`nav-link ${location.pathname === '/' ? 'active' : ''}`}> Home </Link>
                <Link to="/contact" className={`nav-link ${location.pathname === '/contact' ? 'active' : ''}`}> Contact Us </Link>
                {user ? (
                    <button onClick={handleLogout} className="nav-link logout-btn">Logout</button>
                ) : (
                    <Link to="/login" className={`nav-link ${location.pathname === '/login' || location.pathname === '/register' ? 'active' : ''}`}> Login </Link>
                )}
            </nav>
        </header>
    );
};

export default Header;
