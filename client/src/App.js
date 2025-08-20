import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navigation from './components/Navigation';
import './App.css';
import HomePage from './components/HomePage';
import PetListings from './components/PetListings';
import PetDetails from './components/PetDetails';
import AdoptionForm from './components/AdoptionForm';
import UserDashboard from './components/UserDashboard';
import AdminDashboard from './components/AdminDashboard';
import Contact from './components/Contact';
import PetArticles from './components/PetArticles';
import ArticleDetail from './components/ArticleDetail';
import PetEvents from './components/PetEvents';
import ImageTest from './components/ImageTest';
import Login from './components/Login';
import Register from './components/Register';
import ProtectedRoute from './components/ProtectedRoute';

// Create a layout component to wrap Navigation
const Layout = ({ children }) => (
  <>
    <Navigation />
    {children}
  </>
);

function App() {
  return (
    <Router>
      <div className="App" role="application" aria-label="PetAdopt Application">
        <Layout>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/pets" element={<PetListings />} />
            <Route path="/pet/:id" element={<PetDetails />} />
            <Route path="/adopt/:petId" element={<AdoptionForm />} />
            <Route 
              path="/dashboard" 
              element={
                <ProtectedRoute requireAuth={true} requireUser={true}>
                  <UserDashboard />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/admin" 
              element={
                <ProtectedRoute requireAuth={true} requireAdmin={true}>
                  <AdminDashboard />
                </ProtectedRoute>
              } 
            />
            <Route path="/contact" element={<Contact />} />
            <Route path="/articles" element={<PetArticles />} />
            <Route path="/article/:id" element={<ArticleDetail />} />
            <Route path="/events" element={<PetEvents />} />
            <Route path="/test-images" element={<ImageTest />} />
          </Routes>
        </Layout>
      </div>
    </Router>
  );
}

export default App;
