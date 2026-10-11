import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { toast } from 'react-hot-toast';
import Spinner from '../components/Spinner';
import { FiUsers, FiDollarSign, FiCpu, FiFileText, FiTrash2, FiEdit2, FiCheck, FiX, FiCalendar, FiArrowLeft, FiMessageSquare } from 'react-icons/fi';
import './Ideas.css';

const IdeaDetails = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const [idea, setIdea] = useState(null);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [commentsLoading, setCommentsLoading] = useState(true);

  // Comment state
  const [newComment, setNewComment] = useState('');
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [editText, setEditText] = useState('');
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);

  // Dynamic Title
  useEffect(() => {
    if (idea) {
      document.title = `IdeaVault | ${idea.title}`;
    } else {
      document.title = "IdeaVault | Idea Details";
    }
  }, [idea]);

  // Fetch Idea details and comments
  const fetchIdeaDetails = async () => {
    const token = localStorage.getItem('ideavault-token');
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/ideas/${id}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (!res.ok) throw new Error("Failed to load idea details");
      const data = await res.json();
      setIdea(data);
    } catch (error) {
      console.error(error);
      toast.error("Could not load idea details.");
    } finally {
      setLoading(false);
    }
  };

  const fetchComments = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/comments/${id}`);
      if (!res.ok) throw new Error("Failed to fetch comments");
      const data = await res.json();
      setComments(data);
    } catch (error) {
      console.error(error);
    } finally {
      setCommentsLoading(false);
    }
  };

  useEffect(() => {
    fetchIdeaDetails();
    fetchComments();
  }, [id]);

  // Add Comment
  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) {
      toast.error("Comment text cannot be empty.");
      return;
    }

    const token = localStorage.getItem('ideavault-token');
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/comments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          ideaId: id,
          userName: user.displayName || 'Anonymous',
          userPhoto: user.photoURL || '',
          text: newComment
        })
      });

      if (!response.ok) throw new Error("Failed to post comment");
      
      toast.success("Comment added!");
      setNewComment('');
      fetchComments();
      // Increments commentCount state locally
      setIdea(prev => ({ ...prev, commentCount: (prev.commentCount || 0) + 1 }));
    } catch (error) {
      console.error(error);
      toast.error("Failed to post comment.");
    }
  };

  // Edit Comment
  const handleStartEdit = (comment) => {
    setEditingCommentId(comment._id);
    setEditText(comment.text);
  };

  const handleCancelEdit = () => {
    setEditingCommentId(null);
    setEditText('');
  };

  const handleUpdateComment = async (commentId) => {
    if (!editText.trim()) {
      toast.error("Comment cannot be empty.");
      return;
    }

    const token = localStorage.getItem('ideavault-token');
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/comments/${commentId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ text: editText })
      });

      if (!response.ok) throw new Error("Failed to edit comment");

      toast.success("Comment updated!");
      setEditingCommentId(null);
      fetchComments();
    } catch (error) {
      console.error(error);
      toast.error("Failed to update comment.");
    }
  };

  // Delete Comment
  const handleDeleteComment = async (commentId) => {
    setDeleteConfirmId(commentId);
  };

  const confirmDeleteComment = async () => {
    const commentId = deleteConfirmId;
    setDeleteConfirmId(null);
    const token = localStorage.getItem('ideavault-token');
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/comments/${commentId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) throw new Error("Failed to delete comment");

      toast.success("Comment deleted!");
      fetchComments();
      setIdea(prev => ({ ...prev, commentCount: Math.max(0, (prev.commentCount || 1) - 1) }));
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete comment.");
    }
  };

  if (loading) return <Spinner />;
  if (!idea) return <div className="main-content"><h2>Idea not found</h2><Link to="/ideas">Back to Ideas</Link></div>;

  return (
    <div className="idea-details-page-container fade-in">
      <Link to="/ideas" className="back-link-btn"><FiArrowLeft /> Back to Ideas</Link>

      <div className="details-header-wrapper">
        <div className="details-banner-img-box">
          <img 
            src={idea.imageUrl || 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=1200'} 
            alt={idea.title} 
            className="details-banner-img"
            onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=1200'; }}
          />
          <div className="details-banner-overlay">
            <span className="badge badge-primary">{idea.category}</span>
            <h1>{idea.title}</h1>
            <p className="pitch">{idea.shortDescription}</p>
          </div>
        </div>
      </div>

      <div className="details-grid">
        {/* Left main info */}
        <div className="details-main-content">
          <div className="content-card glass">
            <h2>Detailed Idea Analysis</h2>
            <p className="detailed-desc-text">{idea.detailedDescription}</p>

            <div className="problems-solutions">
              <div className="problem-box">
                <h4>Problem Statement</h4>
                <p>{idea.problemStatement}</p>
              </div>
              <div className="solution-box">
                <h4>Proposed Solution</h4>
                <p>{idea.proposedSolution}</p>
              </div>
            </div>
          </div>

          {/* Comments Section */}
          <div className="comments-card-section glass">
            <h3><FiMessageSquare /> Feedback & Discussion ({idea.commentCount || 0})</h3>
            
            {/* Add Comment form */}
            <form onSubmit={handleAddComment} className="comment-post-form">
              <textarea
                className="form-textarea comment-input"
                placeholder="Share your feedback, suggest modifications, or ask questions about this startup idea..."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                required
              />
              <button type="submit" className="btn btn-primary btn-sm comment-submit-btn">Post Feedback</button>
            </form>

            {/* Comments List */}
            {commentsLoading ? (
              <div className="spinner-inline">Loading comments...</div>
            ) : comments.length === 0 ? (
              <p className="no-comments-text">No feedback posted yet. Write a comment to validate this concept!</p>
            ) : (
              <div className="comments-list">
                {comments.map((comment) => (
                  <div key={comment._id} className="comment-item">
                    <img 
                      src={comment.userPhoto || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=150'} 
                      alt={comment.userName} 
                      className="commenter-avatar"
                      onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=150'; }}
                    />
                    
                    <div className="comment-body">
                      <div className="comment-meta">
                        <span className="commenter-name">{comment.userName}</span>
                        <span className="comment-time"><FiCalendar /> {new Date(comment.timestamp).toLocaleString()}</span>
                      </div>

                      {editingCommentId === comment._id ? (
                        <div className="comment-edit-input-box">
                          <textarea
                            className="form-textarea"
                            value={editText}
                            onChange={(e) => setEditText(e.target.value)}
                          />
                          <div className="comment-edit-actions">
                            <button className="btn btn-primary btn-sm btn-icon" onClick={() => handleUpdateComment(comment._id)}><FiCheck /> Save</button>
                            <button className="btn btn-secondary btn-sm btn-icon" onClick={handleCancelEdit}><FiX /> Cancel</button>
                          </div>
                        </div>
                      ) : (
                        <p className="comment-text">{comment.text}</p>
                      )}
                    </div>

                    {user && user.email === comment.userEmail && editingCommentId !== comment._id && (
                      <div className="comment-actions-triggers">
                        <button className="comment-trigger-btn" onClick={() => handleStartEdit(comment)} aria-label="Edit Comment"><FiEdit2 /></button>
                        <button className="comment-trigger-btn delete" onClick={() => handleDeleteComment(comment._id)} aria-label="Delete Comment"><FiTrash2 /></button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right side widgets */}
        <div className="details-sidebar">
          {/* Creator Profile */}
          <div className="sidebar-widget creator-widget glass">
            <h4>Concept Creator</h4>
            <div className="creator-details-row">
              <img 
                src={idea.creatorPhoto || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=150'} 
                alt={idea.creatorName} 
                className="creator-large-avatar"
                onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=150'; }}
              />
              <div>
                <h5>{idea.creatorName}</h5>
                <p className="email">{idea.creatorEmail}</p>
              </div>
            </div>
            <div className="creator-meta-points">
              <div className="meta-point">
                <FiCalendar />
                <span>Published on {new Date(idea.createdAt).toLocaleDateString()}</span>
              </div>
            </div>
          </div>

          {/* Quick Metrics */}
          <div className="sidebar-widget metrics-widget glass">
            <h4>Key Specifications</h4>
            <ul className="metrics-list">
              <li>
                <div className="metric-icon"><FiUsers /></div>
                <div>
                  <span className="metric-label">Target Audience</span>
                  <span className="metric-val">{idea.targetAudience}</span>
                </div>
              </li>
              <li>
                <div className="metric-icon"><FiDollarSign /></div>
                <div>
                  <span className="metric-label">Estimated Budget</span>
                  <span className="metric-val">{idea.budget || 'Not specified'}</span>
                </div>
              </li>
              <li>
                <div className="metric-icon"><FiCpu /></div>
                <div>
                  <span className="metric-label">Category</span>
                  <span className="metric-val">{idea.category}</span>
                </div>
              </li>
            </ul>

            {idea.tags && idea.tags.length > 0 && (
              <div className="tags-widget-row">
                <h5>Tags</h5>
                <div className="tags-row">
                  {idea.tags.map((tag, idx) => (
                    <span key={idx} className="badge">{tag}</span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Comment Delete Confirmation Modal */}
      {deleteConfirmId && (
        <div className="modal-overlay">
          <div className="modal-content delete-modal glass fade-in">
            <div className="delete-modal-icon"><FiTrash2 /></div>
            <h3>Delete Comment</h3>
            <p>Are you sure you want to remove this feedback? This action cannot be undone.</p>
            <div className="modal-actions centered">
              <button className="btn btn-secondary" onClick={() => setDeleteConfirmId(null)}>No, Keep It</button>
              <button className="btn btn-danger" onClick={confirmDeleteComment}>Yes, Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default IdeaDetails;
