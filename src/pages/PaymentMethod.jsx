import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Header from '../components/header';
import './Dashboard.css'; // Reuse dashboard styles for consistency

const PaymentMethod = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const room = location.state?.room;
  const action = location.state?.action || 'book'; // 'book' or 'reserve'

  if (!room) {
    navigate('/dashboard');
    return null;
  }

  const handleAction = () => {
    // Navigate to payment instruction page (step 2)
    navigate('/payment-instruction', { state: { room, action } });
  };

  const handleCancel = () => {
    navigate('/dashboard');
  };

  return (
    <div className="dashboard">
      <Header />
      <div className="dashboard-body">
        {/* Step Indicator */}
        <div className="step-indicator">
          <div className="step-circle active">1</div>
          <div className="step-line"></div>
          <div className="step-circle">2</div>
          <div className="step-line"></div>
          <div className="step-circle">3</div>
        </div>

        {/* Main Heading */}
        <h2 className="payment-heading">Payment Method</h2>

        {/* Room Details Card */}
        <div className="payment-room-card">
          <div className="payment-card-content">
            <img src={room.image} alt={room.name} className="payment-room-image" />
            <div className="payment-room-details">
              <h3 className="payment-room-title">{room.name}</h3>
              <p className="payment-room-price">From <span className="price-gold">₱{room.price.toLocaleString()}</span> per night</p>
              <p className="payment-room-description">{room.details}</p>
              <p className="payment-room-availability">Available Rooms: <span className="available-count">{room.available}</span></p>
            </div>
          </div>

          {/* Action buttons */}
          <div className="payment-buttons">
            <button onClick={handleAction} className="payment-continue-btn">
              {action === 'reserve' ? 'Reserve Room' : 'Continue to Book'}
            </button>
            <button onClick={handleCancel} className="payment-cancel-btn">Cancel</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentMethod;
