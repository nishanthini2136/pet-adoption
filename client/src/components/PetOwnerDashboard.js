import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Link } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './PetOwnerDashboard.css';

const PetOwnerDashboard = () => {
  const { token, user } = useAuth();
  const [pets, setPets] = useState([]);
  const [statistics, setStatistics] = useState({
    totalPets: 0,
    availablePets: 0,
    adoptedPets: 0,
    pendingPets: 0,
    pendingRequests: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showAddPetForm, setShowAddPetForm] = useState(false);
  const [showEditPetForm, setShowEditPetForm] = useState(false);
  const [currentPet, setCurrentPet] = useState(null);
  const [petForm, setPetForm] = useState({
    name: '',
    species: '',
    breed: '',
    age: '',
    gender: '',
    size: '',
    description: '',
    location: '',
    image: '',
    status: 'Available'
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setPetForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const resetForm = () => {
    setPetForm({
      name: '',
      species: '',
      breed: '',
      age: '',
      gender: '',
      size: '',
      description: '',
      location: '',
      image: '',
      status: 'Available'
    });
    setCurrentPet(null);
  };

  const handleAddPet = async (e) => {
    e.preventDefault();
    
    // Form validation with detailed logging
    console.log('Current petForm data:', petForm);
    
    const requiredFields = ['name', 'species', 'image', 'breed', 'age', 'gender', 'size', 'description', 'location'];
    const missingFields = requiredFields.filter(field => {
      const value = petForm[field];
      const isEmpty = !value || (typeof value === 'string' && value.trim() === '');
      if (isEmpty) {
        console.log(`Missing field: ${field}, value:`, value);
      }
      return isEmpty;
    });
    
    if (missingFields.length > 0) {
      const errorMsg = `Please fill in all required fields: ${missingFields.join(', ')}`;
      console.error('Validation failed:', errorMsg);
      setError(errorMsg);
      toast.error(errorMsg);
      return;
    }
    
    console.log('Validation passed, all required fields present');
    
    try {
      setLoading(true);
      setError(''); // Clear previous errors
      
      const petData = {
        name: petForm.name.trim(),
        species: petForm.species.trim(),
        breed: petForm.breed.trim(),
        age: petForm.age.trim(), // Keep as string since server expects string
        gender: petForm.gender,
        size: petForm.size,
        description: petForm.description.trim(),
        location: petForm.location.trim(),
        imageUrl: petForm.image.trim()
      };
      
      console.log('Preparing to send pet data:', petData);
      
      const response = await fetch('http://localhost:5000/api/pets', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        credentials: 'include',
        body: JSON.stringify(petData)
      });

      const data = await response.json();
      console.log('Add pet response:', { status: response.status, data });
      
      if (!response.ok) {
        const errorMsg = data.message || `Failed to add pet (Status: ${response.status})`;
        console.error('Server error:', errorMsg);
        throw new Error(errorMsg);
      }
      
      // If we get here, the pet was added successfully
      console.log('✅ Pet added successfully to database:', data.data);
      
      // Immediately add the new pet to local state for instant UI update
      const newPet = data.data;
      setPets(prevPets => [newPet, ...prevPets]); // Add to beginning of array
      
      // Close the form and reset it
      setShowAddPetForm(false);
      resetForm();
      setError('');
      
      // Show detailed success message
      toast.success(`🎉 "${petData.name}" has been added to your pets and is now visible to customers!`, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      
    } catch (err) {
      console.error('Error adding pet:', err);
      const errorMsg = err.message || 'Failed to add pet. Please try again.';
      setError(errorMsg);
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const handleEditPet = (pet) => {
    setCurrentPet(pet);
    setPetForm({
      name: pet.name || '',
      species: pet.species || '',
      breed: pet.breed || '',
      age: pet.age || '',
      gender: pet.gender || '',
      size: pet.size || '',
      description: pet.description || '',
      location: pet.location || '',
      image: pet.imageUrl || '',
      status: pet.status || 'Available'
    });
    setShowEditPetForm(true);
  };

  const handleUpdatePet = async (e) => {
    e.preventDefault();
    
    // Form validation
    if (!petForm.name || !petForm.species || !petForm.image) {
      setError('Please fill in all required fields (Name, Species, Image URL)');
      toast.error('Please fill in all required fields');
      return;
    }
    
    try {
      setLoading(true);
      console.log('Updating pet:', currentPet._id);
      
      const response = await fetch(`http://localhost:5000/api/pets/${currentPet._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          name: petForm.name.trim(),
          species: petForm.species.trim(),
          breed: petForm.breed.trim(),
          age: petForm.age.trim(),
          gender: petForm.gender,
          size: petForm.size,
          description: petForm.description.trim(),
          location: petForm.location.trim(),
          imageUrl: petForm.image.trim(),
          status: petForm.status
        })
      });

      if (response.ok) {
        const data = await response.json();
        console.log('✅ Pet updated successfully in database:', data.data);
        
        // Update the pet in local state immediately for instant UI update
        const updatedPet = data.data;
        setPets(prev => prev.map(p => p._id === currentPet._id ? updatedPet : p));
        
        // Close form and reset
        setShowEditPetForm(false);
        resetForm();
        setError('');
        
        // Show success message
        toast.success(`🎉 "${updatedPet.name}" has been updated successfully and changes are saved to database!`);
      } else {
        const errorData = await response.json();
        const errorMsg = errorData.message || 'Failed to update pet';
        setError(errorMsg);
        toast.error(errorMsg);
      }
    } catch (err) {
      const errorMsg = 'Failed to update pet. Please try again.';
      setError(errorMsg);
      toast.error(errorMsg);
      console.error('Error updating pet:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeletePet = async (petId) => {
    // Find the pet name for better user feedback
    const petToDelete = pets.find(pet => pet._id === petId);
    const petName = petToDelete ? petToDelete.name : 'this pet';
    
    if (window.confirm(`Are you sure you want to delete "${petName}"? This action cannot be undone.`)) {
      try {
        setLoading(true);
        console.log('Attempting to delete pet with ID:', petId);
        
        const response = await fetch(`http://localhost:5000/api/pets/${petId}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        console.log('✅ Pet deleted successfully from database:', data);
        
        // Update the UI by removing the deleted pet immediately for instant feedback
        setPets(prevPets => prevPets.filter(pet => pet._id !== petId));
        
        // Show success message
        toast.success(`🗑️ "${petName}" has been deleted from your pets and removed from customer listings!`);
        
      } catch (err) {
        console.error('Error deleting pet:', err);
        const errorMsg = err.message.includes('Failed to fetch') 
          ? 'Unable to connect to the server.' 
          : `Failed to delete pet: ${err.message}`;
        setError(errorMsg);
        toast.error(errorMsg);
      } finally {
        setLoading(false);
      }
    }
  };

  const fetchPets = async (retryCount = 0) => {
    console.log('Starting fetchPets...');
    
    if (!token) {
      console.error('No authentication token found');
      setLoading(false);
      return;
    }

    // Check if user has petowner role
    if (!user || user.role !== 'petowner') {
      console.error(`Access denied. User role is ${user?.role || 'undefined'}`);
      setLoading(false);
      return;
    }

    console.log('Fetching pets for user:', user.id);
    if (retryCount === 0) setLoading(true); // Only show loading on first attempt
    setError(''); // Clear previous errors
    
    try {
      console.log('Making request to /api/pets/owner');
      const response = await fetch('http://localhost:5000/api/pets/owner', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          'Cache-Control': 'no-cache',
          'Pragma': 'no-cache'
        },
        credentials: 'include'
      });
      
      console.log('Response status:', response.status);
      
      if (response.ok) {
        const data = await response.json();
        console.log('Pets data received:', data);
        
        // Clear any previous errors
        setError('');
        
        // Ensure we have valid data
        if (data && data.success) {
          const petsData = Array.isArray(data.data) ? data.data : [];
          console.log(`Setting ${petsData.length} pets in state`);
          setPets(petsData);
          
          // Update statistics if provided by server
          if (data.statistics) {
            console.log('Updating statistics:', data.statistics);
            setStatistics(data.statistics);
          } else {
            // Calculate statistics locally if not provided by server
            const totalPets = petsData.length;
            const availablePets = petsData.filter(pet => pet.status === 'Available').length;
            const adoptedPets = petsData.filter(pet => pet.status === 'Adopted').length;
            const pendingPets = petsData.filter(pet => pet.status === 'Pending').length;
            
            setStatistics({
              totalPets,
              availablePets,
              adoptedPets,
              pendingPets,
              pendingRequests: 0 // Will be updated by server
            });
          }
        } else {
          console.warn('Invalid response format:', data);
          setPets([]);
          setStatistics({
            totalPets: 0,
            availablePets: 0,
            adoptedPets: 0,
            pendingPets: 0,
            pendingRequests: 0
          });
        }
        
      } else if (response.status === 401) {
        console.error('Authentication expired');
        setPets([]);
      } else if (response.status === 403) {
        console.error('Access denied');
        setPets([]);
      } else if (response.status === 404) {
        // No pets found is not an error
        console.log('No pets found for this owner');
        setPets([]);
      } else {
        console.error(`HTTP error! status: ${response.status}`);
        // Retry once if it's a server error
        if (response.status >= 500 && retryCount < 1) {
          console.log('Retrying due to server error...');
          setTimeout(() => fetchPets(retryCount + 1), 1000);
          return;
        }
        setPets([]);
      }
    } catch (err) {
      console.error('Error in fetchPets:', err);
      // Retry once on network error
      if (retryCount < 1) {
        console.log('Retrying due to network error...');
        setTimeout(() => fetchPets(retryCount + 1), 1000);
        return;
      }
      setPets([]);
    } finally {
      console.log('Finished fetchPets');
      setLoading(false);
    }
  };

  // Initial fetch when component mounts or when token/user changes
  useEffect(() => {
    if (token && user && user.role === 'petowner') {
      fetchPets();
    } else {
      // Clear pets if user is not a pet owner or not authenticated
      setPets([]);
      setLoading(false);
    }
  }, [token, user?.id, user?.role]); // More specific dependencies
  return (
    <div>
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem' }}>
        <h1 style={{ textAlign: 'center', marginBottom: '2rem' }}>
          Pet Owner Dashboard 🐾
        </h1>
        
        {loading ? (
          <div style={{ textAlign: 'center', padding: '2rem' }}>Loading pet data...</div>
        ) : null}

        {/* Quick Actions */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
          gap: '1rem', 
          marginBottom: '2rem' 
        }}>
          <button 
            className="btn" 
            style={{ background: '#28a745' }}
            onClick={() => setShowAddPetForm(true)}
          >
            Add New Pet
          </button>
          <button 
            className="btn" 
            style={{ background: '#17a2b8' }}
            onClick={() => fetchPets()}
            disabled={loading}
          >
            {loading ? 'Refreshing...' : 'Refresh Pets'}
          </button>
          <button className="btn" style={{ background: '#ffc107' }}>Upload Documents</button>
          <button className="btn" style={{ background: '#6c757d' }}>Message Adopters</button>
        </div>
        
        {/* Add Pet Form */}
        {showAddPetForm && (
          <div style={{ 
            position: 'fixed', 
            top: 0, 
            left: 0, 
            right: 0, 
            bottom: 0, 
            backgroundColor: 'rgba(0,0,0,0.5)', 
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center',
            zIndex: 1000
          }}>
            <div style={{ 
              background: 'white', 
              padding: '2rem', 
              borderRadius: '15px', 
              width: '90%', 
              maxWidth: '600px',
              maxHeight: '90vh',
              overflowY: 'auto'
            }}>
              <h3 style={{ marginBottom: '1rem' }}>Add New Pet</h3>
              <form onSubmit={handleAddPet}>
                <div style={{ marginBottom: '1rem' }}>
                  <label style={{ display: 'block', marginBottom: '0.5rem' }}>Pet Name</label>
                  <input 
                    type="text" 
                    name="name" 
                    value={petForm.name} 
                    onChange={handleInputChange} 
                    style={{ width: '100%', padding: '0.5rem', borderRadius: '5px', border: '1px solid #ddd' }}
                    required
                  />
                </div>
                <div style={{ marginBottom: '1rem' }}>
                  <label style={{ display: 'block', marginBottom: '0.5rem' }}>Gender</label>
                  <select 
                    name="gender" 
                    value={petForm.gender} 
                    onChange={handleInputChange} 
                    style={{ width: '100%', padding: '0.5rem', borderRadius: '5px', border: '1px solid #ddd' }}
                  >
                    <option value="">Select Gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                  </select>
                </div>
                <div style={{ marginBottom: '1rem' }}>
                  <label style={{ display: 'block', marginBottom: '0.5rem' }}>Size</label>
                  <select 
                    name="size" 
                    value={petForm.size} 
                    onChange={handleInputChange} 
                    style={{ width: '100%', padding: '0.5rem', borderRadius: '5px', border: '1px solid #ddd' }}
                  >
                    <option value="">Select Size</option>
                    <option value="Small">Small</option>
                    <option value="Medium">Medium</option>
                    <option value="Large">Large</option>
                  </select>
                </div>
                <div style={{ marginBottom: '1rem' }}>
                  <label style={{ display: 'block', marginBottom: '0.5rem' }}>Location</label>
                  <input 
                    type="text" 
                    name="location" 
                    value={petForm.location} 
                    onChange={handleInputChange} 
                    style={{ width: '100%', padding: '0.5rem', borderRadius: '5px', border: '1px solid #ddd' }}
                    placeholder="City, State"
                  />
                </div>
                <div style={{ marginBottom: '1rem' }}>
                  <label style={{ display: 'block', marginBottom: '0.5rem' }}>Species</label>
                  <input 
                    type="text" 
                    name="species" 
                    value={petForm.species} 
                    onChange={handleInputChange} 
                    style={{ width: '100%', padding: '0.5rem', borderRadius: '5px', border: '1px solid #ddd' }}
                    required
                  />
                </div>
                <div style={{ marginBottom: '1rem' }}>
                  <label style={{ display: 'block', marginBottom: '0.5rem' }}>Breed</label>
                  <input 
                    type="text" 
                    name="breed" 
                    value={petForm.breed} 
                    onChange={handleInputChange} 
                    style={{ width: '100%', padding: '0.5rem', borderRadius: '5px', border: '1px solid #ddd' }}
                  />
                </div>
                <div style={{ marginBottom: '1rem' }}>
                  <label style={{ display: 'block', marginBottom: '0.5rem' }}>Age</label>
                  <input 
                    type="text" 
                    name="age" 
                    value={petForm.age} 
                    onChange={handleInputChange} 
                    style={{ width: '100%', padding: '0.5rem', borderRadius: '5px', border: '1px solid #ddd' }}
                  />
                </div>
                <div style={{ marginBottom: '1rem' }}>
                  <label style={{ display: 'block', marginBottom: '0.5rem' }}>Description</label>
                  <textarea 
                    name="description" 
                    value={petForm.description} 
                    onChange={handleInputChange} 
                    style={{ width: '100%', padding: '0.5rem', borderRadius: '5px', border: '1px solid #ddd', minHeight: '100px' }}
                  />
                </div>
                <div style={{ marginBottom: '1rem' }}>
                  <label style={{ display: 'block', marginBottom: '0.5rem' }}>Image URL</label>
                  <input 
                    type="text" 
                    name="image" 
                    value={petForm.image} 
                    onChange={handleInputChange} 
                    style={{ width: '100%', padding: '0.5rem', borderRadius: '5px', border: '1px solid #ddd' }}
                    placeholder="https://example.com/image.jpg"
                  />
                </div>
                <div style={{ marginBottom: '1rem' }}>
                  <label style={{ display: 'block', marginBottom: '0.5rem' }}>Status</label>
                  <select 
                    name="status" 
                    value={petForm.status} 
                    onChange={handleInputChange} 
                    style={{ width: '100%', padding: '0.5rem', borderRadius: '5px', border: '1px solid #ddd' }}
                  >
                    <option value="Available">Available</option>
                    <option value="Pending">Pending</option>
                    <option value="Adopted">Adopted</option>
                  </select>
                </div>
                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '1rem' }}>
                  <button 
                    type="button" 
                    onClick={() => {
                      setShowAddPetForm(false);
                      resetForm();
                    }}
                    style={{ padding: '0.5rem 1rem', borderRadius: '5px', border: 'none', background: '#6c757d', color: 'white' }}
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit" 
                    style={{ padding: '0.5rem 1rem', borderRadius: '5px', border: 'none', background: '#28a745', color: 'white' }}
                  >
                    Add Pet
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
        
        {/* Edit Pet Form */}
        {showEditPetForm && (
          <div style={{ 
            position: 'fixed', 
            top: 0, 
            left: 0, 
            right: 0, 
            bottom: 0, 
            backgroundColor: 'rgba(0,0,0,0.5)', 
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center',
            zIndex: 1000
          }}>
            <div style={{ 
              background: 'white', 
              padding: '2rem', 
              borderRadius: '15px', 
              width: '90%', 
              maxWidth: '600px',
              maxHeight: '90vh',
              overflowY: 'auto'
            }}>
              <h3 style={{ marginBottom: '1rem' }}>Edit Pet</h3>
              <form onSubmit={handleUpdatePet}>
                <div style={{ marginBottom: '1rem' }}>
                  <label style={{ display: 'block', marginBottom: '0.5rem' }}>Pet Name</label>
                  <input 
                    type="text" 
                    name="name" 
                    value={petForm.name} 
                    onChange={handleInputChange} 
                    style={{ width: '100%', padding: '0.5rem', borderRadius: '5px', border: '1px solid #ddd' }}
                    required
                  />
                </div>
                <div style={{ marginBottom: '1rem' }}>
                  <label style={{ display: 'block', marginBottom: '0.5rem' }}>Gender</label>
                  <select 
                    name="gender" 
                    value={petForm.gender} 
                    onChange={handleInputChange} 
                    style={{ width: '100%', padding: '0.5rem', borderRadius: '5px', border: '1px solid #ddd' }}
                  >
                    <option value="">Select Gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                  </select>
                </div>
                <div style={{ marginBottom: '1rem' }}>
                  <label style={{ display: 'block', marginBottom: '0.5rem' }}>Size</label>
                  <select 
                    name="size" 
                    value={petForm.size} 
                    onChange={handleInputChange} 
                    style={{ width: '100%', padding: '0.5rem', borderRadius: '5px', border: '1px solid #ddd' }}
                  >
                    <option value="">Select Size</option>
                    <option value="Small">Small</option>
                    <option value="Medium">Medium</option>
                    <option value="Large">Large</option>
                  </select>
                </div>
                <div style={{ marginBottom: '1rem' }}>
                  <label style={{ display: 'block', marginBottom: '0.5rem' }}>Location</label>
                  <input 
                    type="text" 
                    name="location" 
                    value={petForm.location} 
                    onChange={handleInputChange} 
                    style={{ width: '100%', padding: '0.5rem', borderRadius: '5px', border: '1px solid #ddd' }}
                    placeholder="City, State"
                  />
                </div>
                <div style={{ marginBottom: '1rem' }}>
                  <label style={{ display: 'block', marginBottom: '0.5rem' }}>Species</label>
                  <input 
                    type="text" 
                    name="species" 
                    value={petForm.species} 
                    onChange={handleInputChange} 
                    style={{ width: '100%', padding: '0.5rem', borderRadius: '5px', border: '1px solid #ddd' }}
                    required
                  />
                </div>
                <div style={{ marginBottom: '1rem' }}>
                  <label style={{ display: 'block', marginBottom: '0.5rem' }}>Breed</label>
                  <input 
                    type="text" 
                    name="breed" 
                    value={petForm.breed} 
                    onChange={handleInputChange} 
                    style={{ width: '100%', padding: '0.5rem', borderRadius: '5px', border: '1px solid #ddd' }}
                  />
                </div>
                <div style={{ marginBottom: '1rem' }}>
                  <label style={{ display: 'block', marginBottom: '0.5rem' }}>Age</label>
                  <input 
                    type="text" 
                    name="age" 
                    value={petForm.age} 
                    onChange={handleInputChange} 
                    style={{ width: '100%', padding: '0.5rem', borderRadius: '5px', border: '1px solid #ddd' }}
                  />
                </div>
                <div style={{ marginBottom: '1rem' }}>
                  <label style={{ display: 'block', marginBottom: '0.5rem' }}>Description</label>
                  <textarea 
                    name="description" 
                    value={petForm.description} 
                    onChange={handleInputChange} 
                    style={{ width: '100%', padding: '0.5rem', borderRadius: '5px', border: '1px solid #ddd', minHeight: '100px' }}
                  />
                </div>
                <div style={{ marginBottom: '1rem' }}>
                  <label style={{ display: 'block', marginBottom: '0.5rem' }}>Image URL</label>
                  <input 
                    type="text" 
                    name="image" 
                    value={petForm.image} 
                    onChange={handleInputChange} 
                    style={{ width: '100%', padding: '0.5rem', borderRadius: '5px', border: '1px solid #ddd' }}
                    placeholder="https://example.com/image.jpg"
                  />
                </div>
                <div style={{ marginBottom: '1rem' }}>
                  <label style={{ display: 'block', marginBottom: '0.5rem' }}>Status</label>
                  <select 
                    name="status" 
                    value={petForm.status} 
                    onChange={handleInputChange} 
                    style={{ width: '100%', padding: '0.5rem', borderRadius: '5px', border: '1px solid #ddd' }}
                  >
                    <option value="Available">Available</option>
                    <option value="Pending">Pending</option>
                    <option value="Adopted">Adopted</option>
                  </select>
                </div>
                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '1rem' }}>
                  <button 
                    type="button" 
                    onClick={() => {
                      setShowEditPetForm(false);
                      resetForm();
                    }}
                    style={{ padding: '0.5rem 1rem', borderRadius: '5px', border: 'none', background: '#6c757d', color: 'white' }}
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit" 
                    style={{ padding: '0.5rem 1rem', borderRadius: '5px', border: 'none', background: '#ffc107', color: 'black' }}
                  >
                    Update Pet
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
          {/* Adoption Requests */}
          <div style={{ background: 'white', padding: '2rem', borderRadius: '15px', boxShadow: '0 5px 15px rgba(0,0,0,0.1)' }}>
            <h3 style={{ marginBottom: '1rem', borderBottom: '2px solid #667eea', paddingBottom: '0.5rem' }}>Adoption Requests</h3>
            <p>No pending adoption requests.</p>

          </div>

          {/* Pet Management */}
          <div style={{ background: 'white', padding: '2rem', borderRadius: '15px', boxShadow: '0 5px 15px rgba(0,0,0,0.1)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h3 style={{ borderBottom: '2px solid #667eea', paddingBottom: '0.5rem', margin: 0 }}>
                My Pets {pets.length > 0 && `(${pets.length})`}
              </h3>
              {pets.length > 0 && (
                <button 
                  onClick={() => fetchPets()}
                  disabled={loading}
                  style={{
                    background: '#17a2b8',
                    color: 'white',
                    border: 'none',
                    padding: '0.5rem 1rem',
                    borderRadius: '5px',
                    cursor: 'pointer',
                    fontSize: '0.8rem'
                  }}
                >
                  {loading ? 'Refreshing...' : '🔄 Refresh'}
                </button>
              )}
            </div>
            
            {loading && pets.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '2rem', color: '#666' }}>
                <p>Loading your pets...</p>
              </div>
            ) : pets.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '2rem', color: '#666', background: '#f8f9fa', borderRadius: '10px', border: '2px dashed #dee2e6' }}>
                <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🐾</div>
                <p style={{ fontSize: '1.3rem', marginBottom: '1rem', fontWeight: 'bold', color: '#495057' }}>No pets added yet</p>
                <p style={{ marginBottom: '1rem' }}>Your pet dashboard is empty. Start by adding your first pet!</p>
                <p style={{ fontSize: '0.9rem', color: '#6c757d', fontStyle: 'italic', marginBottom: '1.5rem' }}>
                  ✨ Only pets you add will appear here and be visible to customers for adoption.
                </p>
                <button 
                  onClick={() => setShowAddPetForm(true)}
                  style={{
                    background: '#28a745',
                    color: 'white',
                    border: 'none',
                    padding: '0.75rem 1.5rem',
                    borderRadius: '25px',
                    cursor: 'pointer',
                    fontSize: '1rem',
                    fontWeight: 'bold',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                  }}
                >
                  🐕 Add Your First Pet
                </button>
              </div>
            ) : (
              pets.map(pet => (
                <div key={pet._id} style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  padding: '1rem', 
                  border: '1px solid #eee', 
                  borderRadius: '10px',
                  marginBottom: '1rem'
                }}>
                  <img 
                    src={pet.imageUrl || 'https://via.placeholder.com/60x60?text=No+Image'} 
                    alt={pet.name || 'Pet'} 
                    style={{ width: '60px', height: '60px', borderRadius: '50%', objectFit: 'cover', marginRight: '1rem' }}
                    onError={(e) => {
                      e.target.src = 'https://via.placeholder.com/60x60?text=No+Image';
                    }}
                  />
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <h4>{pet.name || 'Unnamed Pet'}</h4>
                      {/* Show "New" badge for recently added pets (within last 5 minutes) */}
                      {new Date() - new Date(pet.createdAt) < 5 * 60 * 1000 && (
                        <span style={{
                          background: '#28a745',
                          color: 'white',
                          fontSize: '0.7rem',
                          padding: '0.2rem 0.5rem',
                          borderRadius: '10px',
                          fontWeight: 'bold'
                        }}>
                          NEW
                        </span>
                      )}
                    </div>
                    <p style={{ color: '#666', fontSize: '0.9rem' }}>Status: {pet.status || 'Unknown'}</p>
                    <p style={{ color: '#666', fontSize: '0.9rem' }}>{pet.species || 'Unknown'} - {pet.breed || 'Unknown'}</p>
                  </div>
                  <div>
                    <Link to={`/pet/${pet._id}`} className="btn" style={{ fontSize: '0.8rem', padding: '0.5rem 1rem', marginRight: '0.5rem' }}>View</Link>
                    <button 
                      className="btn" 
                      style={{ fontSize: '0.8rem', padding: '0.5rem 1rem', background: '#ffc107', marginRight: '0.5rem' }}
                      onClick={() => handleEditPet(pet)}
                    >
                      Edit
                    </button>
                    <button 
                      className="btn" 
                      style={{ fontSize: '0.8rem', padding: '0.5rem 1rem', background: '#dc3545' }}
                      onClick={() => handleDeletePet(pet._id)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Statistics */}
        <div style={{ background: 'white', padding: '2rem', borderRadius: '15px', boxShadow: '0 5px 15px rgba(0,0,0,0.1)', marginTop: '2rem' }}>
          <h3 style={{ marginBottom: '1rem', borderBottom: '2px solid #667eea', paddingBottom: '0.5rem' }}>Statistics</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
            <div style={{ textAlign: 'center', padding: '1rem', background: '#e8f5e9', borderRadius: '10px' }}>
              <h4>Total Pets</h4>
              <p style={{ fontSize: '2rem', fontWeight: 'bold', color: '#2e7d32' }}>{statistics.totalPets}</p>
              <small style={{ color: '#666' }}>Stored in MongoDB Atlas</small>
            </div>
            <div style={{ textAlign: 'center', padding: '1rem', background: '#fff3cd', borderRadius: '10px' }}>
              <h4>Pending Requests</h4>
              <p style={{ fontSize: '2rem', fontWeight: 'bold', color: '#856404' }}>
                {statistics.pendingRequests}
              </p>
              <small style={{ color: '#666' }}>Adoption requests</small>
            </div>
            <div style={{ textAlign: 'center', padding: '1rem', background: '#d4edda', borderRadius: '10px' }}>
              <h4>Adopted</h4>
              <p style={{ fontSize: '2rem', fontWeight: 'bold', color: '#155724' }}>
                {statistics.adoptedPets}
              </p>
              <small style={{ color: '#666' }}>Successfully adopted</small>
            </div>
            <div style={{ textAlign: 'center', padding: '1rem', background: '#e3f2fd', borderRadius: '10px' }}>
              <h4>Available</h4>
              <p style={{ fontSize: '2rem', fontWeight: 'bold', color: '#1565c0' }}>
                {statistics.availablePets}
              </p>
              <small style={{ color: '#666' }}>Ready for adoption</small>
            </div>
          </div>
        </div>

      </div>
      
      {/* Toast Container for notifications */}
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </div>
  );
};

export default PetOwnerDashboard;