import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { toast } from 'react-hot-toast';
import { FiUser, FiImage, FiMail, FiEdit2, FiTrendingUp } from 'react-icons/fi';
import './Profile.css';

const Profile = () => {
  const { user, updateUserProfile } = useAuth();
  const [name, setName] = useState('');
  const [photoURL, setPhotoURL] = useState('');
  const [loading, setLoading] = useState(false);

  // Dynamic Title
  useEffect(() => {
    document.title = "IdeaVault | Profile Management";
  }, []);

  // Sync inputs with user state
  useEffect(() => {
    if (user) {
      setName(user.displayName || '');
      setPhotoURL(user.photoURL || '');
    }
  }, [user]);

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!name.trim()) {
      toast.error("Name cannot be empty.");
      return;
    }

    setLoading(true);
    try {
      const finalPhoto = photoURL.trim() || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=150';
      await updateUserProfile(name, finalPhoto);
      toast.success("Profile updated successfully!");
    } catch (error) {
      console.error(error);
      toast.error(error.message || "Failed to update profile.");
    } finally {
      setLoading(false);
    }
  };

  if (!user) return null;

  return (
    <div className="profile-container fade-in">
      <div className="profile-card glass">
        <div className="profile-header">
          <div className="avatar-wrapper">
            <img 
              src={user.photoURL || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=150'} 
              alt={user.displayName || 'User'}
              className="profile-big-avatar"
              onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=150'; }}
            />
            <div className="avatar-badge"><FiEdit2 /></div>
          </div>
          <h2>Profile Management</h2>
          <p className="profile-meta">Manage your account credentials and public identity</p>
        </div>

        <div className="profile-details-display">
          <div className="detail-row">
            <span className="detail-label">Email Address</span>
            <span className="detail-value"><FiMail /> {user.email}</span>
          </div>
        </div>

        <form onSubmit={handleUpdate} className="profile-form">
          <div className="form-group">
            <label className="form-label" htmlFor="profile-name">Full Name</label>
            <div className="input-with-icon">
              <span className="input-icon"><FiUser /></span>
              <input
                id="profile-name"
                type="text"
                className="form-input"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your Name"
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="profile-photo">Photo URL</label>
            <div className="input-with-icon">
              <span className="input-icon"><FiImage /></span>
              <input
                id="profile-photo"
                type="url"
                className="form-input"
                value={photoURL}
                onChange={(e) => setPhotoURL(e.target.value)}
                placeholder="https://example.com/avatar.jpg"
              />
            </div>
          </div>

          <button 
            type="submit" 
            className="btn btn-primary profile-submit-btn"
            disabled={loading}
          >
            {loading ? "Updating..." : "Save Changes"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Profile;
