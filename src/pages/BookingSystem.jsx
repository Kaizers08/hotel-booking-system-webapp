import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { db } from '../firebase';
import { collection, getDocs } from 'firebase/firestore';
import DashboardHeader from '../components/DashboardHeader';
import './Dashboard.css';

const RoomCard = ({ room, onViewDetails }) => (
  <div className="room-card">
    <img src={room.image} alt={room.name} className="room-image" />
    <div className="room-info">
      <h3>{room.name}</h3>
      <p><span className="price">₱{room.price.toLocaleString()}</span> per night</p>
      <button onClick={() => onViewDetails(room)} className="details-button">View Details</button>
    </div>
  </div>
);

const RoomDetailsModal = ({ room, onClose, onBookNow, onReserveRoom }) => {
  if (!room) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="room-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-content">
          <img src={room.image} alt={room.name} className="modal-room-image" />
          <div className="modal-room-info">
            <h2 className="modal-room-title">{room.name}</h2>
            <p className="modal-price">From <span className="modal-price-gold">₱{room.price.toLocaleString()}</span> per night</p>
            <p className="modal-availability">Available Rooms: <span className="available-count">{room.available}</span></p>
            <p className="modal-description">{room.details}</p>
            <div className="modal-buttons">
              <button onClick={onBookNow} className="modal-book-btn">Book Now</button>
              <button onClick={onReserveRoom} className="modal-reserve-btn">Reserve Room</button>
              <button onClick={onClose} className="modal-back-btn">Back</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const PaymentMethodStep = ({ room, action, onNext, onBack }) => (
  <div className="booking-step">
    <div className="step-indicator">
      <div className="step-circle active">1</div>
      <div className="step-line"></div>
      <div className="step-circle">2</div>
      <div className="step-line"></div>
      <div className="step-circle">3</div>
    </div>

    <h2 className="payment-heading">Payment Method</h2>

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

      <div className="payment-buttons">
        <button onClick={onNext} className="payment-continue-btn">
          {action === 'reserve' ? 'Reserve Room' : 'Continue to Book'}
        </button>
        <button onClick={onBack} className="payment-cancel-btn">Back to Rooms</button>
      </div>
    </div>
  </div>
);

const PaymentInstructionStep = ({ room, action, onNext, onBack }) => {
  const [originBank, setOriginBank] = useState('');
  const [senderName, setSenderName] = useState('');
  const [transferProof, setTransferProof] = useState(null);
  const [checkInDate, setCheckInDate] = useState('');
  const [checkInTime, setCheckInTime] = useState('');

  const subtotal = room.price;
  const tax = Math.round(subtotal * 0.12);
  const total = subtotal + tax;

  const handleContinue = () => {
    if (!checkInDate || !checkInTime || !originBank || !senderName || !transferProof) {
      alert('Please fill in all required fields and upload transfer proof.');
      return;
    }
    onNext({
      room,
      action,
      checkInDate,
      checkInTime,
      subtotal,
      tax,
      total,
      originBank,
      senderName,
      transferProof
    });
  };

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      setTransferProof(file);
    }
  };

  return (
    <div className="booking-step">
      <div className="step-indicator">
        <div className="step-circle active">✓</div>
        <div className="step-line"></div>
        <div className="step-circle active">2</div>
        <div className="step-line"></div>
        <div className="step-circle">3</div>
      </div>

      <h2 className="payment-heading">Payment</h2>
      <p className="payment-instruction">Kindly follow the instructions below</p>

      <div className="payment-layout">
        <div className="payment-left">
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
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label">Check-in Time:</label>
                <select
                  className="form-input"
                  value={checkInTime}
                  onChange={(e) => setCheckInTime(e.target.value)}
                  required
                >
                  <option value="">Select Time</option>
                  <option value="14:00">2:00 PM</option>
                  <option value="15:00">3:00 PM</option>
                  <option value="16:00">4:00 PM</option>
                  <option value="17:00">5:00 PM</option>
                  <option value="18:00">6:00 PM</option>
                </select>
              </div>
            </div>
          </div>

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

          <div className="payment-section">
            <h3 className="section-title">Scan QR Code</h3>
            <div className="qr-container">
              <img src="/qrcode.png" alt="QR Code for Payment" className="qr-code-image" />
            </div>
          </div>
        </div>

        <div className="payment-right">
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

      <div className="payment-final-buttons">
        <button onClick={handleContinue} className="payment-continue-btn">
          {action === 'reserve' ? 'Complete Reservation' : 'Finalize Booking'}
        </button>
        <button onClick={onBack} className="payment-cancel-btn">Back</button>
      </div>
    </div>
  );
};

const PaymentCompletedStep = ({ onDone }) => (
  <div className="booking-step">
    <div className="step-indicator">
      <div className="step-circle active">✓</div>
      <div className="step-line"></div>
      <div className="step-circle active">✓</div>
      <div className="step-line"></div>
      <div className="step-circle active">✓</div>
    </div>

    <h2 className="payment-heading">Payment Completed</h2>

    <div className="payment-complete-container">
      <img src="/paymentcomplete.png" alt="Payment Completed" className="payment-complete-image" />
      <button onClick={onDone} className="payment-done-btn">Done</button>
    </div>
  </div>
);

