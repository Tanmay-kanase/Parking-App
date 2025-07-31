package com.example.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.example.model.User;
import com.example.repository.UserRepository;
import com.example.service.EmailService;
import com.example.service.UserService;
import com.example.utils.JwtUtil;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;

@RestController
@RequestMapping("/api/users")
public class UserController {

    @Autowired
    private UserService userService;

    @Autowired
    private EmailService emailService;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private BCryptPasswordEncoder passwordEncoder;

    @Autowired
    private JwtUtil jwtUtil;

    @PutMapping("/{userId}")
    public ResponseEntity<User> updateUser(@PathVariable String userId, @RequestBody User updatedUser) {
        User user = userService.updateUser(userId, updatedUser);
        return ResponseEntity.ok(user);
    }

    @GetMapping("/email/{email}")
    public Optional<User> getUserByEmail(@PathVariable String email) {
        return userService.getUserByEmail(email);
    }

    @PostMapping("/signup")
public ResponseEntity<?> signup(@RequestBody Map<String, String> request, HttpServletResponse response) {
    String name = request.get("name");
    String email = request.get("email");
    String password = request.get("password");
    String photo = request.get("photo");
    String role = request.get("role");

    if (email == null || email.isEmpty() || password == null || password.isEmpty()) {
        return ResponseEntity.badRequest().body(Map.of("error", "Email and password are required"));
    }

    if (userRepository.findByEmail(email).isPresent()) {
        return ResponseEntity.status(HttpStatus.CONFLICT).body(Map.of("error", "User already exists"));
    }

    User user = new User();
    user.setUserId(UUID.randomUUID().toString());
    user.setName(name);
    user.setEmail(email);
    user.setPhoto(photo);
    user.setRole(role);
    user.setPassword(passwordEncoder.encode(password)); // Hash password
    try{
      Map<String, Object> result = userService.registerUser(user);
        String token = (String) result.get("token");

        Cookie cookie = new Cookie("token", token);
        cookie.setHttpOnly(true);
        cookie.setSecure(true); // use HTTPS in production
        cookie.setPath("/");
        cookie.setMaxAge(24 * 60 * 60); // 1 day

        response.addCookie(cookie);
        
        System.out.println(result);
        System.out.println(cookie);
        System.out.println("User is signed up");
        return ResponseEntity.ok(result);
        
    } catch (RuntimeException e){
      System.out.println(e.getMessage());
      return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("message", e.getMessage()));
    }
}



    @PostMapping("/login")
public ResponseEntity<?> loginUser(@RequestBody Map<String, String> loginData, HttpServletResponse response) {
    try {
        Map<String, Object> result = userService.loginUser(loginData.get("email"), loginData.get("password"));
        String token = (String) result.get("token");

        Cookie cookie = new Cookie("token", token);
        cookie.setHttpOnly(true);
        cookie.setSecure(true); // use HTTPS in production
        cookie.setPath("/");
        cookie.setMaxAge(24 * 60 * 60); // 1 day

        response.addCookie(cookie);

        System.out.println(result);
        System.out.println(cookie);
        return ResponseEntity.ok(result);
    } catch (RuntimeException e) {
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("message", e.getMessage()));
    }
}

// UserController.java

