package com.example.demo.service;

import com.example.demo.dao.ReviewRepository;
import com.example.demo.model.Review;
import com.example.demo.model.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;


@Service
public class ReviewServiceImpl implements ReviewService{


    private ReviewRepository reviewRepository;


    @Autowired
    public ReviewServiceImpl(ReviewRepository reviewRepository) {
        this.reviewRepository = reviewRepository;
    }

    @Override
    public Review addReview(String movieId, String reviewText, User user) {
        Review review = new Review(movieId,user,reviewText,LocalDateTime.now());
        return reviewRepository.save(review);
    }

    @Override
    public List<Review> getReviewsByMovieId(String movieId) {
        return reviewRepository.findByMovieId(movieId);
    }
}
