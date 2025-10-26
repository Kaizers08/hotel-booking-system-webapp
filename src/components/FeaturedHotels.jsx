import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './FeaturedHotels.css';

const hotels = [
  {
    name: 'Family Room',
    price: 299,
    image: '/family room.png',
    tier: 'Silver Tier',
  },
  {
    name: 'Seaside View',
    price: 349,
    image: '/seasideview.png',
    tier: 'Gold Tier',
  },
  {
    name: 'Couple\'s Retreat',
    price: 259,
    image: '/couplesretreat.png',
    tier: 'Silver Tier',
  },
  {
    name: 'Silver Tier Room',
    price: 199,
    image: '/silvertieroom.png',
    tier: 'Silver Tier',
  },
  {
    name: 'Gold Tier Room',
    price: 399,
    image: '/goldtierroom.png',
    tier: 'Gold Tier',
  },
  {
    name: 'The Penthouse',
    price: 599,
    image: '/thepenthouse.png',
    tier: 'Penthouse',
  },
];

const HotelCard = ({ hotel }) => (
  <div className="hotel-card">
    <img src={hotel.image} alt={hotel.name} className="hotel-image" />
    <div className="hotel-info">
      <h3>{hotel.name}</h3>
      <p><span className="price">${hotel.price}</span> per night</p>
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
      return hotel.name === 'Silver Tier Room';
    }
    if (activeFilter === 'Gold Tier') {
      return hotel.name === 'Gold Tier Room';
    }
    if (activeFilter === 'Penthouse') {
      return hotel.name === 'The Penthouse';
    }
    if (activeFilter === 'Couple\'s Retreat') {
      return hotel.name === 'Couple\'s Retreat';
    }
    if (activeFilter === 'Seaside View') {
      return hotel.name === 'Seaside View';
    }
    return false;
  });

  return (
    <section className="featured-hotels-section">
      <h2>Find Your Perfect Stay</h2>
      <div className="filter-buttons">
        <button className={`filter-btn ${activeFilter === 'All' ? 'active' : ''}`} onClick={() => handleFilterClick('All')}>All</button>
        <button className={`filter-btn ${activeFilter === 'Silver Tier' ? 'active' : ''}`} onClick={() => handleFilterClick('Silver Tier')}>Silver Tier</button>
        <button className={`filter-btn ${activeFilter === 'Gold Tier' ? 'active' : ''}`} onClick={() => handleFilterClick('Gold Tier')}>Gold Tier</button>
        <button className={`filter-btn ${activeFilter === 'Penthouse' ? 'active' : ''}`} onClick={() => handleFilterClick('Penthouse')}>Penthouse</button>
        <button className={`filter-btn ${activeFilter === 'Couple\'s Retreat' ? 'active' : ''}`} onClick={() => handleFilterClick('Couple\'s Retreat')}>Couple</button>
        <button className={`filter-btn ${activeFilter === 'Seaside View' ? 'active' : ''}`} onClick={() => handleFilterClick('Seaside View')}>Seaside</button>
      </div>
      <h2>Featured Hotels</h2>
      <br></br>
      <br></br>
      <br></br>
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
