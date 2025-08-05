package com.example.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import com.example.model.User;
import com.example.repository.UserRepository;
import com.example.utils.JwtUtil;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private BCryptPasswordEncoder passwordEncoder;

    @Autowired
    private JwtUtil jwtUtil;

    public Optional<User> getUserByEmail(String email) {
        Optional<User> User = userRepository.findByEmail(email);
        return User;

    }

    public Map<String, Object> registerUser(User user) {
        if (userRepository.existsByEmail(user.getEmail())) {
            throw new RuntimeException("Email already exists");
        }

        user.setPassword(passwordEncoder.encode(user.getPassword()));
        User savedUser = userRepository.save(user);

        String token = jwtUtil.generateToken(savedUser.getUserId(), savedUser.getEmail(), savedUser.getRole());

        return Map.of(
                "user", savedUser,
                "token", token);
    }

    public User getUserById(String userId) {
        return userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + userId));
    }

    public String saveUser(User user) {
        Optional<User> existingUser = userRepository.findByEmail(user.getEmail());

        if (existingUser.isPresent()) {
            return existingUser.get().getUserId(); // Return existing user's ID
        } else {
            User newUser = userRepository.save(user);
            return newUser.getUserId(); // Return new user's ID
        }
    }

   

public Map<String, Object> loginUser(String email, String password) {
    Optional<User> userOpt = userRepository.findByEmail(email);
    if (userOpt.isEmpty()) {
        throw new RuntimeException("User not found");
    }

    User user = userOpt.get();

    System.out.println("Raw password: " + password);
System.out.println("Encoded password from DB: " + user.getPassword());
System.out.println("Matches: " + passwordEncoder.matches(password, user.getPassword()));

    // ✅ THIS IS THE CORRECT COMPARISON
    if (!passwordEncoder.matches(password, user.getPassword())) {
        
        throw new RuntimeException("Wrong password");
    }

    String token = jwtUtil.generateToken(user.getUserId(), user.getEmail(), user.getRole());

    return Map.of(
        "user", user,
        "token", token
    );
}


    public User updateUser(String userId, User updatedUser) {
        Optional<User> existingUser = userRepository.findById(userId);
        if (existingUser.isPresent()) {
            User user = existingUser.get();
            user.setName(updatedUser.getName());
            user.setEmail(updatedUser.getEmail());
            user.setPhone(updatedUser.getPhone());
            user.setRole(updatedUser.getRole());
            return userRepository.save(user);
        } else {
            throw new RuntimeException("User not found with ID: " + userId);
        }
    }

    // Method to retrieve the user's email by userId
    public String getEmailByUserId(String userId) {
        User user = userRepository.findByUserId(userId);
        if (user != null) {
            return user.getEmail(); // Return email if user found
        }
        throw new RuntimeException("User not found with userId: " + userId); // Handle case where user is not found
    }

    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    public void deleteUserById(String userId) {
        userRepository.deleteById(userId);
    }

    public void makeUserAdmin(String userId) {
        User user = userRepository.findById(userId).orElseThrow();
        user.setRole("admin");
        userRepository.save(user);
    }

}
