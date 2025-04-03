package com.example.demo.controller;


import com.example.demo.dao.UserDAO;
import com.example.demo.dto.ReviewRequest;
import com.example.demo.model.Review;
import com.example.demo.model.User;
import com.example.demo.service.ReviewService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/reviews")
public class ReviewController {

    private ReviewService reviewService;
    private UserDAO userDAO;


    @Autowired
    public ReviewController(ReviewService reviewService, UserDAO userDAO) {
        this.reviewService = reviewService;
        this.userDAO = userDAO;
    }

    @PostMapping("/add")
    public ResponseEntity<Review> addReview(@RequestBody ReviewRequest reviewRequest)
    {
        Optional<User> user = userDAO.findById(reviewRequest.getUserId());
        if(user.isPresent())
        {
            Review savedReview = reviewService.addReview(reviewRequest.getMovieId(),reviewRequest.getReviewText(),user.get());
            return ResponseEntity.ok(savedReview);
        }

        return ResponseEntity.badRequest().build();
    }

    @GetMapping("/{movieId}")
    public ResponseEntity<List<Review>> getReviews(@PathVariable String movieId)
    {
        return ResponseEntity.ok(reviewService.getReviewsByMovieId(movieId));
    }

}
