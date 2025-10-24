import React from 'react';
import Header from '../components/header';

const Home = () => {
  return (
    <div className="home">
      <Header />
      <div className="hero-content">
        <h2>Welcome to GoldTech Hotel</h2>
        <p className="hero-subtitle">Experience luxury and comfort like never before</p>
      </div>
      <button className="book-button">Book Now</button>
    </div>
  );
};

export default Home;
