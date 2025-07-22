package com.example.model;

import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.util.List;

@Data
@Document(collection = "users")
public class User {
    @Id
    private String userId;
    private String name;
    private String email;
    private String password;
    private String phone;
    private String photo;
    private String role;  // "user", "parking_host"
    private List<String> vehicles; // List of vehicle IDs
}
