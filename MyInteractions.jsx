import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { toast } from 'react-hot-toast';
import Spinner from '../components/Spinner';
import { FiMessageSquare, FiTrendingUp, FiArrowRight, FiLayers } from 'react-icons/fi';
import './MyInteractions.css';

const MyInteractions = () => {
  const { user } = useAuth();
  const [interactions, setInteractions] = useState([]);
  const [loading, setLoading] = useState(true);

  // Dynamic Title
  useEffect(() => {
    document.title = "IdeaVault | My Interactions";
  }, []);

  const fetchInteractions = async () => {
    if (!user?.email) return;
    setLoading(true);
    const token = localStorage.getItem('ideavault-token');
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/interactions/${user.email}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (!response.ok) throw new Error("Failed to load your interactions");
      const data = await response.json();
      setInteractions(data);
    } catch (error) {
      console.error(error);
      toast.error("Error retrieving your comment history.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInteractions();
  }, [user]);

  return (
    <div className="interactions-page-container fade-in">
      <div className="page-header">
        <h1 className="title-gradient">My Interactions</h1>
        <p className="subtitle">Track your contributions and feedback. Here are the startup ideas you've discussed and reviewed.</p>
      </div>

      {loading ? (
        <Spinner />
      ) : interactions.length === 0 ? (
        <div className="empty-interactions-state">
          <div className="empty-graphic"><FiMessageSquare /></div>
          <h3>No interactions recorded yet</h3>
          <p>Explore some trending concepts and post feedback to start building your portfolio!</p>
          <Link to="/ideas" className="btn btn-primary">Browse Ideas</Link>
        </div>
      ) : (
        <div className="interactions-list-grid">
          {interactions.map((idea) => (
            <div key={idea._id} className="interaction-card glass">
              <div className="interaction-card-body">
                <div className="interaction-card-main">
                  <span className="badge badge-secondary">{idea.category}</span>
                  <h3>{idea.title}</h3>
                  <p className="pitch">{idea.shortDescription}</p>

                  <div className="creator-subtext">
                    <span>Proposed by: <strong>{idea.creatorName}</strong></span>
                  </div>
                </div>

                <div className="interaction-card-side">
                  <div className="metrics-box">
                    <span className="metric-num"><FiMessageSquare /> {idea.commentCount || 0}</span>
                    <span className="metric-lbl">Total Feedbacks</span>
                  </div>
                  <Link to={`/ideas/${idea._id}`} className="btn btn-outline btn-sm interaction-details-btn">
                    View Discussion <FiArrowRight />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyInteractions;
