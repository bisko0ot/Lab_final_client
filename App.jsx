import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import PrivateRoute from './components/PrivateRoute';
import ScrollToTop from './components/ScrollToTop';

// Pages
import Home from './pages/Home';
import Ideas from './pages/Ideas';
import IdeaDetails from './pages/IdeaDetails';
import AddIdea from './pages/AddIdea';
import MyIdeas from './pages/MyIdeas';
import MyInteractions from './pages/MyInteractions';
import Profile from './pages/Profile';
import Login from './pages/Login';
import Register from './pages/Register';
import NotFound from './pages/NotFound';

import './App.css';

function App() {
  return (
    <div className="app-container">
      {/* Toast Provider */}
      <Toaster 
        position="top-right"
        toastOptions={{
          className: 'glass',
          style: {
            background: 'var(--bg-secondary)',
            color: 'var(--text-primary)',
            border: '1px solid var(--border-color)',
            fontFamily: 'var(--font-body)',
            fontSize: '0.9rem',
            borderRadius: 'var(--border-radius-md)'
          },
          success: {
            iconTheme: {
              primary: 'var(--color-success)',
              secondary: '#fff'
            }
          },
          error: {
            iconTheme: {
              primary: 'var(--color-danger)',
              secondary: '#fff'
            }
          }
        }}
      />
      
      {/* Navigation Header */}
      <Navbar />

      {/* Scroll to top on route change */}
      <ScrollToTop />

      {/* Main Routing Layout */}
      <main className="main-content">
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<Home />} />
          <Route path="/ideas" element={<Ideas />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Protected routes */}
          <Route path="/ideas/:id" element={
            <PrivateRoute>
              <IdeaDetails />
            </PrivateRoute>
          } />
          <Route path="/add-idea" element={
            <PrivateRoute>
              <AddIdea />
            </PrivateRoute>
          } />
          <Route path="/my-ideas" element={
            <PrivateRoute>
              <MyIdeas />
            </PrivateRoute>
          } />
          <Route path="/my-interactions" element={
            <PrivateRoute>
              <MyInteractions />
            </PrivateRoute>
          } />
          <Route path="/profile" element={
            <PrivateRoute>
              <Profile />
            </PrivateRoute>
          } />

          {/* Catch-all 404 route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>

      {/* Shared Footer */}
      <Footer />
    </div>
  );
}

export default App;
