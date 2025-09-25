import React, { useState, useEffect, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaSearch, FaThLarge, FaList, FaEdit, FaTrash, FaSpinner, FaPaw } from 'react-icons/fa';
import { AuthContext } from '../contexts/AuthContext';
import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const API_URL = 'http://localhost:5000/api';

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

  // Function to fetch available pets
  const fetchPets = async () => {
    try {
      console.log('Fetching pets...');
      setLoading(true);
      setError(null);
      
      // Fetch only available pets for customers
      const response = await axios.get(`${API_URL}/pets?status=Available`, {
        headers: {
          'Cache-Control': 'no-cache',
          'Pragma': 'no-cache',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        withCredentials: true
      });
      
      console.log('Pets API Response:', response.data);
      
      if (response.data && response.data.success) {
        let petsData = response.data.data || [];
        console.log(`Received ${petsData.length} pets from API`);
        
        // Set only available pets for customers to browse
        setPets(petsData);
      } else {
        console.warn('Unexpected API response format:', response.data);
        throw new Error(response.data?.message || 'Failed to load pets');
      }
    } catch (err) {
      console.error('Error in fetchPets:', err);
      const errorMsg = err.response?.data?.message || 
                      err.message || 
                      'Failed to load pets. Please try again later.';
      console.error('Error details:', {
        message: err.message,
        response: err.response?.data,
        status: err.response?.status
      });
      setError(errorMsg);
      toast.error(errorMsg);
      setPets([]);
    } finally {
      setLoading(false);
    }
  };

  // Fetch pets when component mounts
  useEffect(() => {
    fetchPets();
  }, []);

  // Handle view pet details
  const handleViewDetails = (petId) => {
    navigate(`/pets/${petId}`);
  };

  // Filter pets based on search and filters
  const filteredPets = Array.isArray(pets) ? pets.filter(pet => {
    if (!pet) return false;
    
    const matchesSearch = !searchQuery || 
      (pet.name && pet.name.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (pet.description && pet.description.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesFilters = 
      (!filters.species || pet.species === filters.species) &&
      (!filters.breed || (pet.breed && pet.breed.includes(filters.breed))) &&
      (!filters.age || (pet.age && pet.age.includes(filters.age))) &&
      (!filters.gender || pet.gender === filters.gender) &&
      (!filters.location || (pet.location && pet.location.includes(filters.location))) &&
      (!filters.size || pet.size === filters.size);

    return matchesSearch && matchesFilters;
  }) : [];

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '3rem' }}>
        <FaSpinner className="spinner" style={{ 
          fontSize: '2rem', 
          animation: 'spin 1s linear infinite',
          marginBottom: '1rem'
        }} />
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
          style={{
            background: '#007bff',
            color: 'white',
            border: 'none',
            padding: '0.5rem 1rem',
            borderRadius: '5px',
            cursor: 'pointer',
            marginTop: '1rem'
          }}
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem' }}>
      <h1 style={{ textAlign: 'center', marginBottom: '2rem' }}>Available Pets for Adoption</h1>
      
      {/* Search and View Toggle */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        marginBottom: '2rem',
        flexWrap: 'wrap',
        gap: '1rem'
      }}>
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          background: '#f8f9fa', 
          borderRadius: '5px',
          padding: '0.5rem 1rem',
          flex: '1 1 300px',
          maxWidth: '500px'
        }}>
          <FaSearch style={{ marginRight: '0.5rem', color: '#6c757d' }} />
          <input
            type="text"
            placeholder="Search pets by name or description..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              border: 'none',
              background: 'transparent',
              width: '100%',
              outline: 'none',
              fontSize: '1rem'
            }}
          />
        </div>
        
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button
            onClick={() => setViewMode('grid')}
            style={{
              background: viewMode === 'grid' ? '#007bff' : '#f8f9fa',
              color: viewMode === 'grid' ? 'white' : '#212529',
              border: '1px solid #dee2e6',
              padding: '0.5rem 1rem',
              borderRadius: '5px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}
          >
            <FaThLarge /> Grid
          </button>
          <button
            onClick={() => setViewMode('list')}
            style={{
              background: viewMode === 'list' ? '#007bff' : '#f8f9fa',
              color: viewMode === 'list' ? 'white' : '#212529',
              border: '1px solid #dee2e6',
              padding: '0.5rem 1rem',
              borderRadius: '5px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}
          >
            <FaList /> List
          </button>
        </div>
      </div>
      
      {/* Pet Listings */}
      {filteredPets.length === 0 ? (
        <div style={{ 
          textAlign: 'center', 
          padding: '3rem', 
          background: 'white', 
          borderRadius: '10px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
        }}>
          <h3>No pets found matching your criteria</h3>
          <p style={{ color: '#6c757d', margin: '1rem 0' }}>Try adjusting your search or filters</p>
          {user && user.role === 'petOwner' && (
            <Link 
              to="/owner/dashboard"
              style={{
                display: 'inline-block',
                background: '#28a745',
                color: 'white',
                padding: '0.75rem 1.5rem',
                borderRadius: '5px',
                textDecoration: 'none',
                marginTop: '1rem',
                fontWeight: '500'
              }}
            >
              Go to Dashboard to Add Pets
            </Link>
          )}
        </div>
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: viewMode === 'grid' ? 'repeat(auto-fill, minmax(300px, 1fr))' : '1fr',
          gap: '1.5rem'
        }}>
          {filteredPets.map(pet => (
            <div 
              key={pet._id}
              style={{
                background: 'white',
                borderRadius: '10px',
                overflow: 'hidden',
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                display: viewMode === 'list' ? 'flex' : 'block'
              }}
            >
              <div style={{
                width: viewMode === 'list' ? '300px' : '100%',
                height: viewMode === 'list' ? '250px' : '200px',
                overflow: 'hidden'
              }}>
                <img 
                  src={pet.imageUrl || 'https://via.placeholder.com/400x300?text=No+Image+Available'} 
                  alt={pet.name}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover'
                  }}
                  onError={(e) => {
                    e.target.src = 'https://via.placeholder.com/400x300?text=Image+Not+Available';
                  }}
                />
              </div>
              
              <div style={{ 
                padding: '1.5rem',
                flex: viewMode === 'list' ? 1 : 'none'
              }}>
                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between',
                  alignItems: 'flex-start',
                  marginBottom: '0.5rem'
                }}>
                  <h3 style={{ 
                    fontSize: '1.25rem', 
                    margin: '0', 
                    color: '#343a40'
                  }}>
                    {pet.name} {pet.gender === 'Male' ? '♂' : '♀'}
                  </h3>
                  <span style={{
                    background: '#e9ecef',
                    color: '#495057',
                    padding: '0.25rem 0.75rem',
                    borderRadius: '50px',
                    fontSize: '0.85rem'
                  }}>
                    {pet.breed || 'Mixed'}
                  </span>
                </div>
                
                <p style={{ 
                  color: '#6c757d', 
                  margin: '0.5rem 0',
                  fontSize: '0.9rem'
                }}>
                  {pet.age} • {pet.size} • {pet.location}
                </p>
                
                <p style={{ 
                  color: '#6c757d', 
                  margin: '1rem 0',
                  fontSize: '0.95rem'
                }}>
                  {pet.description?.substring(0, 100)}{pet.description?.length > 100 ? '...' : ''}
                </p>
                
                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginTop: '1.5rem',
                  gap: '0.5rem'
                }}>
                  <button 
                    onClick={() => handleViewDetails(pet._id)}
                    style={{
                      background: '#007bff',
                      color: 'white',
                      padding: '0.75rem 1rem',
                      borderRadius: '5px',
                      border: 'none',
                      cursor: 'pointer',
                      fontSize: '0.95rem',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      flex: '1'
                    }}
                  >
                    View Details
                  </button>
                  {pet.status === 'Available' && (
                    <button 
                      onClick={() => navigate(`/adopt/${pet._id}`)}
                      style={{
                        background: '#28a745',
                        color: 'white',
                        padding: '0.75rem 1rem',
                        borderRadius: '5px',
                        border: 'none',
                        cursor: 'pointer',
                        fontSize: '0.95rem',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        flex: '1',
                        justifyContent: 'center'
                      }}
                    >
                      <FaPaw /> Adopt
                    </button>
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