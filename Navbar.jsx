import React, { useState, useRef, useEffect } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { FiSun, FiMoon, FiMenu, FiX, FiChevronDown, FiUser, FiLogOut, FiPlusCircle, FiList, FiTrendingUp } from 'react-icons/fi';
import './Navbar.css';

const Navbar = () => {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  // Close dropdown on outside click
  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  const handleLogout = async () => {
    try {
      await logout();
      setDropdownOpen(false);
      navigate('/');
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <nav className="navbar glass">
      <div className="nav-container">
        {/* Logo */}
        <Link to="/" className="nav-logo" onClick={() => setMobileMenuOpen(false)}>
          <span className="logo-icon"><FiTrendingUp /></span>
          <span className="logo-text">Idea<span className="title-gradient">Vault</span></span>
        </Link>

        {/* Mobile Menu Toggle */}
        <div className="nav-actions-mobile">
          <button className="theme-toggle-btn" onClick={toggleTheme} aria-label="Toggle Theme">
            {theme === 'light' ? <FiMoon size={20} /> : <FiSun size={20} />}
          </button>
          <button className="mobile-toggle" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            {mobileMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
          </button>
        </div>

        {/* Navigation Links */}
        <div className={`nav-menu ${mobileMenuOpen ? 'active' : ''}`}>
          <NavLink to="/" end className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`} onClick={() => setMobileMenuOpen(false)}>
            Home
          </NavLink>
          <NavLink to="/ideas" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`} onClick={() => setMobileMenuOpen(false)}>
            Ideas
          </NavLink>

          {user && (
            <>
              <NavLink to="/add-idea" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`} onClick={() => setMobileMenuOpen(false)}>
                Add Idea
              </NavLink>
              <NavLink to="/my-ideas" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`} onClick={() => setMobileMenuOpen(false)}>
                My Ideas
              </NavLink>
              <NavLink to="/my-interactions" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`} onClick={() => setMobileMenuOpen(false)}>
                My Interactions
              </NavLink>
            </>
          )}

          {/* Desktop Actions */}
          <div className="nav-actions-desktop">
            <button className="theme-toggle-btn" onClick={toggleTheme} aria-label="Toggle Theme">
              {theme === 'light' ? <FiMoon size={20} /> : <FiSun size={20} />}
            </button>

            {user ? (
              <div className="user-profile-dropdown" ref={dropdownRef}>
                <button className="profile-trigger" onClick={() => setDropdownOpen(!dropdownOpen)}>
                  <img 
                    src={user.photoURL || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=150'} 
                    alt={user.displayName || 'User'} 
                    className="profile-avatar"
                    onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=150'; }}
                  />
                  <span className="profile-name">{user.displayName || 'User'}</span>
                  <FiChevronDown className={`chevron-icon ${dropdownOpen ? 'rotate' : ''}`} />
                </button>

                {dropdownOpen && (
                  <div className="dropdown-menu fade-in">
                    <div className="dropdown-header">
                      <p className="user-name">{user.displayName || 'User'}</p>
                      <p className="user-email">{user.email}</p>
                    </div>
                    <Link to="/profile" className="dropdown-item" onClick={() => setDropdownOpen(false)}>
                      <FiUser /> Profile Management
                    </Link>
                    <button className="dropdown-item logout-btn" onClick={handleLogout}>
                      <FiLogOut /> Log Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="auth-btns">
                <Link to="/login" className="btn btn-secondary btn-sm" onClick={() => setMobileMenuOpen(false)}>Login</Link>
                <Link to="/register" className="btn btn-primary btn-sm" onClick={() => setMobileMenuOpen(false)}>Register</Link>
              </div>
            )}
          </div>

          {/* Mobile Auth Actions */}
          <div className="nav-actions-mobile-menu">
            {user ? (
              <div className="mobile-user-info">
                <div className="user-details">
                  <img 
                    src={user.photoURL || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=150'} 
                    alt={user.displayName}
                    className="profile-avatar"
                  />
                  <div>
                    <p className="user-name">{user.displayName || 'User'}</p>
                    <p className="user-email">{user.email}</p>
                  </div>
                </div>
                <Link to="/profile" className="mobile-dropdown-item" onClick={() => setMobileMenuOpen(false)}>
                  <FiUser /> Profile Management
                </Link>
                <button className="mobile-dropdown-item logout-btn" onClick={() => { handleLogout(); setMobileMenuOpen(false); }}>
                  <FiLogOut /> Log Out
                </button>
              </div>
            ) : (
              <div className="mobile-auth-btns">
                <Link to="/login" className="btn btn-secondary" onClick={() => setMobileMenuOpen(false)}>Login</Link>
                <Link to="/register" className="btn btn-primary" onClick={() => setMobileMenuOpen(false)}>Register</Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
