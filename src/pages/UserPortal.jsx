import React from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/header';
import FeaturedHotels from '../components/FeaturedHotels';
import WhyChooseUs from '../components/WhyChooseUs';
import Footer from '../components/footer';

// EXACTLY like original home.jsx
const UserPortal = () => {
  return (
    <>
      <div className="home">
        <Header />
        <div className="hero-content">
          <h2>Welcome to GoldTech Hotel</h2>
          <p className="hero-subtitle">Experience luxury and comfort like never before</p>
        </div>
        <Link to="/login" className="book-button">Book Now</Link>
      </div>
      <br></br>
      <FeaturedHotels />
      <WhyChooseUs />
      <Footer />
    </>
  );
};

export default UserPortal;
