import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Header from '../components/header';
import './Dashboard.css';

const rooms = [
  {
    name: 'Silver Tier Room',
    price: 16744,
    image: '/silvertieroom.png',
    category: 'Silver Tier',
    details: 'A minimalist yet inviting space, the Silver Tier Room features a plush king-sized bed, modern bedside tables, and soft neutral colors. Warm ambient lighting and crisp linens ensure a restful stay for solo travelers or couples.',
    available: 5
  },
  {
    name: 'Gold Tier Room',
    price: 22344,
    image: '/goldtierroom.png',
    category: 'Gold Tier',
    details: 'A deluxe suite with sophisticated gold-toned decor, the Gold Tier Room combines comfort and luxury. Guests enjoy a large sofa, premium bedding, and floor-to-ceiling windows overlooking the vibrant cityscape.',
    available: 3
  },
  {
    name: 'The Penthouse',
    price: 33544,
    image: '/thepenthouse.png',
    category: 'Penthouse',
    details: 'A modern penthouse living room with panoramic city views, elegant furniture, chic décor, and soft ambient lighting—an exclusive space perfect for relaxation or entertaining in style.',
    available: 1
  },
  {
    name: 'Seaside View Room',
    price: 19544,
    image: '/seasideview.png',
    category: 'Beach',
    details: 'Wake up to soothing ocean waves in the Seaside View room. The design is light and airy, with a cozy queen-sized bed facing a large glass window that opens directly to a beautiful beach scene—ideal for guests seeking peace and tranquil scenery.',
    available: 4
  },
  {
    name: 'Couple\'s Retreat',
    price: 14504,
    image: '/couplesretreat.png',
    category: 'Romance',
    details: 'Designed for intimacy and comfort, the Couples Retreat boasts panoramic city views, a spacious work area, and elegant lounge chairs for relaxation. Luxurious decor and amenities set the perfect ambiance for a romantic getaway.',
    available: 2
  },
  {
    name: 'Family Room',
    price: 18424,
    image: '/family room.png',
    category: 'Family',
    details: 'Spacious and thoughtfully arranged, the Family Room is ideal for families or small groups. It offers two double beds, generous seating, and soft lighting in a warm, inviting atmosphere, making it perfect for relaxing after a busy day of sightseeing.',
    available: 6
  },
];

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

  console.log('Room data:', room); // Debug log

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

const Dashboard = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [activeFilter, setActiveFilter] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRoom, setSelectedRoom] = useState(null);

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
      navigate('/login');
    }
  };

  const handleCloseModal = () => {
    setSelectedRoom(null);
  };

  const handleBookNow = () => {
    // Navigate to payment method page with room data
    navigate('/payment-method', { state: { room: selectedRoom, action: 'book' } });
  };

  const handleReserveRoom = () => {
    // Navigate to payment method page for reservation
    navigate('/payment-method', { state: { room: selectedRoom, action: 'reserve' } });
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
      if (activeFilter === 'Couple') {
        return room.category === 'Romance';
      }
      if (activeFilter === 'Seaside') {
        return room.category === 'Beach';
      }
      return false;
    };

    const matchesSearch = room.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          room.details.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          room.category.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesFilter() && matchesSearch;
  });

  return (
    <div className="dashboard">
      <Header />
      <div className="dashboard-body">
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
          <button className={activeFilter === 'Couple' ? 'filter-btn active' : 'filter-btn'} onClick={() => handleFilterClick('Couple')}>Couple</button>
          <button className={activeFilter === 'Seaside' ? 'filter-btn active' : 'filter-btn'} onClick={() => handleFilterClick('Seaside')}>Seaside</button>
        </div>
        <h2 className="featured-title">Featured Rooms</h2>
        <br></br>
        <br></br>
        <div className="rooms-grid">
          {filteredRooms.map((room) => (
            <RoomCard key={room.name} room={room} onViewDetails={handleViewDetails} />
          ))}
        </div>
      </div>
      {selectedRoom && (
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

export default Dashboard;
