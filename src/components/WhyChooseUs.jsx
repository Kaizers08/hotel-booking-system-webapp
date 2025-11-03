import React from 'react';
import './WhyChooseUs.css';

const WhyChooseUs = () => {
  return (
    <section className="why-choose-us-section">
      <h2 className="section-title">Why Choose GoldTech Hotel?</h2>
      <div className="features-container">
        <div className="feature-card">
          <div className="icon-wrapper">
            <img src="/accomodation.png" alt="Luxury Accommodations" className="feature-icon" />
          </div>
          <h3>Luxury Accommodations</h3>
          <p>Spacious rooms premium amenities and stunning views</p>
        </div>

        <div className="feature-card">
          <div className="icon-wrapper">
            <img src="/service.png" alt="Exceptional Service" className="feature-icon" />
          </div>
          <h3>Exceptional Service</h3>
          <p>Friendly staff, 24/7 assistance, and personalized care to make you feel at home.</p>
        </div>

        <div className="feature-card">
          <div className="icon-wrapper">
            <img src="/private.png" alt="Secure and Private" className="feature-icon" />
          </div>
          <h3>Secure and Private</h3>
          <p>Safety features, reliable housekeeping, and private spaces for your peace of mind.</p>
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUs;
