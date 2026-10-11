import React from 'react';
import { Link } from 'react-router-dom';
import { FaGithub, FaLinkedinIn, FaXTwitter } from 'react-icons/fa6';
import { FiTrendingUp, FiMail, FiPhone, FiMapPin } from 'react-icons/fi';
import './Footer.css';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer-section">
      <div className="footer-container">
        {/* Brand column */}
        <div className="footer-brand">
          <Link to="/" className="footer-logo">
            <span className="logo-icon"><FiTrendingUp /></span>
            <span className="logo-text">Idea<span className="title-gradient">Vault</span></span>
          </Link>
          <p className="brand-description">
            Unlocking collaborative creativity. Share, validate, and scale your startup ideas with a global community of innovators and builders.
          </p>
          <div className="social-links">
            <a href="https://x.com" target="_blank" rel="noopener noreferrer" className="social-icon" aria-label="X (formerly Twitter)">
              <FaXTwitter />
            </a>
            <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="social-icon" aria-label="GitHub">
              <FaGithub />
            </a>
            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="social-icon" aria-label="LinkedIn">
              <FaLinkedinIn />
            </a>
          </div>
        </div>

        {/* Links column 1 */}
        <div className="footer-links-col">
          <h3>Explore</h3>
          <ul>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/ideas">All Ideas</Link></li>
            <li><Link to="/ideas?category=Tech">Tech Startups</Link></li>
            <li><Link to="/ideas?category=AI">AI & ML Solutions</Link></li>
          </ul>
        </div>

        {/* Links column 2 */}
        <div className="footer-links-col">
          <h3>Platform</h3>
          <ul>
            <li><Link to="/add-idea">Share Idea</Link></li>
            <li><Link to="/login">Community Log</Link></li>
            <li><Link to="/register">Register Account</Link></li>
          </ul>
        </div>

        {/* Contact info column */}
        <div className="footer-links-col">
          <h3>Get In Touch</h3>
          <ul className="contact-info">
            <li>
              <FiMail className="contact-icon" />
              <span>support@ideavault.co</span>
            </li>
            <li>
              <FiPhone className="contact-icon" />
              <span>+1 (555) 234-5678</span>
            </li>
            <li>
              <FiMapPin className="contact-icon" />
              <span>Silicon Valley, CA, USA</span>
            </li>
          </ul>
        </div>
      </div>

      <div className="footer-bottom">
        <div className="footer-bottom-container">
          <p>&copy; {currentYear} IdeaVault Inc. All rights reserved.</p>
          <div className="footer-bottom-links">
            <a href="#">Privacy Policy</a>
            <a href="#">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
