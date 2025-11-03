import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { db } from '../firebase';
import { collection, getDocs } from 'firebase/firestore';
import './header.css';

const Header = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { user, logout } = useAuth();
    const [isAdmin, setIsAdmin] = useState(false);

    useEffect(() => {
        checkAdminStatus();
    }, [user]);

    const checkAdminStatus = async () => {
        if (!user) {
            setIsAdmin(false);
            return;
        }

        try {
            const adminDoc = await getDocs(collection(db, 'admins'));
            const adminEmails = adminDoc.docs.map(doc => doc.data().email);
            setIsAdmin(adminEmails.includes(user.email));
        } catch (error) {
            console.error('Error checking admin status:', error);
            setIsAdmin(false);
        }
    };

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
                        <Link to="/dashboard" className={`nav-link ${location.pathname === '/dashboard' || location.pathname === '/booking' ? 'active' : ''}`}> Dashboard </Link>
                        {isAdmin && <Link to="/admin" className={`nav-link ${location.pathname === '/admin' ? 'active' : ''}`}> Admin Panel </Link>}
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
