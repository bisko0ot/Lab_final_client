import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { toast } from 'react-hot-toast';
import Spinner from '../components/Spinner';
import { FiEdit, FiTrash2, FiMessageSquare, FiCalendar, FiDollarSign, FiPlus, FiAlertTriangle, FiX } from 'react-icons/fi';
import './MyIdeas.css';

const MyIdeas = () => {
  const { user } = useAuth();
  const [ideas, setIdeas] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modal states
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  
  // Selected idea for edit/delete
  const [selectedIdea, setSelectedIdea] = useState(null);

  // Edit form states
  const [editTitle, setEditTitle] = useState('');
  const [editCategory, setEditCategory] = useState('');
  const [editShortDesc, setEditShortDesc] = useState('');
  const [editDetailedDesc, setEditDetailedDesc] = useState('');
  const [editProblem, setEditProblem] = useState('');
  const [editSolution, setEditSolution] = useState('');
  const [editAudience, setEditAudience] = useState('');
  const [editBudget, setEditBudget] = useState('');
  const [editImage, setEditImage] = useState('');
  const [editTags, setEditTags] = useState('');

  // Dynamic Title
  useEffect(() => {
    document.title = "IdeaVault | My Startup Ideas";
  }, []);

  const fetchUserIdeas = async () => {
    if (!user?.email) return;
    setLoading(true);
    const token = localStorage.getItem('ideavault-token');
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/ideas/user/${user.email}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (!response.ok) throw new Error("Failed to load your ideas");
      const data = await response.json();
      setIdeas(data);
    } catch (error) {
      console.error(error);
      toast.error("Error retrieving your published ideas.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserIdeas();
  }, [user]);

  // Handle Edit Action
  const openEditModal = (idea) => {
    setSelectedIdea(idea);
    setEditTitle(idea.title);
    setEditCategory(idea.category);
    setEditShortDesc(idea.shortDescription);
    setEditDetailedDesc(idea.detailedDescription);
    setEditProblem(idea.problemStatement);
    setEditSolution(idea.proposedSolution);
    setEditAudience(idea.targetAudience);
    setEditBudget(idea.budget || '');
    setEditImage(idea.imageUrl || '');
    setEditTags(Array.isArray(idea.tags) ? idea.tags.join(', ') : idea.tags || '');
    setIsEditOpen(true);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!editTitle.trim() || !editShortDesc.trim() || !editDetailedDesc.trim() || !editCategory || !editAudience.trim() || !editProblem.trim() || !editSolution.trim()) {
      toast.error("Please fill in all required fields.");
      return;
    }

    const token = localStorage.getItem('ideavault-token');
    const updatedData = {
      title: editTitle,
      category: editCategory,
      shortDescription: editShortDesc,
      detailedDescription: editDetailedDesc,
      problemStatement: editProblem,
      proposedSolution: editSolution,
      targetAudience: editAudience,
      budget: editBudget,
      imageUrl: editImage,
      tags: editTags
    };

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/ideas/${selectedIdea._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(updatedData)
      });

      if (!response.ok) throw new Error("Failed to update idea");
      
      toast.success("Startup idea updated successfully!");
      setIsEditOpen(false);
      fetchUserIdeas();
    } catch (error) {
      console.error(error);
      toast.error("Could not save changes.");
    }
  };

  // Handle Delete Action
  const openDeleteModal = (idea) => {
    setSelectedIdea(idea);
    setIsDeleteOpen(true);
  };

  const handleDelete = async () => {
    if (!selectedIdea) return;
    const token = localStorage.getItem('ideavault-token');
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/ideas/${selectedIdea._id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) throw new Error("Failed to delete idea");
      
      toast.success("Idea removed successfully.");
      setIsDeleteOpen(false);
      fetchUserIdeas();
    } catch (error) {
      console.error(error);
      toast.error("Could not delete idea.");
    }
  };

  return (
    <div className="my-ideas-page-container fade-in">
      <div className="my-ideas-header">
        <div>
          <h1 className="title-gradient">My Ideas</h1>
          <p className="subtitle">Manage the startup concepts you have proposed, view interaction statistics, and edit drafts.</p>
        </div>
        <Link to="/add-idea" className="btn btn-primary"><FiPlus /> Publish Idea</Link>
      </div>

      {loading ? (
        <Spinner />
      ) : ideas.length === 0 ? (
        <div className="empty-ideas-state">
          <h3>You haven't shared any ideas yet</h3>
          <p>Bring your startup concepts to life. Share your first idea now!</p>
          <Link to="/add-idea" className="btn btn-primary">Submit First Idea</Link>
        </div>
      ) : (
        <div className="my-ideas-table-container glass">
          <table className="ideas-table">
            <thead>
              <tr>
                <th>Idea Details</th>
                <th>Category</th>
                <th>Feedback Count</th>
                <th>Budget</th>
                <th>Published Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {ideas.map((idea) => (
                <tr key={idea._id}>
                  <td>
                    <div className="table-idea-meta">
                      <img 
                        src={idea.imageUrl || 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=150'} 
                        alt={idea.title} 
                        className="table-idea-img"
                        onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=150'; }}
                      />
                      <div>
                        <Link to={`/ideas/${idea._id}`} className="table-idea-title">{idea.title}</Link>
                        <p className="table-idea-short-desc">{idea.shortDescription}</p>
                      </div>
                    </div>
                  </td>
                  <td><span className="badge badge-secondary">{idea.category}</span></td>
                  <td>
                    <span className="table-comments-val"><FiMessageSquare /> {idea.commentCount || 0}</span>
                  </td>
                  <td>
                    <span className="table-budget-val">{idea.budget ? `$${idea.budget}` : 'N/A'}</span>
                  </td>
                  <td>
                    <span className="table-date-val"><FiCalendar /> {new Date(idea.createdAt).toLocaleDateString()}</span>
                  </td>
                  <td>
                    <div className="table-actions">
                      <button 
                        className="table-action-btn edit-btn" 
                        onClick={() => openEditModal(idea)}
                        title="Edit Idea"
                      >
                        <FiEdit />
                      </button>
                      <button 
                        className="table-action-btn delete-btn" 
                        onClick={() => openDeleteModal(idea)}
                        title="Delete Idea"
                      >
                        <FiTrash2 />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* EDIT MODAL */}
      {isEditOpen && selectedIdea && (
        <div className="modal-overlay">
          <div className="modal-content glass fade-in">
            <div className="modal-header">
              <h3>Edit Startup Idea</h3>
              <button className="modal-close-btn" onClick={() => setIsEditOpen(false)}><FiX size={20} /></button>
            </div>
            
            <form onSubmit={handleUpdate} className="modal-body-form">
              <div className="modal-form-grid">
                <div className="form-group">
                  <label className="form-label" htmlFor="edit-title">Idea Title *</label>
                  <input
                    id="edit-title"
                    type="text"
                    className="form-input"
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="edit-category">Category *</label>
                  <select
                    id="edit-category"
                    className="form-select"
                    value={editCategory}
                    onChange={(e) => setEditCategory(e.target.value)}
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

                <div className="form-group full-width">
                  <label className="form-label" htmlFor="edit-shortDesc">Short Pitch *</label>
                  <input
                    id="edit-shortDesc"
                    type="text"
                    maxLength={150}
                    className="form-input"
                    value={editShortDesc}
                    onChange={(e) => setEditShortDesc(e.target.value)}
                    required
                  />
                </div>

                <div className="form-group full-width">
                  <label className="form-label" htmlFor="edit-detailedDesc">Detailed Description *</label>
                  <textarea
                    id="edit-detailedDesc"
                    className="form-textarea"
                    value={editDetailedDesc}
                    onChange={(e) => setEditDetailedDesc(e.target.value)}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="edit-problem">Problem Statement *</label>
                  <textarea
                    id="edit-problem"
                    className="form-textarea"
                    value={editProblem}
                    onChange={(e) => setEditProblem(e.target.value)}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="edit-solution">Proposed Solution *</label>
                  <textarea
                    id="edit-solution"
                    className="form-textarea"
                    value={editSolution}
                    onChange={(e) => setEditSolution(e.target.value)}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="edit-audience">Target Audience *</label>
                  <input
                    id="edit-audience"
                    type="text"
                    className="form-input"
                    value={editAudience}
                    onChange={(e) => setEditAudience(e.target.value)}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="edit-budget">Estimated Budget ($)</label>
                  <div className="input-with-icon">
                    <span className="input-icon"><FiDollarSign /></span>
                    <input
                      id="edit-budget"
                      type="text"
                      className="form-input"
                      value={editBudget}
                      onChange={(e) => setEditBudget(e.target.value)}
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="edit-image">Pitch Image URL</label>
                  <input
                    id="edit-image"
                    type="url"
                    className="form-input"
                    value={editImage}
                    onChange={(e) => setEditImage(e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="edit-tags">Tags (comma separated)</label>
                  <input
                    id="edit-tags"
                    type="text"
                    className="form-input"
                    value={editTags}
                    onChange={(e) => setEditTags(e.target.value)}
                  />
                </div>
              </div>

              <div className="modal-actions">
                <button type="button" className="btn btn-secondary" onClick={() => setIsEditOpen(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">Save Changes</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DELETE CONFIRMATION MODAL */}
      {isDeleteOpen && selectedIdea && (
        <div className="modal-overlay">
          <div className="modal-content delete-modal glass fade-in">
            <div className="delete-modal-icon"><FiAlertTriangle /></div>
            <h3>Delete Idea</h3>
            <p>Are you sure you want to remove <strong>"{selectedIdea.title}"</strong>? This action will permanently delete the concept and all associated comments. It cannot be undone.</p>
            <div className="modal-actions centered">
              <button className="btn btn-secondary" onClick={() => setIsDeleteOpen(false)}>No, Keep It</button>
              <button className="btn btn-danger" onClick={handleDelete}>Yes, Delete Idea</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyIdeas;
