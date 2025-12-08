package com.example.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.example.model.Booking;
import com.example.service.BookingService;
import com.example.service.EmailService;
import com.example.service.EmailTemplateService;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/bookings")
public class BookingController {

    @Autowired
    private BookingService bookingService;

    @Autowired
    private EmailTemplateService emailTemplateService;

    @Autowired
    private EmailService emailService;

    @PostMapping
    public ResponseEntity<Booking> createBooking(@RequestBody Booking booking) {
        try {
            Booking savedBooking = bookingService.createBooking(booking);

            // Compose the email HTML
            String subject = "Your Parking Slot Booking is Confirmed!";
            String emailContent = emailTemplateService.generateBookingTemplate(savedBooking); // You’ll
                                                                                              // create
                                                                                              // this


            // Send email
            emailService.sendBookingConfirmation(booking.getEmail(), subject, emailContent,
                    savedBooking);

            System.out.println("Booking confirmation email sent to " + booking.getEmail());

            return ResponseEntity.status(HttpStatus.CREATED).body(savedBooking);
        } catch (Exception e) {
            System.out.println("❌ Error during booking: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @GetMapping("/{bookingId}")
    public Optional<Booking> getBookingById(@PathVariable String bookingId) {
        return bookingService.getBookingById(bookingId);
    }

    @GetMapping("/user/{userId}")
    public List<Booking> getBookingsByUserId(@PathVariable String userId) {
        return bookingService.getBookingsByUserId(userId);
    }

    @PutMapping
    public Booking updateBooking(@RequestBody Booking booking) {
        return bookingService.updateBooking(booking);
    }

    @DeleteMapping("/{bookingId}")
    public void deleteBooking(@PathVariable String bookingId) {
        bookingService.deleteBooking(bookingId);
    }
}
