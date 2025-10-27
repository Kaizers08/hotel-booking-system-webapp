import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import './header.css';

const Header = () => {
    const location = useLocation();

    return (
        <header className="header">
            <div className="logo">GoldTech Hotel</div>
            <nav className="nav">
                <Link to="/" className={`nav-link ${location.pathname === '/' ? 'active' : ''}`}> Home </Link>
                <Link to="/contact" className={`nav-link ${location.pathname === '/contact' ? 'active' : ''}`}> Contact Us </Link>
                <Link to="/login" className={`nav-link ${location.pathname === '/login' || location.pathname === '/register' ? 'active' : ''}`}> Login </Link>
            </nav>
        </header>
    );
};

export default Header;