const BookingSystem = () => {
  const navigate = useNavigate();
  const { isAuthenticated, saveBooking } = useAuth();
  const [activeFilter, setActiveFilter] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [bookingStep, setBookingStep] = useState('browse'); // 'browse', 'payment-method', 'payment-instruction', 'completed'
  const [bookingAction, setBookingAction] = useState('book');
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadRooms();
  }, []);

  const loadRooms = async () => {
    try {
      const roomsSnapshot = await getDocs(collection(db, 'rooms'));
      const roomsData = roomsSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setRooms(roomsData);
    } catch (error) {
      console.error('Error loading rooms:', error);
    } finally {
      setLoading(false);
    }
  };


  const handleFilterClick = (filter) => {
    setActiveFilter(filter);
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleViewDetails = (room) => {
    if (isAuthenticated) {
      setSelectedRoom(room);
    } else {
      navigate('/');
    }
  };

  const handleCloseModal = () => {
    setSelectedRoom(null);
  };

  const handleBookNow = () => {
    setBookingAction('book');
    setBookingStep('payment-method');
    // Keep selectedRoom for payment steps
  };

  const handleReserveRoom = () => {
    setBookingAction('reserve');
    setBookingStep('payment-method');
    // Keep selectedRoom for payment steps
  };

  const handleBackToRooms = () => {
    setBookingStep('browse');
    setSelectedRoom(null);
  };

  const handlePaymentNext = () => {
    setBookingStep('payment-instruction');
  };

  const handleInstructionNext = async (bookingData) => {
    try {
      await saveBooking(bookingData);
      setBookingStep('completed');
    } catch {
      alert('Failed to save booking. Please try again.');
    }
  };

  const handleBackToPaymentMethod = () => {
    setBookingStep('payment-method');
  };

  const handleDone = () => {
    setBookingStep('browse');
    setSelectedRoom(null);
  };

  const filteredRooms = rooms.filter((room) => {
    const matchesFilter = () => {
      if (activeFilter === 'All') {
        return true;
      }
      if (activeFilter === 'Silver Tier') {
        return room.category === 'Silver Tier';
      }
      if (activeFilter === 'Gold Tier') {
        return room.category === 'Gold Tier';
      }
      if (activeFilter === 'Penthouse') {
        return room.category === 'Penthouse';
      }
      if (activeFilter === 'Romance') {
        return room.category === 'Romance';
      }
      if (activeFilter === 'Seaside') {
        return room.category === 'Beach';
      }
      if (activeFilter === 'Family') {
        return room.category === 'Family';
      }
      return false;
    };

    const matchesSearch = room.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          room.details.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          room.category.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesFilter() && matchesSearch;
  });

  if (!isAuthenticated) {
    navigate('/');
    return null;
  }

  if (loading) {
    return (
      <div className="dashboard">
        <DashboardHeader />
        <div className="dashboard-body">
          <div style={{ textAlign: 'center', padding: '50px' }}>
            <h2>Loading rooms...</h2>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard">
      <DashboardHeader />
      <div className="dashboard-body">
        {bookingStep === 'browse' && (
          <>
            <div className="search-bar">
              <span className="search-label">Search:</span>
              <div className="search-input-container">
                <input
                  type="text"
                  placeholder="Search rooms"
                  className="search-input"
                  value={searchTerm}
                  onChange={handleSearchChange}
                />
                <img src="/search.png" alt="Search" className="search-icon" />
              </div>
            </div>
            <div className="filter-buttons">
              <button className={activeFilter === 'All' ? 'filter-btn active' : 'filter-btn'} onClick={() => handleFilterClick('All')}>All</button>
              <button className={activeFilter === 'Silver Tier' ? 'filter-btn active' : 'filter-btn'} onClick={() => handleFilterClick('Silver Tier')}>Silver Tier</button>
              <button className={activeFilter === 'Gold Tier' ? 'filter-btn active' : 'filter-btn'} onClick={() => handleFilterClick('Gold Tier')}>Gold Tier</button>
              <button className={activeFilter === 'Penthouse' ? 'filter-btn active' : 'filter-btn'} onClick={() => handleFilterClick('Penthouse')}>Penthouse</button>
              <button className={activeFilter === 'Romance' ? 'filter-btn active' : 'filter-btn'} onClick={() => handleFilterClick('Romance')}>Romance</button>
              <button className={activeFilter === 'Seaside' ? 'filter-btn active' : 'filter-btn'} onClick={() => handleFilterClick('Seaside')}>Seaside</button>
              <button className={activeFilter === 'Family' ? 'filter-btn active' : 'filter-btn'} onClick={() => handleFilterClick('Family')}>Family</button>
            </div>
            <h2 className="featured-title">Featured Rooms</h2>
            <br></br>
            <br></br>
            <div className="rooms-grid">
              {filteredRooms.map((room) => (
                <RoomCard key={room.name} room={room} onViewDetails={handleViewDetails} />
              ))}
            </div>
          </>
        )}

        {bookingStep === 'payment-method' && selectedRoom && (
          <PaymentMethodStep
            room={selectedRoom}
            action={bookingAction}
            onNext={handlePaymentNext}
            onBack={handleBackToRooms}
          />
        )}

        {bookingStep === 'payment-instruction' && selectedRoom && (
          <PaymentInstructionStep
            room={selectedRoom}
            action={bookingAction}
            onNext={handleInstructionNext}
            onBack={handleBackToPaymentMethod}
          />
        )}

        {bookingStep === 'completed' && (
          <PaymentCompletedStep
            onDone={handleDone}
          />
        )}
      </div>

      {selectedRoom && bookingStep === 'browse' && (
        <RoomDetailsModal
          room={selectedRoom}
          onClose={handleCloseModal}
          onBookNow={handleBookNow}
          onReserveRoom={handleReserveRoom}
        />
      )}
    </div>
  );
};

export default BookingSystem;
