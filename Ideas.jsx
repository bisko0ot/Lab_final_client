import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Spinner from '../components/Spinner';
import { FiSearch, FiLayers, FiMessageSquare, FiCalendar, FiDollarSign } from 'react-icons/fi';
import { formatDate, formatBudget } from '../utils/helpers';
import './Ideas.css';

const Ideas = () => {
  const [ideas, setIdeas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');

  // Dynamic Page Title
  useEffect(() => {
    document.title = "IdeaVault | Explore Startup Ideas";
  }, []);

  const fetchIdeas = async () => {
    setLoading(true);
    try {
      const url = new URL(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/ideas`);
      if (search) url.searchParams.append('search', search);
      if (category && category !== 'All') url.searchParams.append('category', category);

      const response = await fetch(url);
      if (!response.ok) throw new Error("Failed to fetch ideas");
      const data = await response.json();
      // Handle both paginated { ideas, total } and plain array responses
      setIdeas(Array.isArray(data) ? data : (data.ideas || []));
    } catch (error) {
      console.error("Error fetching ideas:", error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch when search or category changes
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchIdeas();
    }, 300); // 300ms debounce on search input

    return () => clearTimeout(delayDebounceFn);
  }, [search, category]);

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
  };

  const handleCategoryChange = (cat) => {
    setCategory(cat);
  };

  const categoriesList = ['All', 'Tech', 'Health', 'AI', 'Education', 'Finance', 'E-commerce', 'Logistics', 'Other'];

  return (
    <div className="ideas-page-container fade-in">
      <div className="page-header">
        <h1 className="title-gradient">Explore Ideas</h1>
        <p className="subtitle">Discover innovative concepts shared by the community and join the validation discussions.</p>
      </div>

      {/* Search and Filter Controls */}
      <div className="filter-controls-wrapper glass">
        <div className="search-bar-input">
          <FiSearch className="search-icon" />
          <input
            type="text"
            placeholder="Search ideas by title..."
            value={search}
            onChange={handleSearchChange}
          />
        </div>

        <div className="categories-pill-box">
          {categoriesList.map((cat) => (
            <button
              key={cat}
              className={`cat-pill ${category === cat ? 'active' : ''}`}
              onClick={() => handleCategoryChange(cat)}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Idea Cards Grid */}
      {loading ? (
        <Spinner />
      ) : ideas.length === 0 ? (
        <div className="empty-ideas-state">
          <div className="empty-graphic"><FiLayers /></div>
          <h3>No startup ideas found</h3>
          <p>Be the first to share an idea in this category!</p>
          <Link to="/add-idea" className="btn btn-primary">Share an Idea</Link>
        </div>
      ) : (
        <div className="grid-3">
          {ideas.map((idea) => (
            <div key={idea._id} className="card idea-card">
              <div className="idea-card-image-box">
                <img 
                  src={idea.imageUrl || 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=600'} 
                  alt={idea.title} 
                  className="idea-card-img"
                  onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=600'; }}
                />
                <span className="badge badge-secondary idea-card-cat">{idea.category}</span>
              </div>

              <div className="idea-card-content">
                <h3 className="idea-card-title">{idea.title}</h3>
                <p className="idea-card-pitch">{idea.shortDescription}</p>

                <div className="idea-card-details">
                  <div className="detail-item">
                    <FiMessageSquare />
                    <span>{idea.commentCount || 0} Comments</span>
                  </div>
                  {idea.budget && (
                    <div className="detail-item">
                      <FiDollarSign />
                      <span>Budget: {formatBudget(idea.budget)}</span>
                    </div>
                  )}
                  <div className="detail-item">
                    <FiCalendar />
                    <span>{formatDate(idea.createdAt)}</span>
                  </div>
                </div>

                <div className="idea-card-footer">
                  <div className="idea-card-creator">
                    <img 
                      src={idea.creatorPhoto || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=150'} 
                      alt={idea.creatorName} 
                      className="creator-avatar"
                      onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=150'; }}
                    />
                    <span className="creator-name">{idea.creatorName}</span>
                  </div>
                  <Link to={`/ideas/${idea._id}`} className="btn btn-primary btn-sm view-details-btn">
                    View Details
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

export default Ideas;
