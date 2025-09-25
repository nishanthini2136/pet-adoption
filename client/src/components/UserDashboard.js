import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getCurrentUser } from '../utils/auth';
import { useAuth } from '../contexts/AuthContext';
import { toast } from 'react-toastify';

const UserDashboard = () => {
  const { token } = useAuth();
  const [adoptedPets, setAdoptedPets] = useState([]);
  const [pendingAdoptions, setPendingAdoptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Fetch adopted pets
        const [adoptedResponse, pendingResponse] = await Promise.all([
          fetch('http://localhost:5000/api/adoptions/my-adoptions', {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          }),
          fetch('http://localhost:5000/api/adoptions', {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          })
        ]);

        const adoptedData = await adoptedResponse.json();
        const pendingData = await pendingResponse.json();

        if (adoptedResponse.ok) {
          setAdoptedPets(adoptedData.data || []);
        } else {
          setError(adoptedData.message || 'Failed to fetch adopted pets');
        }

        if (pendingResponse.ok) {
          setPendingAdoptions(pendingData.data || []);
        } else {
          console.error('Failed to fetch pending adoptions:', pendingData.message);
        }
      } catch (err) {
        setError('Error connecting to server');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      fetchData();
    } else {
      setLoading(false);
    }
  }, [token]);

  const currentUser = getCurrentUser();

  return (
    <div className="user-dashboard">
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem' }}>
        <h1 style={{ textAlign: 'center', marginBottom: '2rem' }}>
          Welcome, {currentUser?.name || 'User'}! 🐾
        </h1>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '2rem' }}>Loading data...</div>
        ) : error ? (
          <div style={{ textAlign: 'center', padding: '2rem', color: 'red' }}>{error}</div>
        ) : (
          <>
            {/* Adopted Pets Section */}
            <div style={{ background: 'white', padding: '2rem', borderRadius: '15px', boxShadow: '0 5px 15px rgba(0,0,0,0.1)', marginBottom: '2rem' }}>
              <h3 style={{ marginBottom: '1rem', borderBottom: '2px solid #667eea', paddingBottom: '0.5rem' }}>My Adopted Pets</h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '1.5rem' }}>
                {adoptedPets.length > 0 ? (
                  adoptedPets.map(pet => (
                    <div key={pet._id} className="pet-card" style={{ 
                      border: '1px solid #eee', 
                      borderRadius: '10px',
                      overflow: 'hidden',
                      transition: 'transform 0.3s ease',
                      boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                    }}>
                      <img
                        src={pet.imageUrl || 'https://via.placeholder.com/300x200?text=No+Image'}
                        alt={pet.name}
                        style={{ width: '100%', height: '180px', objectFit: 'cover' }}
                      />
                      <div style={{ padding: '1rem' }}>
                        <h4 style={{ margin: '0.5rem 0', color: '#2d3748' }}>{pet.name}</h4>
                        <p style={{ color: '#718096', margin: '0.25rem 0', fontSize: '0.9rem' }}>
                          {pet.breed} • {pet.age}
                        </p>
                        <p style={{ color: '#4a5568', margin: '0.5rem 0', fontSize: '0.9rem' }}>
                          Adopted on: {new Date(pet.adoptionDate || pet.createdAt).toLocaleDateString()}
                        </p>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1rem' }}>
                          <span style={{ 
                            padding: '0.25rem 0.5rem', 
                            borderRadius: '9999px', 
                            backgroundColor: '#c6f6d5',
                            color: '#22543d',
                            fontSize: '0.75rem',
                            fontWeight: 'bold'
                          }}>
                            Adopted
                          </span>
                          <Link 
                            to={`/pets/${pet._id}`} 
                            style={{
                              color: '#4299e1',
                              textDecoration: 'none',
                              fontWeight: '500',
                              fontSize: '0.9rem',
                              ':hover': {
                                textDecoration: 'underline'
                              }
                            }}
                          >
                            View Details
                          </Link>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <p style={{ textAlign: 'center', padding: '2rem' }}>No available pets found.</p>
                )}
              </div>
              <div style={{ textAlign: 'center', marginTop: '1.5rem' }}>
                <Link 
                  to="/pets" 
                  className="btn-primary"
                  style={{
                    display: 'inline-block',
                    padding: '0.75rem 1.5rem',
                    backgroundColor: '#4f46e5',
                    color: 'white',
                    borderRadius: '0.375rem',
                    textDecoration: 'none',
                    fontWeight: '500',
                    transition: 'background-color 0.2s',
                    ':hover': {
                      backgroundColor: '#4338ca'
                    }
                  }}
                >
                  Browse Available Pets
                </Link>
              </div>
            </div>

            {/* Pending Adoptions Section */}
            {pendingAdoptions.length > 0 && (
                <div style={{ background: 'white', padding: '2rem', borderRadius: '15px', boxShadow: '0 5px 15px rgba(0,0,0,0.1)', marginBottom: '2rem' }}>
                  <h3 style={{ marginBottom: '1rem', borderBottom: '2px solid #667eea', paddingBottom: '0.5rem' }}>Pending Adoptions</h3>
                  <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                      <thead>
                        <tr style={{ backgroundColor: '#f7fafc', borderBottom: '1px solid #e2e8f0' }}>
                          <th style={{ padding: '0.75rem 1rem', textAlign: 'left', color: '#4a5568', fontWeight: '600', fontSize: '0.875rem' }}>Pet</th>
                          <th style={{ padding: '0.75rem 1rem', textAlign: 'left', color: '#4a5568', fontWeight: '600', fontSize: '0.875rem' }}>Status</th>
                          <th style={{ padding: '0.75rem 1rem', textAlign: 'left', color: '#4a5568', fontWeight: '600', fontSize: '0.875rem' }}>Date</th>
                          <th style={{ padding: '0.75rem 1rem', textAlign: 'left', color: '#4a5568', fontWeight: '600', fontSize: '0.875rem' }}>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {pendingAdoptions.map(adoption => (
                          <tr key={adoption._id} style={{ borderBottom: '1px solid #e2e8f0' }}>
                            <td style={{ padding: '1rem', display: 'flex', alignItems: 'center' }}>
                              <img 
                                src={adoption.pet?.imageUrl || 'https://via.placeholder.com/50?text=Pet'} 
                                alt={adoption.pet?.name || 'Pet'} 
                                style={{ width: '50px', height: '50px', borderRadius: '8px', objectFit: 'cover', marginRight: '1rem' }} 
                              />
                              <span style={{ fontWeight: '500' }}>{adoption.pet?.name || 'Pet'}</span>
                            </td>
                            <td style={{ padding: '1rem' }}>
                              <span style={{
                                padding: '0.25rem 0.5rem',
                                borderRadius: '9999px',
                                backgroundColor: adoption.status === 'Approved' ? '#c6f6d5' : 
                                              adoption.status === 'Rejected' ? '#fed7d7' : '#feebc8',
                                color: adoption.status === 'Approved' ? '#22543d' : 
                                      adoption.status === 'Rejected' ? '#9b2c2c' : '#9c4221',
                                fontSize: '0.75rem',
                                fontWeight: 'bold'
                              }}>
                                {adoption.status}
                              </span>
                            </td>
                            <td style={{ padding: '1rem', color: '#718096', fontSize: '0.875rem' }}>
                              {new Date(adoption.createdAt).toLocaleDateString()}
                            </td>
                            <td style={{ padding: '1rem' }}>
                              {adoption.pet && (
                                <Link 
                                  to={`/pets/${adoption.pet._id}`} 
                                  style={{
                                    color: '#4299e1',
                                    textDecoration: 'none',
                                    fontWeight: '500',
                                    fontSize: '0.875rem',
                                    ':hover': {
                                      textDecoration: 'underline'
                                    }
                                  }}
                                >
                                  View
                                </Link>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
          </>
        )}

        {/* Profile Info */}
        <div style={{ background: 'white', padding: '2rem', borderRadius: '15px', boxShadow: '0 5px 15px rgba(0,0,0,0.1)', marginTop: '2rem' }}>
          <h3 style={{ marginBottom: '1rem', borderBottom: '2px solid #667eea', paddingBottom: '0.5rem' }}>Profile Information</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
            <div>
              <p><strong>Name:</strong> John Doe</p>
              <p><strong>Email:</strong> john.doe@example.com</p>
              <p><strong>Phone:</strong> +1 (555) 123-4567</p>
            </div>
            <div>
              <p><strong>Address:</strong> 123 Main St, New York, NY 10001</p>
              <p><strong>Member Since:</strong> January 2024</p>
              <p><strong>Total Applications:</strong> {pendingAdoptions.length}</p>
            </div>
          </div>
          <button className="btn" style={{ marginTop: '1rem' }}>Update Profile</button>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;