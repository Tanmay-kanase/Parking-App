package com.example.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import com.example.model.Feedback;
import com.example.service.FeedbackService;

import java.util.List;

@RestController
@RequestMapping("/api/feedbacks")
public class FeedbackController {

    @Autowired
    private FeedbackService feedbackService;

    @PostMapping
    public Feedback addFeedback(@RequestBody Feedback feedback) {
        return feedbackService.addFeedback(feedback);
    }

    @GetMapping("/user/{userId}")
    public List<Feedback> getFeedbackByUserId(@PathVariable String userId) {
        return feedbackService.getFeedbackByUserId(userId);
    }
}
