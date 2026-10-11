import React from 'react';
import './Spinner.css';

const Spinner = () => {
  return (
    <div className="spinner-overlay">
      <div className="spinner-container">
        <div className="neon-ring"></div>
        <div className="spinner-logo">Idea<span>Vault</span></div>
      </div>
    </div>
  );
};

export default Spinner;
