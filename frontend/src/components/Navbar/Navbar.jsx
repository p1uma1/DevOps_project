import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./Navbar.css";

function Navbar({ user, setUser }) {
  const [isOpen, setIsOpen] = useState(false);

  // Logout function to clear user state
  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem("user");
  };

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <Link to="/" className="logo">MovieApp</Link>
      </div>

      {/* Hamburger Menu Button (Visible on Mobile) */}
      <button 
        className={`menu-toggle ${isOpen ? "open" : ""}`} 
        onClick={() => setIsOpen(!isOpen)}
      >
        ☰
      </button>

      {/* Navigation Links */}
      <div className={`navbar-links ${isOpen ? "active" : ""}`}>
        <Link to="/" className="nav-link" onClick={() => setIsOpen(false)}>Home</Link>
        <Link to="/about" className="nav-link" onClick={() => setIsOpen(false)}>About</Link>
        <Link to="/contact" className="nav-link" onClick={() => setIsOpen(false)}>Contact</Link>
        
        {user ? (
          <button className="nav-link logout-btn" onClick={handleLogout}>Logout</button>
        ) : (
          <Link to="/login" className="nav-link" onClick={() => setIsOpen(false)}>Login</Link>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
