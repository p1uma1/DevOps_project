package com.example.demo.service;

import com.example.demo.model.Review;
import com.example.demo.model.User;

import java.util.List;
//import java.util.Optional;

public interface ReviewService {

    Review addReview(String  movieId, String reviewText, User user);

    List<Review> getReviewsByMovieId(String  movieId);
}
