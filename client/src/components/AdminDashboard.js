import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './AdminDashboard.css';

const AdminDashboard = () => {
  console.log('AdminDashboard component loaded');
  const { token } = useAuth();
  const [pets, setPets] = useState([]);
  const [users, setUsers] = useState([]);
  const [adoptions, setAdoptions] = useState([]);
  const [systemStats, setSystemStats] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('overview');

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


  const handleDeleteUser = async (userId) => {
    if (!window.confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
      return;
    }
    
    try {
      const response = await fetch(`http://localhost:5000/api/users/${userId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.ok) {
        setUsers(users.filter(user => user._id !== userId));
        toast.success('User deleted successfully!');
      } else {
        const data = await response.json();
        toast.error(data.message || 'Failed to delete user');
      }
    } catch (err) {
      toast.error('Error connecting to server');
    }
  };

  const handleUpdateUserRole = async (userId, newRole) => {
    try {
      const response = await fetch(`http://localhost:5000/api/users/${userId}/role`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ role: newRole })
      });
      
      if (response.ok) {
        setUsers(users.map(user => 
          user._id === userId ? { ...user, role: newRole } : user
        ));
        toast.success('User role updated successfully!');
      } else {
        const data = await response.json();
        toast.error(data.message || 'Failed to update user role');
      }
    } catch (err) {
      toast.error('Error connecting to server');
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
              <th>Actions</th>
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
                <td>
                  <select 
                    value={user.role} 
                    onChange={(e) => handleUpdateUserRole(user._id, e.target.value)}
                    style={{ marginRight: '0.5rem' }}
                  >
                    <option value="customer">Customer</option>
                    <option value="petowner">Pet Owner</option>
                    <option value="admin">Admin</option>
                  </select>
                  <button 
                    className="delete-btn"
                    onClick={() => handleDeleteUser(user._id)}
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

  const renderOverviewTab = () => {
    const totalPets = pets.length;
    const totalUsers = users.length;
    const availablePets = pets.filter(pet => pet.status === 'Available').length;
    const adoptedPets = pets.filter(pet => pet.status === 'Adopted').length;
    const petOwners = users.filter(user => user.role === 'petowner').length;
    const customers = users.filter(user => user.role === 'customer').length;

    // Get recently joined users (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    const recentUsers = users
      .filter(user => new Date(user.createdAt) >= thirtyDaysAgo)
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, 10);

    const recentOwners = recentUsers.filter(user => user.role === 'petowner');
    const recentCustomers = recentUsers.filter(user => user.role === 'customer');

    return (
      <div className="overview-tab">
        <div className="stats-grid">
          <div className="stat-card">
            <h3>Total Pets</h3>
            <div className="stat-number">{totalPets}</div>
            <div className="stat-detail">In the system</div>
          </div>
          <div className="stat-card">
            <h3>Available Pets</h3>
            <div className="stat-number">{availablePets}</div>
            <div className="stat-detail">Ready for adoption</div>
          </div>
          <div className="stat-card">
            <h3>Adopted Pets</h3>
            <div className="stat-number">{adoptedPets}</div>
            <div className="stat-detail">Successfully adopted</div>
          </div>
          <div className="stat-card">
            <h3>Total Users</h3>
            <div className="stat-number">{totalUsers}</div>
            <div className="stat-detail">Registered users</div>
          </div>
          <div className="stat-card">
            <h3>Pet Owners</h3>
            <div className="stat-number">{petOwners}</div>
            <div className="stat-detail">Active pet owners</div>
          </div>
          <div className="stat-card">
            <h3>Customers</h3>
            <div className="stat-number">{customers}</div>
            <div className="stat-detail">Looking to adopt</div>
          </div>
        </div>


        {/* Recent Activity Section */}
        <div className="recent-activity">
          <h3>Recent Activity</h3>
          <div className="activity-grid">
            {/* Recent Users */}
            <div className="activity-card">
              <div className="activity-header">
                <h4>👥 Recently Joined Users</h4>
                <span className="activity-count">{recentUsers.length} in last 30 days</span>
              </div>
              <div className="activity-list">
                {recentUsers.length === 0 ? (
                  <div className="no-activity">No recent registrations</div>
                ) : (
                  recentUsers.map(user => (
                    <div key={user._id} className="activity-item">
                      <div className="activity-info">
                        <div className="activity-name">
                          <strong>{user.username}</strong>
                          <span className={`role-badge ${user.role}`}>{user.role}</span>
                        </div>
                        <div className="activity-details">
                          <span className="activity-email">{user.email}</span>
                          <span className="activity-date">
                            {new Date(user.createdAt).toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </span>
                        </div>
                      </div>
                      <div className="activity-status">
                        {user.isEmailVerified ? (
                          <span className="status-verified">✓ Verified</span>
                        ) : (
                          <span className="status-pending">⏳ Pending</span>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Recent Pet Owners */}
            <div className="activity-card">
              <div className="activity-header">
                <h4>🏠 New Pet Owners</h4>
                <span className="activity-count">{recentOwners.length} this month</span>
              </div>
              <div className="activity-list">
                {recentOwners.length === 0 ? (
                  <div className="no-activity">No new pet owners</div>
                ) : (
                  recentOwners.map(owner => {
                    const ownerPets = pets.filter(pet => pet.owner === owner._id);
                    return (
                      <div key={owner._id} className="activity-item">
                        <div className="activity-info">
                          <div className="activity-name">
                            <strong>{owner.username}</strong>
                            <span className="pets-count">{ownerPets.length} pets</span>
                          </div>
                          <div className="activity-details">
                            <span className="activity-email">{owner.email}</span>
                            <span className="activity-date">
                              Joined {new Date(owner.createdAt).toLocaleDateString('en-US', {
                                month: 'short',
                                day: 'numeric'
                              })}
                            </span>
                          </div>
                        </div>
                        <div className="activity-status">
                          {ownerPets.length > 0 ? (
                            <span className="status-active">🐾 Active</span>
                          ) : (
                            <span className="status-new">🆕 New</span>
                          )}
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Registration Trends */}
        <div className="registration-trends">
          <h3>Registration Trends</h3>
          <div className="trends-grid">
            <div className="trend-card">
              <h4>This Week</h4>
              <div className="trend-stats">
                <div className="trend-item">
                  <span className="trend-label">New Users:</span>
                  <span className="trend-value">
                    {users.filter(user => {
                      const weekAgo = new Date();
                      weekAgo.setDate(weekAgo.getDate() - 7);
                      return new Date(user.createdAt) >= weekAgo;
                    }).length}
                  </span>
                </div>
                <div className="trend-item">
                  <span className="trend-label">Pet Owners:</span>
                  <span className="trend-value">
                    {users.filter(user => {
                      const weekAgo = new Date();
                      weekAgo.setDate(weekAgo.getDate() - 7);
                      return new Date(user.createdAt) >= weekAgo && user.role === 'petowner';
                    }).length}
                  </span>
                </div>
              </div>
            </div>
            
            <div className="trend-card">
              <h4>This Month</h4>
              <div className="trend-stats">
                <div className="trend-item">
                  <span className="trend-label">New Users:</span>
                  <span className="trend-value">{recentUsers.length}</span>
                </div>
                <div className="trend-item">
                  <span className="trend-label">Pet Owners:</span>
                  <span className="trend-value">{recentOwners.length}</span>
                </div>
              </div>
            </div>

            <div className="trend-card">
              <h4>Growth Rate</h4>
              <div className="trend-stats">
                <div className="trend-item">
                  <span className="trend-label">Daily Avg:</span>
                  <span className="trend-value">
                    {Math.round(recentUsers.length / 30 * 10) / 10} users
                  </span>
                </div>
                <div className="trend-item">
                  <span className="trend-label">Conversion:</span>
                  <span className="trend-value">
                    {recentUsers.length > 0 ? Math.round((recentOwners.length / recentUsers.length) * 100) : 0}% to owners
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };


  return (
    <div className="admin-dashboard">
      <div className="dashboard-header">
        <h1>Admin Dashboard</h1>
        <p>Manage all pets and users in the system</p>
      </div>
      {error && <div className="error-message">{error}</div>}

      <div className="dashboard-tabs">
        <button 
          className={`tab-btn ${activeTab === 'overview' ? 'active' : ''}`}
          onClick={() => setActiveTab('overview')}
        >
          &#128269; Overview
        </button>
        <button 
          className={`tab-btn ${activeTab === 'pets' ? 'active' : ''}`}
          onClick={() => setActiveTab('pets')}
        >
          &#128026; Pets
        </button>
        <button 
          className={`tab-btn ${activeTab === 'users' ? 'active' : ''}`}
          onClick={() => setActiveTab('users')}
        >
          &#128100; Users
        </button>
      </div>

      {isLoading ? (
        <div className="loading">Loading data...</div>
      ) : (
        <div className="tab-content">
          {activeTab === 'overview' && renderOverviewTab()}
          {activeTab === 'pets' && renderPetsTab()}
          {activeTab === 'users' && renderUsersTab()}
        </div>
      )}

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

export default AdminDashboard;