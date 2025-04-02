import React from 'react';
import { FaFilm, FaUsers, FaStar, FaHeart } from 'react-icons/fa';
import './About.css';

const About = () => {
  return (
    <div className="about-container">
      <section className="hero-section">
        <div className="hero-content">
          <h1>About MovieApp</h1>
          <p>Your trusted source for honest, in-depth movie reviews</p>
        </div>
      </section>

      <section className="mission-section">
        <div className="container">
          <h2>Our Mission</h2>
          <p className="mission-text">
            At MovieApp, we're passionate about cinema and dedicated to helping 
            you find your next favorite movie. Our team of film enthusiasts watches, 
            analyzes, and reviews hundreds of movies each year to bring you the 
            most insightful critiques.
          </p>
        </div>
      </section>

      <section className="features-section">
        <div className="container">
          <h2>Why Choose Us</h2>
          <div className="features-grid">
            <div className="feature-card">
              <FaFilm className="feature-icon" />
              <h3>Comprehensive Reviews</h3>
              <p>Detailed analysis of plot, acting, cinematography and more.</p>
            </div>
            <div className="feature-card">
              <FaUsers className="feature-icon" />
              <h3>Community Driven</h3>
              <p>Join our community of movie lovers and share your thoughts.</p>
            </div>
            <div className="feature-card">
              <FaStar className="feature-icon" />
              <h3>Expert Ratings</h3>
              <p>Our rating system helps you quickly identify must-watch films.</p>
            </div>
            <div className="feature-card">
              <FaHeart className="feature-icon" />
              <h3>Passionate Team</h3>
              <p>We love movies as much as you do - and it shows in our reviews.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="team-section">
        <div className="container">
          <h2>Meet Our Team</h2>
          <div className="team-grid">
            <div className="team-member">
              <div className="member-photo" style={{ backgroundImage: "url('https://randomuser.me/api/portraits/women/44.jpg')" }}></div>
              <h3>Shalani Tharaka</h3>
              <p>Chief Film Critic</p>
            </div>
            <div className="team-member">
              <div className="member-photo" style={{ backgroundImage: "url('https://randomuser.me/api/portraits/men/32.jpg')" }}></div>
              <h3>Saranga Disasekara</h3>
              <p>Editor & Reviewer</p>
            </div>
            <div className="team-member">
              <div className="member-photo" style={{ backgroundImage: "url('https://randomuser.me/api/portraits/women/68.jpg')" }}></div>
              <h3>Dinakshi Priyasad</h3>
              <p>Film Specialist</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;