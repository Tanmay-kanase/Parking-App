package com.example.controller;

import com.example.model.User;
import com.example.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:3000") // Allow frontend access
public class AuthController {

    @Autowired
    private UserRepository userRepository;

    @PostMapping("/google-signup")
    public String googleSignup(@RequestBody User user) {
        // Check if user already exists
        Optional<User> existingUser = userRepository.findByEmail(user.getEmail());
        if (existingUser.isPresent()) {
            return "User already exists";
        }

        // Save new user
        userRepository.save(user);
        return "User registered successfully";
    }
}
