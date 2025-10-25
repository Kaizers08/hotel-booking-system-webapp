import React from 'react';
import './FeaturedHotels.css';

const hotels = [
  {
    name: 'Family Room',
    price: 299,
    image: '/family room.png',
  },
  {
    name: 'Seaside View',
    price: 349,
    image: '/seasideview.png',
  },
  {
    name: 'Couple\'s Retreat',
    price: 259,
    image: '/couplesretreat.png',
  },
  {
    name: 'Silver Tier Room',
    price: 199,
    image: '/silvertieroom.png',
  },
  {
    name: 'Gold Tier Room',
    price: 399,
    image: '/goldtierroom.png',
  },
  {
    name: 'The Penthouse',
    price: 599,
    image: '/thepenthouse.png',
  },
];

const HotelCard = ({ hotel }) => (
  <div className="hotel-card">
    <img src={hotel.image} alt={hotel.name} className="hotel-image" />
    <div className="hotel-info">
      <h3>{hotel.name}</h3>
      <p><span className="price">${hotel.price}</span> per night</p>
      <button className="details-button">View Details</button>
    </div>
  </div>
);

const FeaturedHotels = () => {
  return (
    <section className="featured-hotels-section">
      <h2>Find Your Perfect Stay</h2>
      <br></br>
      
      <div className="filter-buttons">
        <button className="filter-btn active">All</button>
        <button className="filter-btn">Silver Tier</button>
        <button className="filter-btn">Gold Tier</button>
        <button className="filter-btn">Penthouse</button>
        <button className="filter-btn">Couple</button>
        <button className="filter-btn">Seaside</button>
      </div>
      <br></br>
      <h2>Featured Hotels</h2>
      <br></br>
      <br></br>
      <div className="hotel-grid">
        {hotels.map((hotel) => (
          <HotelCard key={hotel.name} hotel={hotel} />
        ))}
      </div>
    </section>
  );
};

export default FeaturedHotels;