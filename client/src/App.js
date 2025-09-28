import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import './App.css';

// Components
import Navigation from './components/Navigation';
import HomePage from './components/HomePage';
import PetListings from './components/PetListings';
import PetDetails from './components/PetDetails';
import AdoptionForm from './components/AdoptionForm';
import UserDashboard from './components/UserDashboard';
import AdminDashboard from './components/AdminDashboard';
import PetOwnerDashboardEnhanced from './components/PetOwnerDashboardEnhanced';
import Contact from './components/Contact';
import PetArticles from './components/PetArticles';
import ArticleDetail from './components/ArticleDetail';
import PetEvents from './components/PetEvents';
import Login from './components/Login';
import Register from './components/Register';

// Protected Route Component
const ProtectedRoute = ({ children, requiredRole = null }) => {
  const { isAuthenticated, isAdmin, isPetOwner, isCustomer, loading } = useAuth();
  
  if (loading) {
    return <div>Loading...</div>; // Or a loading spinner
  }

  if (!isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }

  if (requiredRole === 'admin' && !isAdmin()) {
    return <Navigate to="/" replace />;
  }

  if (requiredRole === 'petowner' && !isPetOwner()) {
    return <Navigate to="/" replace />;
  }

  if (requiredRole === 'customer' && !isCustomer()) {
    return <Navigate to="/" replace />;
  }

  return children;
};

// Public Route Component
const PublicRoute = ({ children, restricted = false }) => {
  const { isAuthenticated, loading } = useAuth();
  
  if (loading) {
    return <div>Loading...</div>;
  }

  if (isAuthenticated() && restricted) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

// Layout Component
const Layout = ({ children }) => (
  <>
    <Navigation />
    <main className="main-content">
      {children}
    </main>
  </>
);

function App() {
  return (
    <Router>
      <AuthProvider>
        <div className="App" role="application" aria-label="PetAdopt Application">
          <Layout>
            <Routes>
              <Route path="/" element={<HomePage />} />
              
              {/* Public Routes */}
              <Route path="/login" element={
                <PublicRoute restricted={true}>
                  <Login />
                </PublicRoute>
              } />
              
              <Route path="/register" element={
                <PublicRoute restricted={true}>
                  <Register />
                </PublicRoute>
              } />
              
              <Route path="/pets" element={<PetListings />} />
              <Route path="/pet/:id" element={<PetDetails />} />
              <Route path="/adopt/:petId" element={<AdoptionForm />} />
              
              {/* Protected User Routes */}
              <Route 
                path="/dashboard" 
                element={
                  <ProtectedRoute requiredRole="customer">
                    <UserDashboard />
                  </ProtectedRoute>
                } 
              />
              
              {/* Protected Pet Owner Routes */}
              <Route 
                path="/petowner" 
                element={
                  <ProtectedRoute requiredRole="petowner">
                    <PetOwnerDashboardEnhanced />
                  </ProtectedRoute>
                } 
              />
              
              {/* Protected Admin Routes */}
              <Route 
                path="/admin" 
                element={
                  <ProtectedRoute requiredRole="admin">
                    <AdminDashboard />
                  </ProtectedRoute>
                } 
              />
              
              {/* Public Routes */}
              <Route path="/contact" element={<Contact />} />
              <Route path="/articles" element={<PetArticles />} />
              <Route path="/article/:id" element={<ArticleDetail />} />
              <Route path="/events" element={<PetEvents />} />
              
              {/* 404 Route - Keep this last */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </Layout>
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;
