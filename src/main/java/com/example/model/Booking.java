package com.example.model;

import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.Instant;
import java.time.LocalDateTime;
import java.util.Date;

@Data
@Document(collection = "bookings")
public class Booking {
    @Id
    private String bookingId;
    private String userId;
    private String slotId;
    private String locationId;
    private String email;
    private String slotNumber;
    private String transactionId;
    private String location;
    private double amountPaid;
    private String paymentStatus;
    private Instant startTime;
    private Instant endTime;// Time when parking ends
    private String paymentMethod;
    private String licensePlate;
    private String vehicleType; // "Car", "Bike", etc.
    private String status = "ACTIVE";
}
