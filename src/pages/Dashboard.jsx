import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/header';
import './Dashboard.css';

const rooms = [
  {
    name: 'Silver Tier Room',
    price: 299,
    image: '/silvertieroom.png',
    category: 'Silver Tier',
    details: 'Affordable comfort with essential amenities.'
  },
  {
    name: 'Gold Tier Room',
    price: 399,
    image: '/goldtierroom.png',
    category: 'Gold Tier',
    details: 'Premium experience with luxury bedding and views.'
  },
  {
    name: 'The Penthouse',
    price: 599,
    image: '/thepenthouse.png',
    category: 'Penthouse',
    details: 'Exclusive penthouse suite with panoramic views.'
  },
  {
    name: 'Seaside View Room',
    price: 349,
    image: '/seasideview.png',
    category: 'Beach',
    details: 'Enjoy breathtaking ocean views with direct beach access.'
  },
  {
    name: 'Couple\'s Retreat',
    price: 259,
    image: '/couplesretreat.png',
    category: 'Romance',
    details: 'Romantic getaway with intimate amenities.'
  },
  {
    name: 'Family Room',
    price: 329,
    image: '/family room.png',
    category: 'Family',
    details: 'Perfect for families with space for up to 4 guests.'
  },
];

const RoomCard = ({ room }) => (
  <div className="room-card">
    <img src={room.image} alt={room.name} className="room-image" />
    <div className="room-info">
      <h3>{room.name}</h3>
      <p><span className="price">${room.price}</span> per night</p>
      <Link to="/contact" className="details-button">View Details</Link>
    </div>
  </div>
);

const Dashboard = () => {
  const [activeFilter, setActiveFilter] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');

  const handleFilterClick = (filter) => {
    setActiveFilter(filter);
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
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
            <RoomCard key={room.name} room={room} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
