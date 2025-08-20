import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { getCurrentUser, logout } from '../utils/auth';
import './Navigation.css';

const Navigation = () => {
  const location = useLocation();
  const currentUser = getCurrentUser();

  const handleLogout = () => {
    logout();
  };

  return (
    <header className="header">
      <nav className="nav">
        <Link to="/" className="logo">🐾 PetAdopt</Link>
        <ul className="nav-links">
          <li><Link to="/pets" className={location.pathname === '/pets' ? 'active' : ''}>Browse Pets</Link></li>
          <li><Link to="/articles" className={location.pathname === '/articles' ? 'active' : ''}>Articles</Link></li>
          <li><Link to="/events" className={location.pathname === '/events' ? 'active' : ''}>Events</Link></li>
          <li><Link to="/contact" className={location.pathname === '/contact' ? 'active' : ''}>Contact</Link></li>
          
          {currentUser ? (
            <>
              {currentUser.role === 'admin' ? (
                <li><Link to="/admin" className={location.pathname === '/admin' ? 'active' : ''}>Admin Dashboard</Link></li>
              ) : (
                <li><Link to="/dashboard" className={location.pathname === '/dashboard' ? 'active' : ''}>My Dashboard</Link></li>
              )}
              <li className="user-menu">
                <span className="user-name">Welcome, {currentUser.name}</span>
                <button onClick={handleLogout} className="logout-btn">Logout</button>
              </li>
            </>
          ) : (
            <li><Link to="/login" className={location.pathname === '/login' ? 'active' : ''}>Login</Link></li>
          )}
        </ul>
      </nav>
    </header>
  );
};

export default Navigation;
