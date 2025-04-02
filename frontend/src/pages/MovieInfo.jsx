import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
// import Rating from "../components/Rating/Rating";
import "./MovieInfo.css";
import axios from "axios";

const MovieInfo = () => {
  const { category, id } = useParams();
  const [movie, setMovie] = useState(null);
  const [movies, setMovies] = useState([]);
  const navigate = useNavigate();
  const [review, setReview] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const API_BASE_URL = "https://imdb236.p.rapidapi.com/imdb";

  // Fetch Movies
  const fetchMovies = async () => {
    setLoading(true);
    setError(null);
    console.log("API Key:", process.env.REACT_APP_RAPID_API_KEY);
    try {
      const res = await axios.get(`${API_BASE_URL}/${category}`, {
        headers: {
          "x-rapidapi-key": process.env.REACT_APP_RAPID_API_KEY,
          "x-rapidapi-host": process.env.REACT_APP_RAPID_API_HOST,
        },
      });

      console.log("API Response:", res.data);
      let movieData = res.data;
      if (category === "upcoming") {
        movieData = Object.values(res.data).flatMap((item) => item.titles);
      }

      setMovies(movieData || []);
      
      // Find the specific movie by ID
      const foundMovie = movieData.find(m => m.id === id);
      setMovie(foundMovie);
    } catch (err) {
      console.error("Error fetching movies:", err);
      setError("Failed to fetch movies");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMovies();
  }, [category, id]); // Add id as a dependency

  const handleReviewSubmit = (e) => {
    e.preventDefault();
    // Here you would typically send the review to your backend
    console.log("Review submitted:", review);
    setReview("");
    alert("Review submitted successfully!");
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading movie information...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <h2>Error: {error}</h2>
        <button onClick={() => navigate(-1)} className="back-button">
          ← Back to Movies
        </button>
      </div>
    );
  }

  if (!movie) {
    return (
      <div className="not-found">
        <h2>Movie not found</h2>
        <button onClick={() => navigate(-1)} className="back-button">
          ← Back to Movies
        </button>
      </div>
    );
  }

  return (
    <div className="movie-details-container">
      <button onClick={() => navigate(-1)} className="back-button">
        ← Back to Movies
      </button>

      <div className="movie-content">
        <div className="movie-poster">
          {movie.primaryImage ? (
            <img
              src={movie.primaryImage}
              alt={`${movie.primaryTitle} poster`}
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = "https://via.placeholder.com/300x450?text=No+Image";
              }}
            />
          ) : (
            <img
              src="https://via.placeholder.com/300x450?text=No+Image"
              alt="No poster available"
            />
          )}
        </div>

        <div className="movie-info">
          <h1>{movie.primaryTitle}</h1>
          {movie.originalTitle && movie.originalTitle !== movie.primaryTitle && (
            <p className="original-title">{movie.originalTitle}</p>
          )}

          <div className="movie-meta">
            {movie.startYear && <span><strong>Year:</strong> {movie.startYear}</span>}
            {movie.releaseDate && <span><strong>Year:</strong> {movie.releaseDate}</span>}
            {movie.averageRating && <span><strong>Rating:</strong> ⭐ {movie.averageRating}</span>}
            {movie.numVotes && <span><strong>Votes:</strong> {movie.numVotes.toLocaleString()}</span>}
            {movie.genres && <span><strong>Genres:</strong> {movie.genres.join(", ")}</span>}
            {movie.interests && <span><strong>Interests:</strong> {movie.interests.join(", ")}</span>}
          </div>

          <div className="synopsis">
            <h3>Description</h3>
            <p>{movie.description || "No Description available."}</p>
          </div>
        </div>
      </div>

      <div className="review-section">
        <h3>Write a Review</h3>
        <form onSubmit={handleReviewSubmit}>
          <textarea
            value={review}
            onChange={(e) => setReview(e.target.value)}
            placeholder="Share your thoughts about this movie..."
            required
          />
          <button type="submit">Submit Review</button>
        </form>
      </div>
    </div>
  );
};

export default MovieInfo;