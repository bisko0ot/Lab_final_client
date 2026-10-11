import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Spinner from '../components/Spinner';
import { FiArrowRight, FiActivity, FiLayers, FiUsers, FiTrendingUp, FiMessageSquare, FiCpu, FiFolder, FiCheckCircle, FiDollarSign } from 'react-icons/fi';
import { BsArrowLeftCircle, BsArrowRightCircle } from 'react-icons/bs';
import './Home.css';

const Home = () => {
  const [trendingIdeas, setTrendingIdeas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentSlide, setCurrentSlide] = useState(0);
  const navigate = useNavigate();

  // Dynamic Title
  useEffect(() => {
    document.title = "IdeaVault | Share & Validate Startup Ideas";
  }, []);

  // Slide Banner Data
  const slides = [
    {
      title: "Shape the Future of Innovation",
      description: "Submit your startup concepts, outline problems, and receive real-time constructive feedback from developers and entrepreneurs.",
      image: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?q=80&w=1200",
      cta: "Explore Ideas"
    },
    {
      title: "Validate Before You Build",
      description: "Save time and resources. Gather audience reactions, vote on utility, and refine your proposed solution before writing a single line of code.",
      image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=1200",
      cta: "Pitch Your Idea"
    },
    {
      title: "Collaborate with Builders",
      description: "Find co-founders, early adopters, and technical experts who resonate with your vision and want to collaborate on implementation.",
      image: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=1200",
      cta: "Browse Categories"
    }
  ];

  // Auto-slide interval
  useEffect(() => {
    const slideInterval = setInterval(() => {
      setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
    }, 6000);
    return () => clearInterval(slideInterval);
  }, []);

  const nextSlide = () => {
    setCurrentSlide(currentSlide === slides.length - 1 ? 0 : currentSlide + 1);
  };

  const prevSlide = () => {
    setCurrentSlide(currentSlide === 0 ? slides.length - 1 : currentSlide - 1);
  };

  // Fetch Trending Ideas (limit 6)
  useEffect(() => {
    const fetchTrending = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/ideas/trending`);
        if (!response.ok) throw new Error("Failed to load trending ideas");
        const data = await response.json();
        setTrendingIdeas(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchTrending();
  }, []);

  const categories = [
    { name: "Tech", count: "Software, SaaS", icon: <FiCpu /> },
    { name: "Health", count: "MedTech, BioTech", icon: <FiActivity /> },
    { name: "AI", count: "ML, Deep Learning", icon: <FiLayers /> },
    { name: "Education", count: "EdTech, LMS", icon: <FiUsers /> },
  ];

  return (
    <div className="home-page fade-in">
      {/* 1. CAROUSEL BANNER SECTION */}
      <section className="banner-carousel">
        {slides.map((slide, idx) => (
          <div key={idx} className={`slide ${currentSlide === idx ? 'active' : ''}`}>
            <img src={slide.image} alt={slide.title} className="slide-bg" />
            <div className="slide-content-overlay">
              <div className="slide-text">
                <h2>{slide.title}</h2>
                <p>{slide.description}</p>
                <Link to="/ideas" className="btn btn-primary btn-lg banner-cta">
                  {slide.cta} <FiArrowRight />
                </Link>
              </div>
            </div>
          </div>
        ))}
        {/* Navigation arrows */}
        <button className="carousel-control prev" onClick={prevSlide} aria-label="Previous Slide">
          <BsArrowLeftCircle />
        </button>
        <button className="carousel-control next" onClick={nextSlide} aria-label="Next Slide">
          <BsArrowRightCircle />
        </button>
        {/* Pagination Dots */}
        <div className="carousel-dots">
          {slides.map((_, idx) => (
            <button
              key={idx}
              className={`dot ${currentSlide === idx ? 'active' : ''}`}
              onClick={() => setCurrentSlide(idx)}
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>
      </section>

      {/* 2. TRENDING IDEAS SECTION */}
      <section className="home-section container">
        <div className="section-header">
          <div>
            <span className="section-badge">Fast-Growing</span>
            <h2>Trending Concepts</h2>
          </div>
          <Link to="/ideas" className="btn btn-outline btn-sm">
            View All <FiArrowRight />
          </Link>
        </div>

        {loading ? (
          <Spinner />
        ) : trendingIdeas.length === 0 ? (
          <div className="empty-ideas-state">
            <p>No startup concepts published yet. Be the first to share one!</p>
            <Link to="/add-idea" className="btn btn-primary">Publish Idea</Link>
          </div>
        ) : (
          <div className="grid-3">
            {trendingIdeas.map((idea) => (
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
                        <span>Budget: {idea.budget}</span>
                      </div>
                    )}
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
      </section>

      {/* 3. EXTRA SECTION 1: CATEGORY EXPLORER */}
      <section className="home-section categories-section">
        <div className="container">
          <div className="section-header centered">
            <span className="section-badge">Browse Sectors</span>
            <h2>Explore by Category</h2>
            <p className="section-desc">Search through ideas tailored to specific domains, markets, and technological platforms.</p>
          </div>

          <div className="categories-grid">
            {categories.map((cat, idx) => (
              <div 
                key={idx} 
                className="category-card glass"
                onClick={() => navigate(`/ideas?category=${cat.name}`)}
              >
                <div className="cat-card-icon">{cat.icon}</div>
                <h3>{cat.name}</h3>
                <p>{cat.count}</p>
                <span className="cat-card-action">Browse sector <FiArrowRight /></span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. EXTRA SECTION 2: INNOVATION STATISTICS */}
      <section className="home-section stats-section container">
        <div className="stats-box glass">
          <div className="stats-header">
            <h2>IdeaVault Ecosystem</h2>
            <p>Our platform enables rapid validation and community assessment of emerging concepts.</p>
          </div>
          
          <div className="stats-grid">
            <div className="stat-item">
              <div className="stat-icon"><FiLayers /></div>
              <span className="stat-number">500+</span>
              <span className="stat-label">Concepts Posted</span>
            </div>
            
            <div className="stat-item">
              <div className="stat-icon"><FiMessageSquare /></div>
              <span className="stat-number">12k+</span>
              <span className="stat-label">Validating Feedbacks</span>
            </div>
            
            <div className="stat-item">
              <div className="stat-icon"><FiUsers /></div>
              <span className="stat-number">3,200+</span>
              <span className="stat-label">Registered Innovators</span>
            </div>

            <div className="stat-item">
              <div className="stat-icon"><FiCheckCircle /></div>
              <span className="stat-number">94%</span>
              <span className="stat-label">Validation Accuracy</span>
            </div>
          </div>
        </div>
      </section>

      {/* 5. HOW IT WORKS SECTION */}
      <section className="home-section how-it-works-section container">
        <div className="section-header centered">
          <span className="section-badge">Simple Process</span>
          <h2>How IdeaVault Works</h2>
          <p className="section-desc">Three simple steps to take your startup concept from an idea to community-validated pitch.</p>
        </div>

        <div className="how-steps-grid">
          <div className="how-step glass">
            <div className="step-number">01</div>
            <div className="step-icon"><FiTrendingUp /></div>
            <h3>Submit Your Idea</h3>
            <p>Create an account and publish your startup concept with a clear problem statement, proposed solution, target audience, and estimated budget.</p>
          </div>
          <div className="how-step glass">
            <div className="step-number">02</div>
            <div className="step-icon"><FiMessageSquare /></div>
            <h3>Collect Feedback</h3>
            <p>The community reviews your concept and posts detailed, constructive comments — helping you identify blind spots and refine your approach.</p>
          </div>
          <div className="how-step glass">
            <div className="step-number">03</div>
            <div className="step-icon"><FiCheckCircle /></div>
            <h3>Validate & Iterate</h3>
            <p>Use the feedback to sharpen your idea before building anything. Edit your concept directly from your dashboard and share the improved version.</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
