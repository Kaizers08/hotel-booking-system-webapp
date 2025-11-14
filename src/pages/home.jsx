import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Header from '../components/header';
import FeaturedHotels from '../components/FeaturedHotels';
// import './home.css';

const Home = () => {
  const { isAuthenticated } = useAuth();

  return (
    <>
      <div className="home">
        <Header />
        <div className="hero-content">
          <h2>Welcome to GoldTech Hotel</h2>
          <p className="hero-subtitle">Experience luxury and comfort like never before</p>
        </div>
        <Link to={isAuthenticated ? "/dashboard" : "/login"} className="book-button">Book Now</Link>
      </div>
      <br></br>
      <FeaturedHotels />
    </>
  );
};

export default Home;
