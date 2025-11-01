import React from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/header';
import './Dashboard.css'; // Reuse dashboard styles for consistency

const PaymentCompleted = () => {
  const navigate = useNavigate();

  const handleDone = () => {
    navigate('/dashboard');
  };

  return (
    <div className="dashboard">
      <Header />
      <div className="dashboard-body">
        {/* Step Indicator - All 3 steps completed */}
        <div className="step-indicator">
          <div className="step-circle active">✓</div>
          <div className="step-line"></div>
          <div className="step-circle active">✓</div>
          <div className="step-line"></div>
          <div className="step-circle active">✓</div>
        </div>

        {/* Main Heading */}
        <h2 className="payment-heading">Payment Completed</h2>

        {/* Payment Complete Illustration */}
        <div className="payment-complete-container">
          <img src="/paymentcomplete.png" alt="Payment Completed" className="payment-complete-image" />

          {/* Done Button */}
          <button onClick={handleDone} className="payment-done-btn">Done</button>
        </div>
      </div>
    </div>
  );
};

export default PaymentCompleted;
