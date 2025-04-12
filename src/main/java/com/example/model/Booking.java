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
    private String location;
    private String status; // "active", "completed", "cancelled"
    private double amountPaid;
    private String paymentStatus;
}
