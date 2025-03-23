package com.example.model;

import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.util.Date;

@Data
@Document(collection = "payments")
public class Payment {
    @Id
    private String paymentId;
    private String userId;
    private String reservationId;
    private double amount;
    private String paymentMethod; // "credit_card", "paypal"
    private String status; // "completed", "failed"
    private Date paymentTime;
}
