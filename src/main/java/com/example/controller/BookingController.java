package com.example.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import com.example.model.Booking;
import com.example.service.BookingService;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/bookings")
public class BookingController {

    @Autowired
    private BookingService bookingService;

    @PostMapping
    public Booking createBooking(@RequestBody Booking booking) {
        return bookingService.createBooking(booking);
    }

    @GetMapping("/{bookingId}")
    public Optional<Booking> getBookingById(@PathVariable String bookingId) {
        return bookingService.getBookingById(bookingId);
    }

    @GetMapping("/user/{userId}")
    public Optional<Booking> getBookingsByUserId(@PathVariable String userId) {
        return bookingService.getBookingsByUserId(userId);
    }

    @GetMapping("/status/{status}")
    public List<Booking> getBookingsByStatus(@PathVariable String status) {
        return bookingService.getBookingsByStatus(status);
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
