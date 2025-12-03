package com.example.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.example.model.Booking;
import com.example.repository.BookingRepository;

import java.util.List;
import java.util.Optional;

@Service
public class BookingService {

    @Autowired
    private BookingRepository bookingRepository;

    public Booking createBooking(Booking booking) {
        return bookingRepository.save(booking);
    }

    public Optional<Booking> getBookingById(String bookingId) {
        return bookingRepository.findById(bookingId);
    }

    public Booking updateBooking(Booking booking) {
        return bookingRepository.save(booking);
    }

    public void deleteBooking(String bookingId) {
        bookingRepository.deleteById(bookingId);
    }

    public List<Booking> getBookingsByUserId(String userId) {
        return bookingRepository.findAllByUserId(userId);
    }

}
