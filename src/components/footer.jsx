import React from 'react';
import './footer.css';

const Footer = () => {
  return (
    <footer className="footer-container">
      <div className="footer-content">
        <div className="footer-section brand-info">
          <h3>GoldTech Hotel</h3>
          <p>Luxury accomodation with exceptional service and unforgettable experiences.</p>
        </div>

        <div className="footer-section quick-links">
          <h3>Quick Links</h3>
          <ul>
            <li><a href="#">Home</a></li>
            <li><a href="#">Contact Us</a></li>
            <li><a href="#">Book Now</a></li>
          </ul>
        </div>

        <div className="footer-section contact-info">
          <h3>Contact Info</h3>
          <p><span className="icon">&#128205;</span> 123 Luxury Avenue, Beverly Hills, CA</p>
          <p><span className="icon">&#128222;</span> +1(555) 123-4567</p>
          <p><span className="icon">&#9993;</span> info@goldtechhotel.com</p>
        </div>
      </div>

      <div className="footer-bottom">
        <p>&copy; 2025 Amadeus Hotel. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;