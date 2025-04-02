import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";



export default function Movies() {
    const [movies, setMovies] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [category, setCategory] = useState("top250"); // Default category
    

    const navigate = useNavigate();

    

    const API_BASE_URL = "https://imdb236.p.rapidapi.com/imdb";

    // API endpoints for different categories
    const categoryEndpoints = {
        top250: "top250-movies",
        boxOffice: "top-box-office",
        popular: "most-popular-movies",
        upcoming: "upcoming-releases?countryCode=US&type=MOVIE",
    };

    // Fetch Movies
    const fetchMovies = async () => {
        setLoading(true);
        setError(null);
        console.log("API Key:", process.env.REACT_APP_RAPID_API_KEY);
        try {
            const res = await axios.get(`${API_BASE_URL}/${categoryEndpoints[category]}`, {
                headers: {
                    "x-rapidapi-key": process.env.REACT_APP_RAPID_API_KEY,
                    "x-rapidapi-host": process.env.REACT_APP_RAPID_API_HOST,
                },
            });

            console.log("API Response:", res.data);
            let movieData = res.data;
            if(category==="upcoming"){
                 movieData = Object.values(res.data).flatMap((item)=>item.titles);
            }

            setMovies(movieData || []);
        } catch (err) {
            console.error("Error fetching movies:", err);
            setError("Failed to fetch movies");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchMovies();
    }, [category]); // Fetch movies when category changes

    // MovieCard Component
    const MovieCard = ({ movie }) => {
        return (
            <div
                style={{
                    width: "250px",
                    borderRadius: "12px",
                    boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.2)",
                    padding: "15px",
                    textAlign: "center",
                    backgroundColor: "#fff",
                    transition: "transform 0.2s",
                    cursor: "pointer",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.05)")}
                onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
                // In your MovieCard component, add:
                onClick={() => navigate(`/movie/${categoryEndpoints[category]}/${movie.id}`)}
                
            >
                <img
                    src={movie.primaryImage || "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQmVq-OmHL5H_5P8b1k306pFddOe3049-il2A&s"}
                    alt={movie.primaryTitle}
                    style={{
                        width: "100%",
                        height: "300px",
                        objectFit: "cover",
                        borderRadius: "10px",
                    }}
                />
                <h3 style={{ fontSize: "1.2rem", margin: "10px 0", color: "#333" }}>
                    {movie.primaryTitle}
                </h3>
                <p style={{ margin: "5px 0", color: "#666" }}>Year: {movie.startYear}</p>
                <p style={{ margin: "5px 0", fontWeight: "bold", color: "#ff9800" }}>
                    ⭐ {movie.averageRating} ({movie.numVotes?.toLocaleString()} votes)
                </p>
                <p style={{ fontSize: "0.9rem", color: "#888" }}>{movie.genres?.join(", ")}</p>
            </div>
        );
    };

    // Filter movies based on search query
    const filteredMovies = movies.filter((movie) =>
        movie.primaryTitle?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div
            style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                padding: "20px",
                backgroundColor: "#f5f5f5",
                minHeight: "100vh",
            }}
        >
            {/* Search Bar */}
            <input
                type="text"
                placeholder="Search movies..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                    width: "60%",
                    padding: "10px",
                    fontSize: "1rem",
                    borderRadius: "8px",
                    border: "1px solid #ccc",
                    marginBottom: "20px",
                }}
            />

            {/* Category Buttons */}
            <div style={{ display: "flex", gap: "10px", marginBottom: "20px" }}>
                {Object.keys(categoryEndpoints).map((key) => (
                    <button
                        key={key}
                        onClick={() => setCategory(key)}
                        style={{
                            padding: "10px 20px",
                            borderRadius: "8px",
                            border: "none",
                            backgroundColor: category === key ? "#ff9800" : "#ddd",
                            color: category === key ? "#fff" : "#333",
                            cursor: "pointer",
                            fontSize: "1rem",
                            fontWeight: "bold",
                            transition: "background 0.3s",
                        }}
                    >
                        {key === "top250-movies" ? "Top 250" :
                         key === "boxOffice" ? "Top Box Office" :
                         key === "popular" ? "Most Popular" : "Upcoming"}
                    </button>
                ))}
            </div>

            {/* Movie List */}
            <div
                style={{
                    display: "flex",
                    flexWrap: "wrap",
                    gap: "20px",
                    justifyContent: "center",
                    width: "100%",
                }}
            >
                {loading && <p style={{ fontSize: "1.5rem", color: "#555" }}>Loading...</p>}
                {error && <p style={{ fontSize: "1.5rem", color: "red" }}>{error}</p>}
                {!loading && !error && filteredMovies.length > 0 ? (
                    filteredMovies.map((movie) => <MovieCard key={movie.id} movie={movie} />)
                ) : (
                    !loading && !error && <p style={{ fontSize: "1.5rem", color: "#555" }}>No movies found.</p>
                )}
            </div>
        </div>
    );
}
