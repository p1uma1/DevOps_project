import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import MovieInfo from "./pages/MovieInfo";
import Navbar from "./components/Navbar/Navbar";
// import MoviesPage from "./pages/MoviesPage/MoviesPage";
import LoginPage from "./pages/LoginPage/LoginPage";
import SignupPage from "./pages/SignupPage/SignupPage";
import Movies from "./pages/Movies";
import About from "./pages/AboutPage/About";
import Contact from "./pages/ContactPage/Contact";

function App() {    //cmmnt
  const [user, setUser] = useState(() => {
    // Load user from local storage on initial render
    const storedUser = localStorage.getItem("user");
    return storedUser ? JSON.parse(storedUser) : null;
  });

  useEffect(() => {
    if (user) {
      localStorage.setItem("user", JSON.stringify(user));
    } else {
      localStorage.removeItem("user");
    }
  }, [user]);

  return (
    <Router>
      <div className="App">
        <Navbar user={user} setUser={setUser} />
        <Routes>
          {/* Movies list page */}
          <Route path="/" element={<Movies />} />
          <Route path="/about" element={<About />} />
          <Route path="/movie/:category/:id" element={<MovieInfo />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/login" element={<LoginPage setUser={setUser} />} />
          <Route
            path="/signup"
            element={<SignupPage />}
          />
          {/* Movie details page */}
          <Route
            path="/movie/:id"
            element={<MovieInfo user={user} />}
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
