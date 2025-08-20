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

  const featuredPets = [
    {
      id: 1,
      name: 'Buddy',
      type: 'Dog',
      breed: 'Golden Retriever',
      age: '2 years',
      location: 'New York',
      image: petImages.dogs.goldenRetriever.main,
      description: 'Friendly and energetic Golden Retriever looking for an active family.'
    },
    {
      id: 2,
      name: 'Whiskers',
      type: 'Cat',
      breed: 'Persian',
      age: '1 year',
      location: 'Los Angeles',
      image: petImages.cats.persian.main,
      description: 'Calm and affectionate Persian cat perfect for a quiet home.'
    },
    {
      id: 3,
      name: 'Hopper',
      type: 'Rabbit',
      breed: 'Holland Lop',
      age: '6 months',
      location: 'Chicago',
      image: petImages.rabbits.hollandLop.main,
      description: 'Adorable Holland Lop bunny ready to hop into your heart.'
    }
  ];

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
            <Link to="/pets" className="btn">Browse Pets</Link>
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

      {/* Featured Pets */}
      <section className="featured-section">
        <h2 className="section-title">Featured Pets</h2>
        <div className="pets-grid">
          {featuredPets.map(pet => (
            <div key={pet.id} className="pet-card">
              <img src={pet.image} alt={pet.name} className="pet-image" />
              <div className="pet-info">
                <h3 className="pet-name">{pet.name}</h3>
                <p className="pet-details">
                  {pet.type} • {pet.breed} • {pet.age} • {pet.location}
                </p>
                <p className="pet-description">{pet.description}</p>
                <Link to={`/pet/${pet.id}`} className="btn">View More</Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Quick Links */}
      <section className="quick-links">
        <h2 className="section-title">Quick Actions</h2>
        <div className="links-grid">
          <div className="link-card">
            <div className="link-icon"></div>
            <h3>Adopt a Pet</h3>
            <p>Browse our available pets and find your perfect companion.</p>
            <Link to="/pets" className="btn">Browse Pets</Link>
          </div>
          
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