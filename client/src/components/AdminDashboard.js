import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import './AdminDashboard.css';

const AdminDashboard = () => {
  const { token } = useAuth();
  const [pets, setPets] = useState([]);
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('pets');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      // Fetch all pets
      const petsResponse = await fetch('http://localhost:5000/api/pets', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      const petsData = await petsResponse.json();
      
      if (petsResponse.ok) {
        setPets(petsData.pets || []);
      } else {
        setError(petsData.message || 'Failed to fetch pets');
      }

      // Fetch all users
      const usersResponse = await fetch('http://localhost:5000/api/users', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      const usersData = await usersResponse.json();
      
      if (usersResponse.ok) {
        setUsers(usersData.users || []);
      } else {
        setError(usersData.message || 'Failed to fetch users');
      }
    } catch (err) {
      setError('Error connecting to server');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeletePet = async (petId) => {
    if (!window.confirm('Are you sure you want to delete this pet?')) {
      return;
    }
    
    try {
      const response = await fetch(`http://localhost:5000/api/pets/${petId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.ok) {
        setPets(pets.filter(pet => pet._id !== petId));
      } else {
        const data = await response.json();
        setError(data.message || 'Failed to delete pet');
      }
    } catch (err) {
      setError('Error connecting to server');
      console.error(err);
    }
  };

  const renderPetsTab = () => {
    if (pets.length === 0) {
      return <div className="no-data">No pets found in the system.</div>;
    }

    return (
      <div className="data-table">
        <table>
          <thead>
            <tr>
              <th>Image</th>
              <th>Name</th>
              <th>Species</th>
              <th>Breed</th>
              <th>Age</th>
              <th>Gender</th>
              <th>Location</th>
              <th>Owner</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {pets.map(pet => (
              <tr key={pet._id || pet.id}>
                <td>
                  <div className="pet-thumbnail">
                    <img 
                      src={pet.images && pet.images.length > 0 ? pet.images[0] : pet.image || '/images/pets/placeholder.svg'} 
                      alt={pet.name} 
                    />
                  </div>
                </td>
                <td>{pet.name}</td>
                <td>{pet.species}</td>
                <td>{pet.breed}</td>
                <td>{pet.age}</td>
                <td>{pet.gender}</td>
                <td>{pet.location}</td>
                <td>
                  {users.find(user => user._id === pet.owner)?.username || pet.owner || 'Unknown'}
                </td>
                <td>
                  <button 
                    className="view-btn"
                    onClick={() => window.open(`/pets/${pet._id || pet.id}`, '_blank')}
                  >
                    View
                  </button>
                  <button 
                    className="delete-btn"
                    onClick={() => handleDeletePet(pet._id || pet.id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  const renderUsersTab = () => {
    if (users.length === 0) {
      return <div className="no-data">No users found in the system.</div>;
    }

    return (
      <div className="data-table">
        <table>
          <thead>
            <tr>
              <th>Username</th>
              <th>Email</th>
              <th>Role</th>
              <th>Verified</th>
              <th>Created At</th>
              <th>Pets Count</th>
            </tr>
          </thead>
          <tbody>
            {users.map(user => (
              <tr key={user._id || user.id}>
                <td>{user.username}</td>
                <td>{user.email}</td>
                <td>
                  <span className={`role-badge ${user.role}`}>
                    {user.role}
                  </span>
                </td>
                <td>
                  {user.isEmailVerified ? (
                    <span className="verified-badge">Yes</span>
                  ) : (
                    <span className="not-verified-badge">No</span>
                  )}
                </td>
                <td>{new Date(user.createdAt).toLocaleDateString()}</td>
                <td>{pets.filter(pet => pet.owner === user._id || pet.owner === user.id).length}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );  };

  return (
    <div className="admin-dashboard">
      <div className="dashboard-header">
        <h1>Admin Dashboard</h1>
        <p>Manage all pets and users in the system</p>
      </div>

      {error && <div className="error-message">{error}</div>}

      <div className="dashboard-tabs">
        <button 
          className={`tab-btn ${activeTab === 'pets' ? 'active' : ''}`}
          onClick={() => setActiveTab('pets')}
        >
          Pets
        </button>
        <button 
          className={`tab-btn ${activeTab === 'users' ? 'active' : ''}`}
          onClick={() => setActiveTab('users')}
        >
          Users
        </button>
      </div>

      {isLoading ? (
        <div className="loading">Loading data...</div>
      ) : (
        <div className="tab-content">
          {activeTab === 'pets' ? renderPetsTab() : renderUsersTab()}
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;