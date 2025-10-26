import React from 'react';

const Header = ({ onContactClick }) => {
    return (
        <header className ="header">
            <div className="logo">GoldTech Hotel</div>
            <nav className="nav">
                <a href = "#home" className="nav-link"> Home </a>
                <a href = "#contact" className="nav-link" onClick={(e) => {
                    e.preventDefault();
                    onContactClick && onContactClick();
                }}> Contact Us </a>
                <a href="#login" className="nav-link"> Login </a>
            </nav>
        </header>
    );
};

export default Header;