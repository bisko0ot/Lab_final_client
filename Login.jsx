import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { toast } from 'react-hot-toast';
import { FcGoogle } from 'react-icons/fc';
import { FiMail, FiLock, FiTrendingUp, FiEye, FiEyeOff } from 'react-icons/fi';
import './Auth.css';

const Login = () => {
  const { loginUser, loginWithGoogle, user } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/";

  // Dynamic Page Title
  useEffect(() => {
    document.title = "IdeaVault | Login";
  }, []);

  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      navigate(from, { replace: true });
    }
  }, [user, navigate, from]);

  const isFirebaseConfigured = import.meta.env.VITE_FIREBASE_API_KEY && import.meta.env.VITE_FIREBASE_API_KEY !== 'your_firebase_api_key';

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isFirebaseConfigured) {
      toast.error("Firebase is not configured! Please update client .env file.");
      return;
    }
    if (!email || !password) {
      toast.error("Please fill in all fields.");
      return;
    }

    setLoading(true);
    try {
      await loginUser(email, password);
      toast.success("Successfully logged in!");
      navigate(from, { replace: true });
    } catch (error) {
      console.error(error);
      const friendlyMessage = error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password' || error.code === 'auth/invalid-credential'
        ? "Invalid email or password."
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

  const handleForgotPassword = () => {
    toast.success("Password reset email template triggered! (UI Demo only)");
  };

  return (
    <div className="auth-wrapper fade-in">
      <div className="auth-card glass">
        <div className="auth-brand">
          <span className="logo-icon"><FiTrendingUp /></span>
          <h2>Welcome Back</h2>
          <p className="subtitle">Sign in to continue exploring innovative startup ideas</p>
        </div>

        {!isFirebaseConfigured && (
          <div className="firebase-warning-box">
            <h4>⚠️ Firebase Key Required</h4>
            <p>Please update the environment variables in <code>ideavault-client/.env</code> with your active Firebase keys and restart the Vite server.</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="auth-form">
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
            <div className="label-row">
              <label className="form-label" htmlFor="password">Password</label>
              <button 
                type="button" 
                className="forgot-link" 
                onClick={handleForgotPassword}
              >
                Forgot Password?
              </button>
            </div>
            <div className="input-with-icon">
              <span className="input-icon"><FiLock /></span>
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                className="form-input"
                placeholder="••••••••"
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
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        <div className="auth-divider">
          <span>Or sign in with</span>
        </div>

        <button 
          onClick={handleGoogleLogin} 
          className="btn btn-secondary google-btn"
          type="button"
        >
          <FcGoogle size={20} />
          <span>Sign in with Google</span>
        </button>

        <p className="auth-footer">
          Don't have an account? <Link to="/register">Create Account</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
