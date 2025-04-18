package com.example.model;

import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.util.Date;

@Data
@Document(collection = "bookings")
public class Booking {
    @Id
    private String bookingId;
    private String userId;
    private String slotId;
    private String slotNumber;
    private String transactionId;
    private String location;
    private double amountPaid;
    private String paymentStatus;
    private Date startTime; // Time when parking starts
    private Date endTime; // Time when parking ends
    private String paymentMethod;
    private String licensePlate;
    private String vehicleType; // "Car", "Bike", etc.
}
