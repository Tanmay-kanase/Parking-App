package com.example.controller;

import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.service.VerifyService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/verify")
@RequiredArgsConstructor
public class VerifyController {

    private final VerifyService verifyService;

    @PostMapping("/{bookingId}")
    public ResponseEntity<Map<String, String>> verifyBooking(
            @PathVariable String bookingId) {

        Map<String, String> response = verifyService.verifyBooking(bookingId);

        return ResponseEntity.ok(response);
    }
}