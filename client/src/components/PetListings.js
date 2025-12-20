import React, { useState, useEffect, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaSearch, FaThLarge, FaList, FaSpinner, FaPaw, FaTimes } from 'react-icons/fa';
import { AuthContext } from '../contexts/AuthContext';
import API from '../services/api'; // centralized API instance
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './PetListings.css';

const PetListings = () => {
  const [pets, setPets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    species: '',
    breed: '',
    age: '',
    gender: '',
    location: '',
    size: ''
  });
  const [viewMode, setViewMode] = useState('grid');
  const [searchQuery, setSearchQuery] = useState('');
  
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  // Fetch pets from backend
  const fetchPets = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await API.get('/pets?status=Available', {
        headers: {
          'Cache-Control': 'no-cache',
          'Pragma': 'no-cache',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (response.data && response.data.success) {
        setPets(response.data.data || []);
      } else {
        throw new Error(response.data?.message || 'Failed to load pets');
      }
    } catch (err) {
      console.error('Error fetching pets:', err);
      const errorMsg = err.response?.data?.message || err.message || 'Failed to load pets';
      setError(errorMsg);
      toast.error(errorMsg);
      setPets([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPets();
  }, []);

  const handleViewDetails = (petId) => {
    navigate(`/pet/${petId}`);
  };

  // Filter pets based on search and selected filters
  const filteredPets = Array.isArray(pets) ? pets.filter(pet => {
    if (!pet) return false;

    const searchTerm = searchQuery.toLowerCase().trim();
    const matchesSearch = !searchTerm || 
      (pet.name && pet.name.toLowerCase().includes(searchTerm)) ||
      (pet.description && pet.description.toLowerCase().includes(searchTerm)) ||
      (pet.breed && pet.breed.toLowerCase().includes(searchTerm)) ||
      (pet.species && pet.species.toLowerCase().includes(searchTerm)) ||
      (pet.location && pet.location.toLowerCase().includes(searchTerm));

    const matchesFilters = 
      (!filters.species || pet.species === filters.species) &&
      (!filters.breed || (pet.breed && pet.breed.toLowerCase().includes(filters.breed.toLowerCase()))) &&
      (!filters.age || (pet.age && pet.age.toString().includes(filters.age))) &&
      (!filters.gender || pet.gender === filters.gender) &&
      (!filters.location || (pet.location && pet.location.toLowerCase().includes(filters.location.toLowerCase()))) &&
      (!filters.size || pet.size === filters.size);

    return matchesSearch && matchesFilters;
  }) : [];

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '3rem' }}>
        <FaSpinner className="spinner" style={{ fontSize: '2rem', animation: 'spin 1s linear infinite', marginBottom: '1rem' }} />
        <p>Loading pets...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ textAlign: 'center', padding: '3rem', color: '#dc3545' }}>
        <h3>Error loading pets</h3>
        <p>{error}</p>
        <button 
          onClick={() => window.location.reload()}
          style={{ background: '#007bff', color: 'white', border: 'none', padding: '0.5rem 1rem', borderRadius: '5px', cursor: 'pointer', marginTop: '1rem' }}
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="pet-listings-container">
      <div className="hero-section">
        <h1>Find Your Perfect Companion</h1>
        <p>Discover loving pets waiting for their forever homes</p>
      </div>

      {/* Search & View Toggle */}
      <div className="search-filter-section">
        <div className="search-container">
          <FaSearch className="search-icon" />
          <input
            type="text"
            placeholder="Search pets by name, breed, species, location, or description..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-input"
          />
          {searchQuery && (
            <button onClick={() => setSearchQuery('')} className="clear-search-btn" title="Clear search">
              <FaTimes />
            </button>
          )}
        </div>
        
        <div className="view-toggle">
          <button onClick={() => setViewMode('grid')} className={`view-btn ${viewMode === 'grid' ? 'active' : ''}`}><FaThLarge /> Grid</button>
          <button onClick={() => setViewMode('list')} className={`view-btn ${viewMode === 'list' ? 'active' : ''}`}><FaList /> List</button>
        </div>
      </div>

      {/* Search Results Info */}
      {searchQuery && (
        <div style={{ background: '#f8f9fa', padding: '1rem 1.5rem', borderRadius: '10px', marginBottom: '1.5rem', border: '1px solid #e9ecef' }}>
          <p style={{ margin: 0, color: '#495057' }}>
            <strong>{filteredPets.length}</strong> pet{filteredPets.length !== 1 ? 's' : ''} found for "{searchQuery}"
            {filteredPets.length > 0 && <button onClick={() => setSearchQuery('')} style={{ background: 'none', border: 'none', color: '#007bff', cursor: 'pointer', marginLeft: '1rem', textDecoration: 'underline' }}>Clear search</button>}
          </p>
        </div>
      )}

      {/* Pet Listings */}
      {filteredPets.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '3rem', background: 'white', borderRadius: '10px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
          <h3>No pets found matching your criteria</h3>
          <p style={{ color: '#6c757d', margin: '1rem 0' }}>Try adjusting your search or filters</p>
          {user && user.role === 'petOwner' && (
            <Link to="/owner/dashboard" style={{ display: 'inline-block', background: '#28a745', color: 'white', padding: '0.75rem 1.5rem', borderRadius: '5px', textDecoration: 'none', marginTop: '1rem', fontWeight: '500' }}>
              Go to Dashboard to Add Pets
            </Link>
          )}
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: viewMode === 'grid' ? 'repeat(auto-fill, minmax(300px, 1fr))' : '1fr', gap: '1.5rem' }}>
          {filteredPets.map(pet => (
            <div key={pet._id} style={{ background: 'white', borderRadius: '10px', overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.1)', display: 'flex', flexDirection: viewMode === 'list' ? 'row' : 'column', height: '100%' }}>
              <div style={{ width: viewMode === 'list' ? '300px' : '100%', height: viewMode === 'list' ? '250px' : '200px', overflow: 'hidden' }}>
                <img src={pet.imageUrl || 'https://via.placeholder.com/400x300?text=No+Image+Available'} alt={pet.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} onError={(e) => { e.target.src = 'https://via.placeholder.com/400x300?text=Image+Not+Available'; }} />
              </div>
              <div style={{ padding: '1.5rem', flex: 1, display: 'flex', flexDirection: 'column' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                  <h3 style={{ fontSize: '1.25rem', margin: 0, color: '#343a40' }}>{pet.name} {pet.gender === 'Male' ? '♂' : '♀'}</h3>
                  <span style={{ background: '#e9ecef', color: '#495057', padding: '0.25rem 0.75rem', borderRadius: '50px', fontSize: '0.85rem' }}>{pet.breed || 'Mixed'}</span>
                </div>
                <p style={{ color: '#6c757d', margin: '0.5rem 0', fontSize: '0.9rem' }}>{pet.age} • {pet.size} • {pet.location}</p>
                <p style={{ color: '#6c757d', margin: '1rem 0', fontSize: '0.95rem' }}>{pet.description?.substring(0, 100)}{pet.description?.length > 100 ? '...' : ''}</p>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto', gap: '0.5rem' }}>
                  <button onClick={() => handleViewDetails(pet._id)} style={{ background: '#007bff', color: 'white', padding: '0.75rem 1rem', borderRadius: '5px', border: 'none', cursor: 'pointer', fontSize: '0.95rem', display: 'flex', alignItems: 'center', gap: '0.5rem', flex: 1 }}>View Details</button>
                  {pet.status === 'Available' && (
                    <button onClick={() => navigate(`/adopt/${pet._id}`)} style={{ background: '#28a745', color: 'white', padding: '0.75rem 1rem', borderRadius: '5px', border: 'none', cursor: 'pointer', fontSize: '0.95rem', display: 'flex', alignItems: 'center', gap: '0.5rem', flex: 1, justifyContent: 'center' }}><FaPaw /> Adopt</button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PetListings;
