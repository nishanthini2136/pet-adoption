import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { petImages } from '../images';
import LiveChat from './LiveChat';
import './HomePage.css';

const HomePage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [location, setLocation] = useState('');
  const [breed, setBreed] = useState('');
  const [age, setAge] = useState('');
  const [showChat, setShowChat] = useState(false);

  const featuredPets = [];

  const handleSearch = (e) => {
    e.preventDefault();
    // TODO: Implement search functionality
    console.log('Search:', { searchQuery, location, breed, age });
  };

  return (
    <div>
      {/* Hero Section */}
      <section className="hero" aria-label="Welcome hero">
        <div className="hero-content">
          <h1>Find Your New Best Friend</h1>
          <p>Give a loving home to pets in need. Browse thousands of adoptable pets and find your perfect companion.</p>
          <div>
            <Link to="/contact" className="btn btn-secondary">Learn More</Link>
          </div>
        </div>
      </section>

      {/* Search Section */}
      <section className="search-section">
        <div className="search-container">
          <h2>Find Your Perfect Pet</h2>
          <p>Search by location, breed, age, and more to find your ideal companion.</p>
          
          <form onSubmit={handleSearch} className="search-box">
            <input
              type="text"
              placeholder="Search pets..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="search-input"
            />
            <input
              type="text"
              placeholder="Location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="search-input"
            />
            <select
              value={breed}
              onChange={(e) => setBreed(e.target.value)}
              className="search-input"
            >
              <option value="">All Breeds</option>
              <option value="dog">Dogs</option>
              <option value="cat">Cats</option>
              <option value="rabbit">Rabbits</option>
              <option value="bird">Birds</option>
            </select>
            <select
              value={age}
              onChange={(e) => setAge(e.target.value)}
              className="search-input"
            >
              <option value="">All Ages</option>
              <option value="puppy">Puppy/Kitten</option>
              <option value="adult">Adult</option>
              <option value="senior">Senior</option>
            </select>
            <button type="submit" className="btn">Search</button>
          </form>
        </div>
      </section>

      {/* Quick Links */}
      <section className="quick-links">
        <h2 className="section-title">Quick Actions</h2>
        <div className="links-grid">
          <div className="link-card">
            <div className="link-icon"></div>
            <h3>Donate</h3>
            <p>Support our mission to help pets find loving homes.</p>
            <Link to="/donate" className="btn">Donate Now</Link>
          </div>

          <div className="link-card">
            <div className="link-icon"></div>
            <h3>Register a Pet</h3>
            <p>Have a pet to surrender? Register them with us.</p>
            <Link to="/register-pet" className="btn">Register Pet</Link>
          </div>

          <div className="link-card">
            <div className="link-icon"></div>
            <h3>Contact Us</h3>
            <p>Get in touch with our team for support and questions.</p>
            <Link to="/contact" className="btn">Contact</Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="footer-content">
          <h3>🐾 PetAdopt</h3>
          <p>Connecting loving homes with pets in need since 2024</p>
          <p>&copy; 2024 PetAdopt. All rights reserved.</p>
        </div>
      </footer>

      {/* Live Chat Widget */}
      <div className="chat-widget">
        <button 
          className="chat-toggle"
          onClick={() => setShowChat(!showChat)}
        >
          💬 Live Chat
        </button>
        {showChat && <LiveChat onClose={() => setShowChat(false)} />}
      </div>
    </div>
  );
};

export default HomePage;