@GetMapping("/me")
public ResponseEntity<?> getCurrentUser(@CookieValue(value = "token", required = false) String token) {
    if (token == null || token.isEmpty()) {
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                .body(Map.of("message", "No token provided"));
    }

    try {
        String userId = jwtUtil.extractUserId(token);
        User user = userRepository.findById(userId).orElse(null);

        if (user == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("message", "User not found"));
        }

        // Remove sensitive info before sending
        user.setPassword(null);  // to avoid sending password

        return ResponseEntity.ok(user);
    } catch (Exception e) {
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                .body(Map.of("message", "Invalid token"));
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

    @GetMapping("/{userId}")
    public ResponseEntity<User> getUserById(@PathVariable String userId) {
        User user = userService.getUserById(userId);
        return ResponseEntity.ok(user);
    }

    @GetMapping("/{userId}/email")
    public ResponseEntity<String> getEmailByUserId(@PathVariable String userId) {
        try {
            String email = userService.getEmailByUserId(userId);
            return ResponseEntity.ok(email);
        } catch (RuntimeException e) {
            return ResponseEntity.status(404).body(e.getMessage());
        }
    }

    @GetMapping("/getAllUsers")
    public ResponseEntity<List<User>> getAllUsers() {
        return ResponseEntity.ok(userService.getAllUsers());
    }

    @PostMapping("/google-login")
public ResponseEntity<?> googleLogin(@RequestBody Map<String, String> request, HttpServletResponse response) {
    String email = request.get("email");
    String name = request.get("name");
    String photo = request.get("photo");
    String password = request.get("password"); 

    if (email == null || email.isEmpty()) {
        return ResponseEntity.badRequest().body(Map.of("error", "Email and password are required"));
    }

    if (userRepository.findByEmail(email).isPresent()) {
        try{
           Optional<User> userOpt = userRepository.findByEmail(email);
if (userOpt.isEmpty()) {
    return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid credentials");
}

User user = userOpt.get();

// Generate JWT token
String token = jwtUtil.generateToken(user.getUserId(), user.getEmail(), user.getRole());

// Set the cookie
Cookie cookie = new Cookie("token", token);
cookie.setHttpOnly(true);
cookie.setSecure(true); // Use HTTPS in production
cookie.setPath("/");
cookie.setMaxAge(7 * 24 * 60 * 60); // 7 days
response.addCookie(cookie);

// Prepare response body (return token and user details)
Map<String, Object> responseBody = new HashMap<>();
responseBody.put("token", token);
responseBody.put("user", user);  // Make sure User has no sensitive fields or override toString/json serialization if needed

return ResponseEntity.ok(responseBody);

        }catch(RuntimeException e){
           return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("message", e.getMessage()));
        }
    } else {
        User user = new User();
    user.setUserId(UUID.randomUUID().toString());
    user.setName(name);
    user.setEmail(email);
    user.setPhoto(photo);
    user.setRole("user");
    user.setPassword(passwordEncoder.encode(password)); // Hash password
    try{
      Map<String, Object> result = userService.registerUser(user);
        String token = (String) result.get("token");

        Cookie cookie = new Cookie("token", token);
        cookie.setHttpOnly(true);
        cookie.setSecure(true); // use HTTPS in production
        cookie.setPath("/");
        cookie.setMaxAge(24 * 60 * 60); // 1 day

        response.addCookie(cookie);

        System.out.println(result);
        System.out.println(cookie);
        return ResponseEntity.ok(result);
        
    } catch (RuntimeException e){
      return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("message", e.getMessage()));
    }
    }
}




    @DeleteMapping("/delete/{userId}")
    public ResponseEntity<?> deleteUser(@PathVariable String userId) {
        userService.deleteUserById(userId);
        return ResponseEntity.ok(Map.of("message", "User deleted"));
    }

    @PutMapping("/make-admin/{userId}")
    public ResponseEntity<?> makeAdmin(@PathVariable String userId) {
        userService.makeUserAdmin(userId);
        return ResponseEntity.ok(Map.of("message", "User promoted to admin"));
    }

    @PostMapping("/logout")
    public ResponseEntity<?> logoutUser(HttpServletResponse response) {
        // Invalidate the token cookie
        Cookie cookie = new Cookie("token", null);
        cookie.setHttpOnly(true);
        cookie.setSecure(true); // same as login
        cookie.setPath("/");
        cookie.setMaxAge(0); // delete the cookie
    
        response.addCookie(cookie);
    
        return ResponseEntity.ok(Map.of("message", "Logged out successfully"));
    }


}
