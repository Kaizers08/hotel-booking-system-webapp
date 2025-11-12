import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Header from '../components/header';
import './Dashboard.css'; // Reuse dashboard styles for consistency

const PaymentInstruction = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const room = location.state?.room;
  const action = location.state?.action || 'book'; // 'book' or 'reserve'

  const [originBank, setOriginBank] = useState('');
  const [senderName, setSenderName] = useState('');
  const [transferProof, setTransferProof] = useState(null);
  const [checkInDate, setCheckInDate] = useState('');
  const [checkInTime, setCheckInTime] = useState('');

  // Get today's date in YYYY-MM-DD format to prevent past date selection
  const today = new Date().toISOString().split('T')[0];

  if (!room) {
    navigate('/dashboard');
    return null;
  }

  // Calculate costs
  const subtotal = room.price;
  const tax = Math.round(subtotal * 0.12); // 12% tax
  const total = subtotal + tax;

  const handleContinueToBook = () => {
    if (!checkInDate || !checkInTime || !originBank || !senderName || !transferProof) {
      alert('Please fill in all required fields and upload transfer proof.');
      return;
    }

    // Handle booking completion logic here
    console.log(`${action === 'reserve' ? 'Reserve' : 'Book'} completed:`, {
      room: room.name,
      checkInDate,
      checkInTime,
      subtotal,
      tax,
      total,
      originBank,
      senderName,
      action
    });

    navigate('/payment-completed');
  };

  const handleCancel = () => {
    navigate('/payment-method', { state: { room, action } });
  };

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      setTransferProof(file);
    }
  };

  return (
    <div className="dashboard">
      <Header />
      <div className="dashboard-body">
        {/* Step Indicator - Steps 1 & 2 active */}
        <div className="step-indicator">
          <div className="step-circle active">✓</div>
          <div className="step-line"></div>
          <div className="step-circle active">2</div>
          <div className="step-line"></div>
          <div className="step-circle">3</div>
        </div>

        {/* Main Heading */}
        <h2 className="payment-heading">Payment</h2>
        <p className="payment-instruction">Kindly follow the instructions below</p>

        {/* Payment Layout - Two Columns */}
        <div className="payment-layout">
          {/* Left Column */}
          <div className="payment-left">
            {/* Select Date & Time */}
            <div className="payment-section">
              <h3 className="section-title">Select Date & Time</h3>
              <div className="date-time-grid">
                <div className="form-group">
                  <label className="form-label">Check-in Date:</label>
                  <input
                    type="date"
                    className="form-input"
                    value={checkInDate}
                    onChange={(e) => setCheckInDate(e.target.value)}
                    min={today}
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Check-in Time:</label>
                  <input
                    type="time"
                    className="form-input"
                    value={checkInTime}
                    onChange={(e) => setCheckInTime(e.target.value)}
                    required
                  />
                </div>
              </div>
            </div>

            {/* Transfer Summary */}
            <div className="payment-section">
              <h3 className="section-title">Transfer Summary</h3>
              <div className="summary-section">
                <div className="summary-row">
                  <span className="summary-label">Tax (12%):</span>
                  <span className="summary-amount">₱{tax.toLocaleString()}</span>
                </div>
                <div className="summary-row">
                  <span className="summary-label">Subtotal:</span>
                  <span className="summary-amount">₱{subtotal.toLocaleString()}</span>
                </div>
                <div className="summary-row total">
                  <span>Total:</span>
                  <span>₱{total.toLocaleString()}</span>
                </div>
              </div>
            </div>

            {/* QR Code */}
            <div className="payment-section">
              <h3 className="section-title">Scan QR Code</h3>
              <div className="qr-container">
                <img src="/qrcode.png" alt="QR Code for Payment" className="qr-code-image" />
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="payment-right">
            {/* Upload Proof of Transfer */}
            <div className="form-group">
              <h3 className="section-title">Upload Proof of Transfer</h3>
              <input
                type="file"
                accept="image/*,.pdf"
                onChange={handleFileUpload}
                className="form-input-file"
                required
              />
              {transferProof && (
                <p className="file-uploaded">✓ {transferProof.name}</p>
              )}
            </div>

            {/* Origin Bank */}
            <div className="form-group">
              <h3 className="section-title">Origin Bank</h3>
              <select
                className="form-input"
                value={originBank}
                onChange={(e) => setOriginBank(e.target.value)}
                required
              >
                <option value="">Select Bank</option>
                <option value="GCash">GCash</option>
              </select>
            </div>

            {/* Sender Name */}
            <div className="form-group">
              <h3 className="section-title">Sender Name</h3>
              <input
                type="text"
                className="form-input"
                value={senderName}
                onChange={(e) => setSenderName(e.target.value)}
                placeholder="Enter sender name"
                required
              />
            </div>
          </div>
        </div>

        {/* Final Action Buttons */}
        <div className="payment-final-buttons">
          <button onClick={handleContinueToBook} className="payment-continue-btn">
            {action === 'reserve' ? 'Complete Reservation' : 'Finalize Booking'}
          </button>
          <button onClick={handleCancel} className="payment-cancel-btn">Cancel</button>
        </div>
      </div>
    </div>
  );
};

export default PaymentInstruction;
