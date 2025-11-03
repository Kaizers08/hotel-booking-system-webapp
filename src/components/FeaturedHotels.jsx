import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './FeaturedHotels.css';

const hotels = [
  {
    name: 'Family Room',
    price: 18424,
    image: '/family room.png',
    tier: 'Silver Tier',
  },
  {
    name: 'Seaside View',
    price: 19544,
    image: '/seasideview.png',
    tier: 'Gold Tier',
  },
  {
    name: 'Couple\'s Retreat',
    price: 14504,
    image: '/couplesretreat.png',
    tier: 'Silver Tier',
  },
  {
    name: 'Silver Tier Room',
    price: 11144,
    image: '/silvertieroom.png',
    tier: 'Silver Tier',
  },
  {
    name: 'Gold Tier Room',
    price: 22344,
    image: '/goldtierroom.png',
    tier: 'Gold Tier',
  },
  {
    name: 'The Penthouse',
    price: 33544,
    image: '/thepenthouse.png',
    tier: 'Penthouse',
  },
];

const HotelCard = ({ hotel }) => (
  <div className="hotel-card">
    <img src={hotel.image} alt={hotel.name} className="hotel-image" />
    <div className="hotel-info">
      <h3>{hotel.name}</h3>
      <p><span className="price">₱{hotel.price.toLocaleString()}</span> per night</p>
      <Link to="/login" className="details-button">View Details</Link>
    </div>
  </div>
);

const FeaturedHotels = () => {
  const [activeFilter, setActiveFilter] = useState('All');

  const handleFilterClick = (filter) => {
    setActiveFilter(filter);
  };

  const filteredHotels = hotels.filter((hotel) => {
    if (activeFilter === 'All') {
      return true;
    }
    if (activeFilter === 'Silver Tier') {
      return hotel.tier === 'Silver Tier';
    }
    if (activeFilter === 'Gold Tier') {
      return hotel.tier === 'Gold Tier';
    }
    if (activeFilter === 'Penthouse') {
      return hotel.tier === 'Penthouse';
    }
    if (activeFilter === 'Romance') {
      return hotel.name === 'Couple\'s Retreat';
    }
    if (activeFilter === 'Seaside') {
      return hotel.name === 'Seaside View';
    }
    if (activeFilter === 'Family') {
      return hotel.name === 'Family Room';
    }
    return false;
  });

  return (
    <section className="featured-hotels-section">
      <h2>Find Your Perfect Stay</h2>

      {/* Filter Buttons */}
      <div className="filter-buttons">
        <button className={`filter-btn ${activeFilter === 'All' ? 'active' : ''}`} onClick={() => handleFilterClick('All')}>All</button>
        <button className={`filter-btn ${activeFilter === 'Silver Tier' ? 'active' : ''}`} onClick={() => handleFilterClick('Silver Tier')}>Silver Tier</button>
        <button className={`filter-btn ${activeFilter === 'Gold Tier' ? 'active' : ''}`} onClick={() => handleFilterClick('Gold Tier')}>Gold Tier</button>
        <button className={`filter-btn ${activeFilter === 'Penthouse' ? 'active' : ''}`} onClick={() => handleFilterClick('Penthouse')}>Penthouse</button>
        <button className={`filter-btn ${activeFilter === 'Romance' ? 'active' : ''}`} onClick={() => handleFilterClick('Romance')}>Romance</button>
        <button className={`filter-btn ${activeFilter === 'Seaside' ? 'active' : ''}`} onClick={() => handleFilterClick('Seaside')}>Seaside</button>
        <button className={`filter-btn ${activeFilter === 'Family' ? 'active' : ''}`} onClick={() => handleFilterClick('Family')}>Family</button>
      </div>
      <h2>Featured Hotels</h2>
      <br></br>
      <br></br>
      <br />
      <br></br>
      <div className="hotel-grid">
        {filteredHotels.map((hotel) => (
          <HotelCard key={hotel.name} hotel={hotel} />
        ))}
      </div>
    </section>
  );
};

export default FeaturedHotels;
