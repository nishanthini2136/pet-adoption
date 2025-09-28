import React from 'react';
import PetOwnerDashboard from './PetOwnerDashboard';
import AdoptionRequestsManager from './AdoptionRequestsManager';

const PetOwnerDashboardEnhanced = () => {
  return (
    <div>
      {/* Original Pet Owner Dashboard */}
      <PetOwnerDashboard />
      
      {/* Add Adoption Requests Management */}
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 2rem 2rem' }}>
        <AdoptionRequestsManager />
      </div>
    </div>
  );
};

export default PetOwnerDashboardEnhanced;
