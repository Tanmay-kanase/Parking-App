package com.example.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "users") // MongoDB collection name
public class User {
    @Id
    private String id;
    private String username;
    private String email;
    private String profilePhoto;
    private String providerId;

    // No-Args Constructor
    public User() {
    }

    // All-Args Constructor
    public User(String id, String username, String email, String profilePhoto, String providerId) {
        this.id = id;
        this.username = username;
        this.email = email;
        this.profilePhoto = profilePhoto;
        this.providerId = providerId;
    }

    // Getters and Setters
    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getProfilePhoto() {
        return profilePhoto;
    }

    public void setProfilePhoto(String profilePhoto) {
        this.profilePhoto = profilePhoto;
    }

    public String getProviderId() {
        return providerId;
    }

    public void setProviderId(String providerId) {
        this.providerId = providerId;
    }
}
