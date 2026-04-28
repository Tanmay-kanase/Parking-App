package com.example.model;

import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;
import java.util.Date;

@Data
@Document(collection = "payments")
public class Payment {
    @Id
    private String paymentId;
    private String userId;
    private String email;
    private String contact;
    private String description;
    private String bank;
    private String wallet;
    private String vpa;
    private String entity;
    private String currency;
    private double amount;
    private Long fee;
    private Long tax;
    @Indexed(unique = true)
    private String transactionId;
    private String paymentMethod; // "credit_card", "paypal"
    private String status; // "completed", "failed"
    private Date paymentTime;
}
