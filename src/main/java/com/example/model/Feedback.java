package com.example.model;

import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.util.Date;

@Data
@Document(collection = "feedbacks")
public class Feedback {
    @Id
    private String feedbackId;
    private String userId;
    private String slotId;
    private double rating; // 1-5
    private String comment;
    private Date createdAt;
}
