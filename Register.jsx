import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { toast } from 'react-hot-toast';
import { FcGoogle } from 'react-icons/fc';
import { FiUser, FiMail, FiLock, FiImage, FiTrendingUp, FiEye, FiEyeOff } from 'react-icons/fi';
import './Auth.css';

const Register = () => {
  const { createUser, loginWithGoogle, updateUserProfile, user } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [photoURL, setPhotoURL] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/";

  // Dynamic Page Title
  useEffect(() => {
    document.title = "IdeaVault | Register";
  }, []);

  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      navigate(from, { replace: true });
    }
  }, [user, navigate, from]);

  const validatePassword = (pwd) => {
    if (pwd.length < 6) {
      return "Password must be at least 6 characters long.";
    }
    if (!/[A-Z]/.test(pwd)) {
      return "Password must contain at least one uppercase letter.";
    }
    if (!/[a-z]/.test(pwd)) {
      return "Password must contain at least one lowercase letter.";
    }
    return null;
  };

  const isFirebaseConfigured = import.meta.env.VITE_FIREBASE_API_KEY && import.meta.env.VITE_FIREBASE_API_KEY !== 'your_firebase_api_key';

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isFirebaseConfigured) {
      toast.error("Firebase is not configured! Please update client .env file.");
      return;
    }
    
    // Validations
    if (!name || !email || !password) {
      toast.error("Please fill in all required fields.");
      return;
    }

    const passwordError = validatePassword(password);
    if (passwordError) {
      toast.error(passwordError);
      return;
    }

    setLoading(true);
    try {
      // 1. Create User
      const userCredential = await createUser(email, password);
      
      // 2. Update Profile Name and Photo
      const photo = photoURL.trim() || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=150';
      await updateUserProfile(name, photo);
      
      toast.success("Account created successfully!");
      navigate(from, { replace: true });
    } catch (error) {
      console.error(error);
      const friendlyMessage = error.code === 'auth/email-already-in-use'
        ? "This email is already in use."
        : error.message;
      toast.error(friendlyMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    if (!isFirebaseConfigured) {
      toast.error("Firebase is not configured! Please update client .env file.");
      return;
    }
    try {
      await loginWithGoogle();
      toast.success("Successfully signed in with Google!");
      navigate(from, { replace: true });
    } catch (error) {
      console.error(error);
      toast.error(error.message || "Google sign-in failed.");
    }
  };

  return (
    <div className="auth-wrapper fade-in">
      <div className="auth-card glass">
        <div className="auth-brand">
          <span className="logo-icon"><FiTrendingUp /></span>
          <h2>Join IdeaVault</h2>
          <p className="subtitle">Share your startup concepts and validate them with the community</p>
        </div>

        {!isFirebaseConfigured && (
          <div className="firebase-warning-box">
            <h4>⚠️ Firebase Key Required</h4>
            <p>Please update the environment variables in <code>ideavault-client/.env</code> with your active Firebase keys and restart the Vite server.</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label className="form-label" htmlFor="name">Full Name</label>
            <div className="input-with-icon">
              <span className="input-icon"><FiUser /></span>
              <input
                id="name"
                type="text"
                className="form-input"
                placeholder="John Doe"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="email">Email Address</label>
            <div className="input-with-icon">
              <span className="input-icon"><FiMail /></span>
              <input
                id="email"
                type="email"
                className="form-input"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="photoUrl">Photo URL (Optional)</label>
            <div className="input-with-icon">
              <span className="input-icon"><FiImage /></span>
              <input
                id="photoUrl"
                type="url"
                className="form-input"
                placeholder="https://example.com/avatar.jpg"
                value={photoURL}
                onChange={(e) => setPhotoURL(e.target.value)}
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="password">Password</label>
            <div className="input-with-icon">
              <span className="input-icon"><FiLock /></span>
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                className="form-input"
                placeholder="Min 6 chars, uppercase & lowercase"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button
                type="button"
                className="password-toggle-btn"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <FiEyeOff /> : <FiEye />}
              </button>
            </div>
          </div>

          <button 
            type="submit" 
            className="btn btn-primary auth-submit"
            disabled={loading}
          >
            {loading ? "Creating Account..." : "Create Account"}
          </button>
        </form>

        <div className="auth-divider">
          <span>Or sign up with</span>
        </div>

        <button 
          onClick={handleGoogleLogin} 
          className="btn btn-secondary google-btn"
          type="button"
        >
          <FcGoogle size={20} />
          <span>Sign up with Google</span>
        </button>

        <p className="auth-footer">
          Already have an account? <Link to="/login">Sign In</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
