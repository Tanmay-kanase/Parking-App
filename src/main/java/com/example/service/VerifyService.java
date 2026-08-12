package com.example.service;

import java.time.Duration;
import java.time.Instant;
import java.time.LocalDateTime;
import java.util.Map;

import org.springframework.stereotype.Service;

import com.example.model.Booking;
import com.example.repository.BookingRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class VerifyService {

    private final BookingRepository bookingRepository;

    public Map<String, String> verifyBooking(String bookingId) {

        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new RuntimeException("Booking not found"));

        Instant now = Instant.now();

        // Too Early
        if (now.isBefore(booking.getStartTime())) {

            long minutes = Duration.between(now, booking.getStartTime())
                    .toMinutes();

            return Map.of(
                    "message",
                    "You are too early. Parking starts in "
                            + minutes
                            + " minutes. Please wait or contact the parking owner.",
                    "status",
                    booking.getStatus());
        }

        // Booking expired before entry
        if (now.isAfter(booking.getEndTime())
                && booking.getStatus() == "BOOKED") {

            booking.setStatus("EXPIRED");
            bookingRepository.save(booking);

            return Map.of(
                    "message",
                    "You were too late for parking. Booking expired and refund will be processed.",
                    "status",
                    "EXPIRED");
        }

        // Entry Scan
        if (booking.getStatus() == "BOOKED") {

            booking.setStatus("ACTIVE");
            booking.setEndTime(now);

            bookingRepository.save(booking);

            return Map.of(
                    "message",
                    "You are welcome.",
                    "status",
                    "ACTIVE");
        }

        // Exit Scan
        if (booking.getStatus() == "ACTIVE") {

            booking.setStatus("COMPLETED");
            booking.setEndTime(now);

            bookingRepository.save(booking);

            return Map.of(
                    "message",
                    "Come again. Bye!",
                    "status",
                    "COMPLETED");
        }

        // Already completed
        if (booking.getStatus() == "COMPLETED") {

            return Map.of(
                    "message",
                    "This booking has already been completed.",
                    "status",
                    "COMPLETED");
        }

        // Already expired
        return Map.of(
                "message",
                "This booking is no longer valid.",
                "status",
                booking.getStatus());
    }
}