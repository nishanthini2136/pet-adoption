import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { petImages } from '../images';
import './PetListings.css';
import { FaSearch, FaThLarge, FaList } from 'react-icons/fa';

const PetListings = () => {
  // Mock pets data (will be replaced with API call)
  const pets = [
    {
      id: 1,
      name: 'Leo',
      species: 'Dog',
      breed: 'Golden Retriever',
      age: 'Puppyhood',
      gender: 'Male',
      location: 'Noida, Uttar Pradesh',
      size: 'Large',
      image: petImages.dogs.goldenRetriever.main,
      description: 'Friendly and energetic Golden Retriever looking for an active family.',
      owner: {
        name: 'Ramya Singh',
        phone: '+91 98765 43210',
        icon: '👤'
      }
    },
    {
      id: 2,
      name: 'Milo',
      species: 'Cat',
      breed: 'Persian',
      age: '1 year',
      gender: 'Female',
      location: 'Mumbai, Maharashtra',
      size: 'Medium',
      image: petImages.cats.persian.main,
      description: 'Calm and affectionate Persian cat perfect for a quiet home.',
      owner: {
        name: 'Priya Sharma',
        phone: '+91 87654 32109',
        icon: '👤'
      }
    },
    {
      id: 3,
      name: 'Bunny',
      species: 'Rabbit',
      breed: 'Holland Lop',
      age: '6 months',
      gender: 'Male',
      location: 'Delhi, NCR',
      size: 'Small',
      image: petImages.rabbits.hollandLop.main,
      description: 'Adorable Holland Lop bunny ready to hop into your heart.',
      owner: {
        name: 'Amit Patel',
        phone: '+91 76543 21098',
        icon: '👤'
      }
    },
    {
      id: 7,
      name: 'Hammy',
      species: 'Hamster',
      breed: 'Syrian',
      age: '8 months',
      gender: 'Male',
      location: 'Pune, Maharashtra',
      size: 'Small',
      image: petImages.hamsters.syrian.main,
      description: 'Active and friendly Syrian hamster that loves to explore and play.',
      owner: {
        name: 'Meera Desai',
        phone: '+91 87654 56789',
        icon: '👤'
      }
    },
    {
      id: 8,
      name: 'Goldie',
      species: 'Fish',
      breed: 'Goldfish',
      age: '2 years',
      gender: 'Female',
      location: 'Kolkata, West Bengal',
      size: 'Small',
      image: petImages.fish.goldfish.main,
      description: 'Beautiful goldfish that brings tranquility to any home aquarium.',
      owner: {
        name: 'Arjun Sen',
        phone: '+91 76543 98765',
        icon: '👤'
      }
    },
    {
      id: 9,
      name: 'Spike',
      species: 'Guinea Pig',
      breed: 'American',
      age: '1.5 years',
      gender: 'Male',
      location: 'Ahmedabad, Gujarat',
      size: 'Small',
      image: petImages.guineaPigs.american.main,
      description: 'Gentle and social guinea pig that loves cuddles and fresh vegetables.',
      owner: {
        name: 'Neha Patel',
        phone: '+91 65432 87654',
        icon: '👤'
      }
    },
    {
      id: 10,
      name: 'Luna',
      species: 'Dog',
      breed: 'German Shepherd',
      age: '2 years',
      gender: 'Female',
      location: 'Jaipur, Rajasthan',
      size: 'Large',
      image: petImages.dogs.germanShepherd.main,
      description: 'Intelligent and loyal German Shepherd, great for active families.',
      owner: {
        name: 'Rajesh Sharma',
        phone: '+91 54321 76543',
        icon: '👤'
      }
    },
    {
      id: 11,
      name: 'Whiskers',
      species: 'Cat',
      breed: 'Maine Coon',
      age: '3 years',
      gender: 'Male',
      location: 'Lucknow, Uttar Pradesh',
      size: 'Large',
      image: petImages.cats.maineCoon.main,
      description: 'Majestic Maine Coon with a gentle giant personality.',
      owner: {
        name: 'Anjali Verma',
        phone: '+91 43210 65432',
        icon: '👤'
      }
    },
    {
      id: 12,
      name: 'Coco',
      species: 'Bird',
      breed: 'Cockatiel',
      age: '2 years',
      gender: 'Male',
      location: 'Indore, Madhya Pradesh',
      size: 'Small',
      image: petImages.birds.cockatiel.main,
      description: 'Playful cockatiel that loves to whistle and dance.',
      owner: {
        name: 'Vikram Singh',
        phone: '+91 32109 54321',
        icon: '👤'
      }
    }
  ];

  const [filters, setFilters] = useState({
    species: '',
    breed: '',
    age: '',
    gender: '',
    location: '',
    size: ''
  });
  const [sortBy, setSortBy] = useState('newest');
  const [viewMode, setViewMode] = useState('grid');
  const [searchQuery, setSearchQuery] = useState('');

  // Get unique values for filter options
  const getUniqueValues = (field) => {
    return [...new Set(pets.map(pet => pet[field]))].sort();
  };

  const speciesOptions = getUniqueValues('species');
  const breedOptions = getUniqueValues('breed');
  const ageOptions = getUniqueValues('age');
  const locationOptions = getUniqueValues('location');
  const sizeOptions = getUniqueValues('size');

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  const toggleViewMode = (mode) => {
    setViewMode(mode);
  };

  // Additional handlers and UI components

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleShare = (platform, petName) => {
    const shareText = `Check out ${petName} - a lovely pet available for adoption! 🐾`;
    const shareUrl = window.location.href;
    
    let shareLink = '';
    switch (platform) {
      case 'facebook':
        shareLink = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}&quote=${encodeURIComponent(shareText)}`;
        break;
      case 'linkedin':
        shareLink = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`;
        break;
      case 'pinterest':
        shareLink = `https://pinterest.com/pin/create/button/?url=${encodeURIComponent(shareUrl)}&description=${encodeURIComponent(shareText)}`;
        break;
      case 'twitter':
        shareLink = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`;
        break;
      default:
        return;
    }
    
    window.open(shareLink, '_blank', 'width=600,height=400');
  };

  const handleContact = (phone) => {
    window.open(`tel:${phone}`, '_self');
  };

  // Update the existing filteredPets declaration to include both search and filter logic
  const filteredPets = pets.filter(pet => {
    const matchesSearch = !searchQuery || 
      pet.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      pet.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesFilters = 
      (!filters.species || pet.species === filters.species) &&
      (!filters.breed || pet.breed.includes(filters.breed)) &&
      (!filters.age || pet.age.includes(filters.age)) &&
      (!filters.gender || pet.gender === filters.gender) &&
      (!filters.location || pet.location.includes(filters.location)) &&
      (!filters.size || pet.size === filters.size);

    return matchesSearch && matchesFilters;
  });

  return (
    <div className="pet-listings">
      <div className="controls-container">
        <div className="search-bar">
          <FaSearch />
          <input
            type="text"
            placeholder="Search pets..."
            value={searchQuery}
            onChange={handleSearch}
          />
        </div>
        <div className="view-toggle">
          <button
            className={viewMode === 'grid' ? 'active' : ''}
            onClick={() => toggleViewMode('grid')}
            aria-label="Grid view"
          >
            <FaThLarge />
          </button>
          <button
            className={viewMode === 'list' ? 'active' : ''}
            onClick={() => toggleViewMode('list')}
            aria-label="List view"
          >
            <FaList />
          </button>
        </div>
      </div>

      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem' }}>
        <h1 style={{ textAlign: 'center', marginBottom: '2rem' }}>Browse Adoptable Pets</h1>

        {/* Filters */}
        <div style={{ 
          background: 'white', 
          padding: '2rem', 
          borderRadius: '15px', 
          marginBottom: '2rem',
          boxShadow: '0 5px 15px rgba(0,0,0,0.1)'
        }}>
          <h3 style={{ marginBottom: '1rem' }}>Filters</h3>
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
            gap: '1rem' 
          }}>
            <select
              value={filters.species}
              onChange={(e) => handleFilterChange('species', e.target.value)}
              style={{ padding: '10px', borderRadius: '5px', border: '1px solid #ddd' }}
            >
              <option value="">All Species</option>
              <option value="Dog">Dogs</option>
              <option value="Cat">Cats</option>
              <option value="Rabbit">Rabbits</option>
              <option value="Bird">Birds</option>
              <option value="Hamster">Hamsters</option>
              <option value="Fish">Fish</option>
              <option value="Guinea Pig">Guinea Pigs</option>
            </select>

            <select
              value={filters.age}
              onChange={(e) => handleFilterChange('age', e.target.value)}
              style={{ padding: '10px', borderRadius: '5px', border: '1px solid #ddd' }}
            >
              <option value="">All Ages</option>
              <option value="puppy">Puppy/Kitten</option>
              <option value="adult">Adult</option>
              <option value="senior">Senior</option>
            </select>

            <select
              value={filters.gender}
              onChange={(e) => handleFilterChange('gender', e.target.value)}
              style={{ padding: '10px', borderRadius: '5px', border: '1px solid #ddd' }}
            >
              <option value="">All Genders</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
            </select>

            <select
              value={filters.size}
              onChange={(e) => handleFilterChange('size', e.target.value)}
              style={{ padding: '10px', borderRadius: '5px', border: '1px solid #ddd' }}
            >
              <option value="">All Sizes</option>
              <option value="Small">Small</option>
              <option value="Medium">Medium</option>
              <option value="Large">Large</option>
            </select>

            <input
              type="text"
              placeholder="Location"
              value={filters.location}
              onChange={(e) => handleFilterChange('location', e.target.value)}
              style={{ padding: '10px', borderRadius: '5px', border: '1px solid #ddd' }}
            />

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              style={{ padding: '10px', borderRadius: '5px', border: '1px solid #ddd' }}
            >
              <option value="newest">Newest</option>
              <option value="nearest">Nearest</option>
              <option value="oldest">Oldest</option>
            </select>
          </div>
        </div>

        {/* Pets Grid/List View */}
        <div className={viewMode === 'grid' ? 'pets-grid' : 'pets-list'}>
          {filteredPets.map(pet => (
            <div key={pet.id} className={viewMode === 'grid' ? 'pet-card' : 'pet-list-item'} style={{ 
              background: 'white', 
              borderRadius: '15px', 
              overflow: 'hidden',
              boxShadow: '0 5px 15px rgba(0,0,0,0.1)',
              transition: 'transform 0.3s ease',
              display: viewMode === 'list' ? 'flex' : 'block'
            }}>
              <img 
                src={pet.image} 
                alt={pet.name} 
                className="pet-image" 
                style={{ width: '100%', height: '250px', objectFit: 'cover' }}
                onError={(e) => {
                  console.error(`Failed to load image for ${pet.name}:`, pet.image);
                  // Fallback to a default pet image
                  e.target.src = 'https://images.unsplash.com/photo-1552053831-71594a27632d?w=400&h=300&fit=crop';
                }}
              />
              <div className="pet-info" style={{ padding: '1.5rem' }}>
                {/* Pet Basic Info */}
                <div style={{ marginBottom: '1rem' }}>
                  <h3 className="pet-name" style={{ fontSize: '1.5rem', marginBottom: '0.5rem', color: '#333' }}>
                    {pet.name} {pet.gender === 'Male' ? '♂' : '♀'}
                  </h3>
                  <p style={{ color: '#666', fontSize: '0.9rem', marginBottom: '0.5rem' }}>
                    {pet.age} • {pet.location}
                  </p>
                  <p style={{ color: '#888', fontSize: '0.85rem', marginBottom: '1rem' }}>
                    {pet.species} • {pet.breed} • {pet.size}
                  </p>
                </div>

                {/* Pet Description */}
                <p className="pet-description" style={{ 
                  color: '#555', 
                  fontSize: '0.9rem', 
                  lineHeight: '1.5',
                  marginBottom: '1.5rem'
                }}>
                  {pet.description}
                </p>

                {/* Contact Details */}
                <div style={{ 
                  background: '#f8f9fa', 
                  padding: '1rem', 
                  borderRadius: '10px',
                  marginBottom: '1.5rem'
                }}>
                  <h4 style={{ fontSize: '1rem', marginBottom: '0.5rem', color: '#333' }}>
                    Contact Details
                  </h4>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                    <span style={{ fontSize: '1.2rem' }}>{pet.owner.icon}</span>
                    <span style={{ color: '#555', fontSize: '0.9rem' }}>
                      Name: {pet.owner.name}
                    </span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                    <span style={{ fontSize: '1.2rem' }}>📞</span>
                    <span style={{ color: '#555', fontSize: '0.9rem' }}>
                      Number: {pet.owner.phone}
                    </span>
                  </div>
                  <button 
                    onClick={() => handleContact(pet.owner.phone)}
                    style={{
                      background: '#007bff',
                      color: 'white',
                      border: 'none',
                      padding: '0.5rem 1rem',
                      borderRadius: '5px',
                      cursor: 'pointer',
                      fontSize: '0.85rem',
                      fontWeight: '500'
                    }}
                  >
                    Contact Now
                  </button>
                </div>

                {/* Share with Friends */}
                <div style={{ marginBottom: '1.5rem' }}>
                  <h4 style={{ fontSize: '1rem', marginBottom: '0.5rem', color: '#333' }}>
                    Share with Friends
                  </h4>
                  <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                    <button 
                      onClick={() => handleShare('facebook', pet.name)}
                      style={{
                        background: '#1877f2',
                        color: 'white',
                        border: 'none',
                        padding: '0.4rem 0.8rem',
                        borderRadius: '5px',
                        cursor: 'pointer',
                        fontSize: '0.8rem'
                      }}
                    >
                      Facebook
                    </button>
                    <button 
                      onClick={() => handleShare('linkedin', pet.name)}
                      style={{
                        background: '#0077b5',
                        color: 'white',
                        border: 'none',
                        padding: '0.4rem 0.8rem',
                        borderRadius: '5px',
                        cursor: 'pointer',
                        fontSize: '0.8rem'
                      }}
                    >
                      LinkedIn
                    </button>
                    <button 
                      onClick={() => handleShare('pinterest', pet.name)}
                      style={{
                        background: '#e60023',
                        color: 'white',
                        border: 'none',
                        padding: '0.4rem 0.8rem',
                        borderRadius: '5px',
                        cursor: 'pointer',
                        fontSize: '0.8rem'
                      }}
                    >
                      Pinterest
                    </button>
                    <button 
                      onClick={() => handleShare('twitter', pet.name)}
                      style={{
                        background: '#1da1f2',
                        color: 'white',
                        border: 'none',
                        padding: '0.4rem 0.8rem',
                        borderRadius: '5px',
                        cursor: 'pointer',
                        fontSize: '0.8rem'
                      }}
                    >
                      Twitter
                    </button>
                  </div>
                </div>

                {/* Action Buttons */}
                <div style={{ display: 'flex', gap: '1rem' }}>
                  <Link to={`/pet/${pet.id}`} className="btn" style={{ flex: 1, textAlign: 'center' }}>
                    View More
                  </Link>
                  <Link to={`/adopt/${pet.id}`} className="btn" style={{ 
                    flex: 1, 
                    textAlign: 'center',
                    background: '#28a745' 
                  }} onClick={(e) => {
                    // Prevent default behavior to handle navigation manually
                    e.preventDefault();
                    // Navigate to the adoption form with the pet ID
                    window.location.href = `/adopt/${pet.id}`;
                  }}>
                    Adopt Now
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredPets.length === 0 && (
          <div style={{ textAlign: 'center', padding: '3rem' }}>
            <h3>No pets found matching your criteria</h3>
            <p>Try adjusting your filters to see more pets.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PetListings;