import React, { useState } from "react";
import "./SignupPage.css";
import { useNavigate } from "react-router-dom";

const SignupPage = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  const handleGoogleSignup = () => {
    console.log("Google Signup clicked");
    // Add your Google authentication logic here
  };

  const handleSubmit = async(e) => {
    e.preventDefault();
    // console.log("Name:", name);
    // console.log("Email:", email);
    // console.log("Password:", password);
    // Add your form submission logic here

    const user = {
      username:name,
      email,
      password
    };

    try { 
      const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/api/users/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(user),
      });

      if (!response.ok)
      {
        throw new Error("Registration failed");
      }

      const data = await response.json();
      console.log("Registration successful:", data);
      navigate("/login");
    }
    catch (error) {
      console.error("Registration failed:", error);
    }


  };

  return (
    <div className="signup-page">
      <div className="signup-container">
        <h1 className="signup-title">Sign Up</h1>
        <form className="signup-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="name">Full Name</label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your full name"
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Create a password"
              required
            />
          </div>
          <button type="submit" className="signup-button">
            Sign Up
          </button>
        </form>
        <div className="login-prompt">
          Already have an account?{" "}
          <a href="/login" className="login-link">
            Log in here
          </a>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;
