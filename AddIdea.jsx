import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { toast } from 'react-hot-toast';
import { FiFileText, FiDollarSign, FiUsers, FiCpu, FiPlus } from 'react-icons/fi';
import './Ideas.css';

const AddIdea = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  // Form States
  const [title, setTitle] = useState('');
  const [shortDescription, setShortDescription] = useState('');
  const [detailedDescription, setDetailedDescription] = useState('');
  const [category, setCategory] = useState('Tech');
  const [tags, setTags] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [budget, setBudget] = useState('');
  const [targetAudience, setTargetAudience] = useState('');
  const [problemStatement, setProblemStatement] = useState('');
  const [proposedSolution, setProposedSolution] = useState('');

  // Dynamic Title
  useEffect(() => {
    document.title = "IdeaVault | Submit Startup Idea";
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Required fields check
    if (!title.trim() || !shortDescription.trim() || !detailedDescription.trim() || !category || !targetAudience.trim() || !problemStatement.trim() || !proposedSolution.trim()) {
      toast.error("Please fill in all required fields.");
      return;
    }

    // Custom budget validation if specified
    if (budget.trim() && !/^[0-9,\-\s+$]+$/.test(budget)) {
      toast.error("Please enter a valid budget range or numeric value (e.g. 5,000 or 5,000-10,000).");
      return;
    }

    setLoading(true);
    const token = localStorage.getItem('ideavault-token');

    const ideaData = {
      title,
      shortDescription,
      detailedDescription,
      category,
      tags,
      imageUrl,
      budget,
      targetAudience,
      problemStatement,
      proposedSolution,
      creatorName: user?.displayName || 'Anonymous',
      creatorPhoto: user?.photoURL || ''
    };

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/ideas`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(ideaData)
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || "Failed to submit idea. Authenticate again.");
      }

      toast.success("Startup idea published successfully!");
      navigate('/ideas');
    } catch (error) {
      console.error(error);
      toast.error(error.message || "An error occurred while submitting your idea.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="add-idea-container fade-in">
      <div className="page-header">
        <h1 className="title-gradient">Publish Startup Idea</h1>
        <p className="subtitle">Submit your innovative concept, define target problems, and gather feedback from the community.</p>
      </div>

      <form onSubmit={handleSubmit} className="idea-form glass">
        <div className="form-grid">
          {/* Left Column (Core Info) */}
          <div className="form-column">
            <h3>1. Core Information</h3>
            <div className="form-group">
              <label className="form-label" htmlFor="title">Idea Title *</label>
              <input
                id="title"
                type="text"
                className="form-input"
                placeholder="e.g. HealthTracker AI"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="category">Category *</label>
              <select
                id="category"
                className="form-select"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                required
              >
                <option value="Tech">Tech</option>
                <option value="Health">Health</option>
                <option value="AI">Artificial Intelligence</option>
                <option value="Education">Education</option>
                <option value="Finance">Finance</option>
                <option value="E-commerce">E-commerce</option>
                <option value="Logistics">Logistics</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="shortDescription">Short Pitch * (Max 150 chars)</label>
              <input
                id="shortDescription"
                type="text"
                maxLength={150}
                className="form-input"
                placeholder="Brief summary of your startup idea"
                value={shortDescription}
                onChange={(e) => setShortDescription(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="detailedDescription">Detailed Description *</label>
              <textarea
                id="detailedDescription"
                className="form-textarea"
                placeholder="Explain the workflow, features, and core mechanics of your idea..."
                value={detailedDescription}
                onChange={(e) => setDetailedDescription(e.target.value)}
                required
              />
            </div>
          </div>

          {/* Right Column (Specifications) */}
          <div className="form-column">
            <h3>2. Specifications & Audience</h3>
            
            <div className="form-group">
              <label className="form-label" htmlFor="problemStatement">Problem Statement *</label>
              <textarea
                id="problemStatement"
                className="form-textarea"
                placeholder="What critical issue does your startup solve?"
                value={problemStatement}
                onChange={(e) => setProblemStatement(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="proposedSolution">Proposed Solution *</label>
              <textarea
                id="proposedSolution"
                className="form-textarea"
                placeholder="How does your idea solve the problem statement?"
                value={proposedSolution}
                onChange={(e) => setProposedSolution(e.target.value)}
                required
              />
            </div>

            <div className="form-row-2">
              <div className="form-group">
                <label className="form-label" htmlFor="targetAudience">Target Audience *</label>
                <div className="input-with-icon">
                  <span className="input-icon"><FiUsers /></span>
                  <input
                    id="targetAudience"
                    type="text"
                    className="form-input"
                    placeholder="e.g. Remote developers"
                    value={targetAudience}
                    onChange={(e) => setTargetAudience(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="budget">Estimated Budget ($)</label>
                <div className="input-with-icon">
                  <span className="input-icon"><FiDollarSign /></span>
                  <input
                    id="budget"
                    type="text"
                    className="form-input"
                    placeholder="e.g. 5,000 - 10,000"
                    value={budget}
                    onChange={(e) => setBudget(e.target.value)}
                  />
                </div>
              </div>
            </div>

            <div className="form-row-2">
              <div className="form-group">
                <label className="form-label" htmlFor="imageUrl">Pitch Image URL</label>
                <input
                  id="imageUrl"
                  type="url"
                  className="form-input"
                  placeholder="https://example.com/banner.jpg"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="tags">Tags (comma separated)</label>
                <input
                  id="tags"
                  type="text"
                  className="form-input"
                  placeholder="e.g. SaaS, AI, Health"
                  value={tags}
                  onChange={(e) => setTags(e.target.value)}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="form-actions">
          <button 
            type="submit" 
            className="btn btn-primary btn-submit-idea"
            disabled={loading}
          >
            <FiPlus /> {loading ? "Publishing Idea..." : "Publish Idea"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddIdea;
