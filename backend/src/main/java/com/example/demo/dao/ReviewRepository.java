package com.example.demo.dao;

import com.example.demo.model.Review;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ReviewRepository extends JpaRepository<Review, Long> {


    //fetch reviews by movieId
    List<Review> findByMovieId(String  movieId);

}
