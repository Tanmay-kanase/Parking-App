package com.example.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.example.model.User;
import com.example.service.EmailService;
import com.example.service.UserService;
import com.example.utils.JwtUtil;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "http://localhost:5173")
public class UserController {

    @Autowired
    private UserService userService;

    @Autowired
    private EmailService emailService;

    @Autowired
    private JwtUtil jwtUtil;

    @PutMapping("/{userId}") // Handles PUT requests to update user
    public ResponseEntity<User> updateUser(@PathVariable String userId, @RequestBody User updatedUser) {
        User user = userService.updateUser(userId, updatedUser);
        return ResponseEntity.ok(user);
    }

    @GetMapping("/email/{email}")
    public Optional<User> getUserByEmail(@PathVariable String email) {
        return userService.getUserByEmail(email);
    }

    @PostMapping("/signup")
    public ResponseEntity<?> registerUser(@RequestBody User user) {
        try {
            Map<String, String> result = userService.registerUser(user);
            return ResponseEntity.ok(result);
        } catch (RuntimeException e) {
            System.err.println(e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("message", e.getMessage()));
        }
    }

    // Endpoint to get email by userId
    @GetMapping("/{userId}/email")
    public ResponseEntity<String> getEmailByUserId(@PathVariable String userId) {
        try {
            String email = userService.getEmailByUserId(userId);
            return ResponseEntity.ok(email); // Return email
        } catch (RuntimeException e) {
            return ResponseEntity.status(404).body(e.getMessage()); // User not found
        }
    }

    @PostMapping("/google-signup")
    public ResponseEntity<?> signupUser(@RequestBody User user) {
        String userId = userService.saveUser(user);
        String token = jwtUtil.generateToken(userId, user.getEmail(), user.getRole());

        return ResponseEntity.ok(Map.of("userId", userId, "token", token));
    }

    @GetMapping("/{userId}")
    public ResponseEntity<User> getUserById(@PathVariable String userId) {
        User user = userService.getUserById(userId);
        return ResponseEntity.ok(user);
    }

    @PostMapping("/login")
    public ResponseEntity<?> loginUser(@RequestBody Map<String, String> loginData) {
        try {
            Map<String, String> result = userService.loginUser(loginData.get("email"), loginData.get("password"));
            return ResponseEntity.ok(result);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("message", e.getMessage()));
        }
    }

    @PostMapping("/send-otp")
    public ResponseEntity<?> sendOtp(@RequestBody Map<String, String> request) {
        String email = request.get("email");
        if (email == null || email.isEmpty()) {
            return ResponseEntity.badRequest().body("Email is required");
        }

        try {
            emailService.sendOtpEmail(email);
            return ResponseEntity.ok(Map.of("message", "OTP sent successfully"));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Failed to send OTP"));
        }
    }

    @PostMapping("/verify-otp")
    public ResponseEntity<?> verifyOtp(@RequestBody Map<String, String> request) {
        String email = request.get("email");
        String otp = request.get("otp");

        if (email == null || otp == null) {
            return ResponseEntity.badRequest().body("Email and OTP are required");
        }

        boolean isValid = emailService.verifyOtp(email, otp);
        if (isValid) {
            emailService.clearOtp(email);
            return ResponseEntity.ok(Map.of("verified", true, "message", "OTP verified"));

        } else {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("success", false, "message", "Invalid OTP"));
        }
    }
}
