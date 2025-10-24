import React from 'react';
import Header from '../components/header';

const Home = () => {
  return (
    <div className="home">
      <Header />
      <div className="hero-content">
        <h2>Welcome to GoldTech Hotel</h2>
        <p>Experience luxury and comfort like never before</p>
        <button className="book-button">Book Now</button>
      </div>
    </div>
  );
};

export default Home;
