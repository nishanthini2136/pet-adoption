import React from 'react';
import { Link } from 'react-router-dom';
import { getCurrentUser } from '../utils/auth';

const AdminDashboard = () => {
  // Mock data (will be replaced with API calls)
  const adoptionRequests = [
    {
      id: 1,
      petName: 'Buddy',
      applicantName: 'John Doe',
      status: 'Pending',
      date: '2024-01-15',
      email: 'john.doe@example.com'
    },
    {
      id: 2,
      petName: 'Whiskers',
      applicantName: 'Jane Smith',
      status: 'Approved',
      date: '2024-01-10',
      email: 'jane.smith@example.com'
    }
  ];

  const pets = [
    {
      id: 1,
      name: 'Buddy',
      status: 'Available',
      image: 'https://images.unsplash.com/photo-1552053831-71594a27632d?w=300&h=200&fit=crop'
    },
    {
      id: 2,
      name: 'Whiskers',
      status: 'Adopted',
      image: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=300&h=200&fit=crop'
    }
  ];

  const currentUser = getCurrentUser();

  return (
    <div>
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem' }}>
        <h1 style={{ textAlign: 'center', marginBottom: '2rem' }}>
          Admin Dashboard - Welcome, {currentUser?.name || 'Admin'}! 🔧
        </h1>

        {/* Quick Actions */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
          gap: '1rem', 
          marginBottom: '2rem' 
        }}>
          <button className="btn" style={{ background: '#28a745' }}>Add New Pet</button>
          <button className="btn" style={{ background: '#17a2b8' }}>Manage Requests</button>
          <button className="btn" style={{ background: '#ffc107' }}>Upload Documents</button>
          <button className="btn" style={{ background: '#6c757d' }}>Message Adopters</button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
          {/* Adoption Requests */}
          <div style={{ background: 'white', padding: '2rem', borderRadius: '15px', boxShadow: '0 5px 15px rgba(0,0,0,0.1)' }}>
            <h3 style={{ marginBottom: '1rem', borderBottom: '2px solid #667eea', paddingBottom: '0.5rem' }}>Adoption Requests</h3>
            {adoptionRequests.map(request => (
              <div key={request.id} style={{ 
                padding: '1rem', 
                border: '1px solid #eee', 
                borderRadius: '10px',
                marginBottom: '1rem'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                  <h4>{request.petName}</h4>
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
                <p><strong>Applicant:</strong> {request.applicantName}</p>
                <p><strong>Email:</strong> {request.email}</p>
                <p><strong>Date:</strong> {request.date}</p>
                <div style={{ marginTop: '1rem' }}>
                  <button className="btn" style={{ fontSize: '0.8rem', padding: '0.5rem 1rem', marginRight: '0.5rem' }}>Approve</button>
                  <button className="btn" style={{ fontSize: '0.8rem', padding: '0.5rem 1rem', background: '#dc3545' }}>Reject</button>
                  <button className="btn" style={{ fontSize: '0.8rem', padding: '0.5rem 1rem', background: '#6c757d' }}>Message</button>
                </div>
              </div>
            ))}
          </div>

          {/* Pet Management */}
          <div style={{ background: 'white', padding: '2rem', borderRadius: '15px', boxShadow: '0 5px 15px rgba(0,0,0,0.1)' }}>
            <h3 style={{ marginBottom: '1rem', borderBottom: '2px solid #667eea', paddingBottom: '0.5rem' }}>Pet Management</h3>
            {pets.map(pet => (
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
                  <p style={{ color: '#666', fontSize: '0.9rem' }}>Status: {pet.status}</p>
                </div>
                <div>
                  <button className="btn" style={{ fontSize: '0.8rem', padding: '0.5rem 1rem', marginRight: '0.5rem' }}>Edit</button>
                  <button className="btn" style={{ fontSize: '0.8rem', padding: '0.5rem 1rem', background: '#dc3545' }}>Delete</button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Statistics */}
        <div style={{ background: 'white', padding: '2rem', borderRadius: '15px', boxShadow: '0 5px 15px rgba(0,0,0,0.1)', marginTop: '2rem' }}>
          <h3 style={{ marginBottom: '1rem', borderBottom: '2px solid #667eea', paddingBottom: '0.5rem' }}>Statistics</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '2rem' }}>
            <div style={{ textAlign: 'center' }}>
              <h4 style={{ fontSize: '2rem', color: '#667eea', marginBottom: '0.5rem' }}>25</h4>
              <p>Total Pets</p>
            </div>
            <div style={{ textAlign: 'center' }}>
              <h4 style={{ fontSize: '2rem', color: '#28a745', marginBottom: '0.5rem' }}>15</h4>
              <p>Adopted Pets</p>
            </div>
            <div style={{ textAlign: 'center' }}>
              <h4 style={{ fontSize: '2rem', color: '#ffc107', marginBottom: '0.5rem' }}>8</h4>
              <p>Pending Requests</p>
            </div>
            <div style={{ textAlign: 'center' }}>
              <h4 style={{ fontSize: '2rem', color: '#17a2b8', marginBottom: '0.5rem' }}>12</h4>
              <p>Active Users</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;