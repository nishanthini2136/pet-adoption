import React from 'react';
import { Link } from 'react-router-dom';
import { getCurrentUser } from '../utils/auth';

const UserDashboard = () => {
  // Mock data (will be replaced with API calls)
  const adoptionRequests = [
    {
      id: 1,
      petName: 'Buddy',
      status: 'Pending',
      date: '2024-01-15',
      petImage: 'https://images.unsplash.com/photo-1552053831-71594a27632d?w=300&h=200&fit=crop'
    },
    {
      id: 2,
      petName: 'Whiskers',
      status: 'Approved',
      date: '2024-01-10',
      petImage: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=300&h=200&fit=crop'
    }
  ];

  const savedPets = [
    {
      id: 3,
      name: 'Max',
      image: 'https://images.unsplash.com/photo-1546527868-ccb7ee7dfa6a?w=300&h=200&fit=crop'
    }
  ];

  const currentUser = getCurrentUser();

  return (
    <div className="user-dashboard">
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem' }}>
        <h1 style={{ textAlign: 'center', marginBottom: '2rem' }}>
          Welcome, {currentUser?.name || 'User'}! 🐾
        </h1>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
          {/* Adoption Requests */}
          <div style={{ background: 'white', padding: '2rem', borderRadius: '15px', boxShadow: '0 5px 15px rgba(0,0,0,0.1)' }}>
            <h3 style={{ marginBottom: '1rem', borderBottom: '2px solid #667eea', paddingBottom: '0.5rem' }}>Adoption Requests</h3>
            {adoptionRequests.map(request => (
              <div key={request.id} style={{ 
                display: 'flex', 
                alignItems: 'center', 
                padding: '1rem', 
                border: '1px solid #eee', 
                borderRadius: '10px',
                marginBottom: '1rem'
              }}>
                <img src={request.petImage} alt={request.petName} style={{ width: '60px', height: '60px', borderRadius: '50%', objectFit: 'cover', marginRight: '1rem' }} />
                <div style={{ flex: 1 }}>
                  <h4>{request.petName}</h4>
                  <p style={{ color: '#666', fontSize: '0.9rem' }}>Applied: {request.date}</p>
                </div>
                <span style={{ 
                  padding: '0.5rem 1rem', 
                  borderRadius: '20px', 
                  fontSize: '0.8rem',
                  fontWeight: 'bold',
                  background: request.status === 'Approved' ? '#d4edda' : request.status === 'Rejected' ? '#f8d7da' : '#fff3cd',
                  color: request.status === 'Approved' ? '#155724' : request.status === 'Rejected' ? '#721c24' : '#856404'
                }}>
                  {request.status}
                </span>
              </div>
            ))}
          </div>

          {/* Saved Pets */}
          <div style={{ background: 'white', padding: '2rem', borderRadius: '15px', boxShadow: '0 5px 15px rgba(0,0,0,0.1)' }}>
            <h3 style={{ marginBottom: '1rem', borderBottom: '2px solid #667eea', paddingBottom: '0.5rem' }}>Saved Pets</h3>
            {savedPets.map(pet => (
              <div key={pet.id} style={{ 
                display: 'flex', 
                alignItems: 'center', 
                padding: '1rem', 
                border: '1px solid #eee', 
                borderRadius: '10px',
                marginBottom: '1rem'
              }}>
                <img src={pet.image} alt={pet.name} style={{ width: '60px', height: '60px', borderRadius: '50%', objectFit: 'cover', marginRight: '1rem' }} />
                <div style={{ flex: 1 }}>
                  <h4>{pet.name}</h4>
                </div>
                <Link to={`/pet/${pet.id}`} className="btn" style={{ fontSize: '0.8rem', padding: '0.5rem 1rem' }}>View</Link>
              </div>
            ))}
          </div>
        </div>

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
              <p><strong>Total Applications:</strong> {adoptionRequests.length}</p>
            </div>
          </div>
          <button className="btn" style={{ marginTop: '1rem' }}>Update Profile</button>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;