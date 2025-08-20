import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import PetImage from './PetImage';
import './PetEvents.css';

const PetEvents = () => {
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);

  const handleViewDetails = (eventId) => {
    const event = events.find(e => e.id === eventId);
    setSelectedEvent(event);
    setShowDetailsModal(true);
  };

  const handleRegister = (eventId) => {
    const event = events.find(e => e.id === eventId);
    setSelectedEvent(event);
    setShowRegisterModal(true);
  };

  const handleCloseModals = () => {
    setShowDetailsModal(false);
    setShowRegisterModal(false);
  };

  const events = [
    {
      id: 1,
      title: "Pet Adoption Day",
      type: "adoption",
      date: "2024-02-15",
      time: "10:00 AM - 4:00 PM",
      location: "Central Park",
      description: "Join us for a special adoption event featuring dogs, cats, and other pets looking for their forever homes.",
      image: "https://images.unsplash.com/photo-1552053831-71594a27632d?w=400&h=300&fit=crop",
      organizer: "PetAdopt Foundation",
      capacity: 50,
      registered: 35,
      price: "Free",
      tags: ["adoption", "dogs", "cats"]
    },
    {
      id: 2,
      title: "Pet Training Workshop",
      type: "workshop",
      date: "2024-02-20",
      time: "2:00 PM - 5:00 PM",
      location: "Community Center",
      description: "Learn essential training techniques from professional dog trainers. Bring your pet for hands-on practice.",
      image: "https://images.unsplash.com/photo-1546527868-ccb7ee7dfa6a?w=400&h=300&fit=crop",
      organizer: "Professional Pet Trainers",
      capacity: 20,
      registered: 18,
      price: "$25",
      tags: ["training", "workshop", "dogs"]
    },
    {
      id: 3,
      title: "Pet Health Seminar",
      type: "seminar",
      date: "2024-02-25",
      time: "6:00 PM - 8:00 PM",
      location: "Veterinary Clinic",
      description: "Expert veterinarians will discuss common health issues, nutrition, and preventive care for pets.",
      image: "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=400&h=300&fit=crop",
      organizer: "City Veterinary Association",
      capacity: 40,
      registered: 25,
      price: "$15",
      tags: ["health", "seminar", "veterinary"]
    },
    {
      id: 4,
      title: "Pet Photography Session",
      type: "activity",
      date: "2024-03-01",
      time: "11:00 AM - 3:00 PM",
      location: "Botanical Gardens",
      description: "Professional pet photographers will capture beautiful moments with your furry friends.",
      image: "https://images.unsplash.com/photo-1547407139-3c921a66005c?w=400&h=300&fit=crop",
      organizer: "Pet Photography Studio",
      capacity: 30,
      registered: 22,
      price: "$30",
      tags: ["photography", "activity", "fun"]
    },
    {
      id: 5,
      title: "Pet Grooming Workshop",
      type: "workshop",
      date: "2024-03-05",
      time: "1:00 PM - 4:00 PM",
      location: "Pet Grooming Salon",
      description: "Learn proper grooming techniques and tips for maintaining your pet's coat and hygiene.",
      image: "https://images.unsplash.com/photo-1513360371669-4adf3dd7dff8?w=400&h=300&fit=crop",
      organizer: "Grooming Experts",
      capacity: 15,
      registered: 12,
      price: "$20",
      tags: ["grooming", "workshop", "care"]
    },
    {
      id: 6,
      title: "Pet Social Meetup",
      type: "social",
      date: "2024-03-10",
      time: "3:00 PM - 6:00 PM",
      location: "Dog Park",
      description: "A fun social gathering for pets and their owners. Great opportunity for socialization.",
      image: "https://images.unsplash.com/photo-1589941013453-ec89f33b5e95?w=400&h=300&fit=crop",
      organizer: "Pet Social Club",
      capacity: 60,
      registered: 45,
      price: "Free",
      tags: ["social", "meetup", "fun"]
    }
  ];

  const filters = [
    { id: 'all', name: 'All Events' },
    { id: 'adoption', name: 'Adoption Events' },
    { id: 'workshop', name: 'Workshops' },
    { id: 'seminar', name: 'Seminars' },
    { id: 'activity', name: 'Activities' },
    { id: 'social', name: 'Social Events' }
  ];

  const filteredEvents = selectedFilter === 'all' 
    ? events 
    : events.filter(event => event.type === selectedFilter);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  const getRegistrationStatus = (registered, capacity) => {
    const percentage = (registered / capacity) * 100;
    if (percentage >= 90) return { status: 'Almost Full', color: '#ff6b6b' };
    if (percentage >= 70) return { status: 'Limited Spots', color: '#ffa726' };
    return { status: 'Open', color: '#66bb6a' };
  };

  return (
    <div className="pet-events-container">
      {/* Details Modal */}
      {showDetailsModal && selectedEvent && (
        <div className="modal-overlay" onClick={handleCloseModals}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={handleCloseModals}>×</button>
            <h2>{selectedEvent.title}</h2>
            <img 
              src={selectedEvent.image} 
              alt={selectedEvent.title} 
              style={{ width: '100%', borderRadius: '10px', marginBottom: '1rem' }} 
            />
            <p><strong>Date:</strong> {formatDate(selectedEvent.date)}</p>
            <p><strong>Time:</strong> {selectedEvent.time}</p>
            <p><strong>Location:</strong> {selectedEvent.location}</p>
            <p><strong>Organizer:</strong> {selectedEvent.organizer}</p>
            <p><strong>Price:</strong> {selectedEvent.price}</p>
            <p><strong>Capacity:</strong> {selectedEvent.registered}/{selectedEvent.capacity}</p>
            <p>{selectedEvent.description}</p>
            <div className="event-tags" style={{ marginTop: '1rem' }}>
              {selectedEvent.tags.map(tag => (
                <span key={tag} className="event-tag">{tag}</span>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Registration Modal */}
      {showRegisterModal && selectedEvent && (
        <div className="modal-overlay" onClick={handleCloseModals}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={handleCloseModals}>×</button>
            <h2>Register for {selectedEvent.title}</h2>
            <p>Please fill out the form below to register for this event.</p>
            
            <form style={{ marginTop: '1rem' }}>
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem' }}>Name</label>
                <input 
                  type="text" 
                  style={{ width: '100%', padding: '0.5rem', borderRadius: '5px', border: '1px solid #ddd' }} 
                  required 
                />
              </div>
              
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem' }}>Email</label>
                <input 
                  type="email" 
                  style={{ width: '100%', padding: '0.5rem', borderRadius: '5px', border: '1px solid #ddd' }} 
                  required 
                />
              </div>
              
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem' }}>Phone</label>
                <input 
                  type="tel" 
                  style={{ width: '100%', padding: '0.5rem', borderRadius: '5px', border: '1px solid #ddd' }} 
                  required 
                />
              </div>
              
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem' }}>Number of Attendees</label>
                <input 
                  type="number" 
                  min="1" 
                  max="5" 
                  defaultValue="1" 
                  style={{ width: '100%', padding: '0.5rem', borderRadius: '5px', border: '1px solid #ddd' }} 
                  required 
                />
              </div>
              
              <button 
                type="submit" 
                className="btn" 
                style={{ width: '100%', background: '#28a745', marginTop: '1rem' }}
                onClick={(e) => {
                  e.preventDefault();
                  alert('Registration successful! You will receive a confirmation email shortly.');
                  handleCloseModals();
                }}
              >
                Complete Registration
              </button>
            </form>
          </div>
        </div>
      )}

      <div className="events-wrapper">
        <div className="events-header">
          <h1>Pet Events & Activities</h1>
          <p>Join our community events, workshops, and adoption days</p>
        </div>

        {/* Event Filters */}
        <div className="event-filters">
          {filters.map(filter => (
            <button
              key={filter.id}
              className={`filter-btn ${selectedFilter === filter.id ? 'active' : ''}`}
              onClick={() => setSelectedFilter(filter.id)}
            >
              {filter.name}
            </button>
          ))}
        </div>

        {/* Featured Event */}
        <div className="featured-event">
          <div className="featured-event-content">
            <div className="event-badge">Featured Event</div>
            <h2>Pet Adoption Day - Central Park</h2>
            <p className="event-description">
              Join us for our biggest adoption event of the year! Meet dozens of adorable pets looking for their forever homes. 
              Professional staff will be on hand to help you find the perfect match.
            </p>
            <div className="event-details">
              <div className="detail-item">
                <span className="detail-label">📅 Date:</span>
                <span className="detail-value">February 15, 2024</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">⏰ Time:</span>
                <span className="detail-value">10:00 AM - 4:00 PM</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">📍 Location:</span>
                <span className="detail-value">Central Park</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">💰 Price:</span>
                <span className="detail-value">Free</span>
              </div>
            </div>
            <div className="event-actions">
              <button className="register-btn">Register Now</button>
              <button className="share-btn">Share Event</button>
            </div>
          </div>
          <div className="featured-event-image">
            <PetImage 
              src="https://images.unsplash.com/photo-1552053831-71594a27632d?w=400&h=300&fit=crop" 
              alt="Adoption Event" 
              className="featured-event-pet-image"
            />
          </div>
        </div>

        {/* Events Grid */}
        <div className="events-grid">
          {filteredEvents.slice(1).map(event => {
            const registrationStatus = getRegistrationStatus(event.registered, event.capacity);
            
            return (
              <div key={event.id} className="event-card">
                <div className="event-image">
                  <PetImage 
                    src={event.image} 
                    alt={event.title}
                    className="event-pet-image"
                  />
                  <div className="event-price">{event.price}</div>
                </div>
                <div className="event-content">
                  <div className="event-type">{event.type}</div>
                  <h3 className="event-title">{event.title}</h3>
                  <p className="event-description">{event.description}</p>
                  
                  <div className="event-info">
                    <div className="info-item">
                      <span className="info-label">📅</span>
                      <span>{formatDate(event.date)}</span>
                    </div>
                    <div className="info-item">
                      <span className="info-label">⏰</span>
                      <span>{event.time}</span>
                    </div>
                    <div className="info-item">
                      <span className="info-label">📍</span>
                      <span>{event.location}</span>
                    </div>
                    <div className="info-item">
                      <span className="info-label">👥</span>
                      <span>{event.registered}/{event.capacity}</span>
                    </div>
                  </div>

                  <div className="event-status">
                    <span 
                      className="status-badge"
                      style={{ backgroundColor: registrationStatus.color }}
                    >
                      {registrationStatus.status}
                    </span>
                  </div>

                  <div className="event-tags">
                    {event.tags.map(tag => (
                      <span key={tag} className="event-tag">{tag}</span>
                    ))}
                  </div>

                  <div className="event-actions">
                    <button 
                      className="event-register-btn" 
                      onClick={() => handleRegister(event.id)}
                    >
                      Register
                    </button>
                    <button 
                      className="event-details-btn"
                      onClick={() => handleViewDetails(event.id)}
                    >
                      Details
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Event Calendar */}
        <div className="event-calendar">
          <h3>Upcoming Events Calendar</h3>
          <div className="calendar-grid">
            {events.slice(0, 6).map(event => (
              <div key={event.id} className="calendar-item">
                <div className="calendar-date">
                  <span className="date-day">{new Date(event.date).getDate()}</span>
                  <span className="date-month">{new Date(event.date).toLocaleDateString('en-US', { month: 'short' })}</span>
                </div>
                <div className="calendar-content">
                  <h4>{event.title}</h4>
                  <p>{event.time}</p>
                  <span className="calendar-type">{event.type}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PetEvents;
