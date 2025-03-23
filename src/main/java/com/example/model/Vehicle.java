package com.example.model;

import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Data
@Document(collection = "vehicles")
public class Vehicle {
    @Id
    private String vehicleId;
    private String userId;
    private String licensePlate;
    private String vehicleType; // "Car", "Bike", etc.
    private String comapany;
}
