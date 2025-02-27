package com.example.demo.controller;

import com.example.demo.dto.LoginRequest;
import jakarta.servlet.http.HttpServletResponse;
import com.example.demo.model.User;
import com.example.demo.service.JWTService;
import com.example.demo.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import jakarta.servlet.http.Cookie;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.time.Duration;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/users")
public class UserController {

    private final UserService userService;
    private final JWTService jwtService;

    private final PasswordEncoder passwordEncoder;

    @Autowired
    public UserController(UserService userService, JWTService jwtService, PasswordEncoder passwordEncoder) {
        this.userService = userService;
        this.jwtService = jwtService;
        this.passwordEncoder = passwordEncoder;
    }





    @PostMapping("/register")
    public ResponseEntity<User> registerUser(@RequestBody User user)
    {
        User savedUser = userService.saveUser(user);
        return ResponseEntity.ok(savedUser);

    }

    @GetMapping("/{username}")
    public ResponseEntity<User> getUserByUsername(@PathVariable String username)
    {
        return userService.findByUsernameOrEmail(username)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());

    }


    @PostMapping("/login")
    public ResponseEntity<?> loginUser(@RequestBody LoginRequest loginRequest, HttpServletResponse response) {
        Optional<User> userOptional = userService.findByUsernameOrEmail(loginRequest.getIdentifier());

        if (userOptional.isEmpty()) {
            return ResponseEntity.status(404).body("User not found");
        }

        User user = userOptional.get();
        if (!passwordEncoder.matches(loginRequest.getPassword(), user.getPassword())) {
            return ResponseEntity.status(401).body("Invalid credentials");
        }

        String token = jwtService.generateToken(user.getUsername());

        Cookie cookie = new Cookie("jwt", token);
        cookie.setHttpOnly(true);
        cookie.setSecure(true);
        cookie.setPath("/");
        cookie.setMaxAge(60 * 60 * 24); // 1 day expiry

        response.addCookie(cookie);
        return ResponseEntity.ok(user);
    }

    @PostMapping("/logout")
    public ResponseEntity<?> logoutUser(@RequestHeader("Authorization") String token) {
        String jwt = token.replace("Bearer ", "");
        // Example: blacklistService.addToBlacklist(jwt);
        return ResponseEntity.ok("Logged out successfully");
    }



}
