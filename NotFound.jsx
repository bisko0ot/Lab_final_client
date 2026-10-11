import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiAlertOctagon, FiArrowLeft, FiTrendingUp } from 'react-icons/fi';
import './NotFound.css';

const NotFound = () => {
  useEffect(() => {
    document.title = "IdeaVault | Page Not Found";
  }, []);

  return (
    <div className="notfound-wrapper fade-in">
      <div className="notfound-card glass">
        <div className="notfound-icon"><FiAlertOctagon /></div>
        <h1 className="title-gradient">404</h1>
        <h2>Concept Lost in Space</h2>
        <p>The page or startup concept you are searching for does not exist or has been deleted by its creator.</p>
        <Link to="/" className="btn btn-primary btn-icon-left">
          <FiArrowLeft /> Return to Vault
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
