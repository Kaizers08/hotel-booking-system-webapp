import React, { useState } from 'react';
import Header from '../components/header';
import FeaturedHotels from '../components/FeaturedHotels';
import './home.css';

const Home = () => {
  const [showContactModal, setShowContactModal] = useState(false);

  const toggleContactModal = () => {
    setShowContactModal(!showContactModal);
  };

  return (
    <>
      <div className="home">
        <Header onContactClick={toggleContactModal} />
        <div className="hero-content">
          <h2>Welcome to GoldTech Hotel</h2>
          <p className="hero-subtitle">Experience luxury and comfort like never before</p>
        </div>
        <button className="book-button">Book Now</button>
      </div>
      <br></br>
      <FeaturedHotels />
      
      {showContactModal && (
        <div className="modal-overlay" onClick={toggleContactModal}>
          <div className="contact-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Contact Us</h2>
              <button className="close-button" onClick={toggleContactModal}>×</button>
            </div>
            <div className="modal-body">
              <p><strong>Address:</strong> 123 Luxury Avenue, Beverly Hills, CA</p>
              <p><strong>Phone:</strong> +1(555) 123-4567</p>
              <p><strong>Email:</strong> info@goldtechhotel.com</p>
              <p>We're here to assist you 24/7 with any inquiries or special requests.</p>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Home;