package com.example.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.retry.annotation.Retryable;
import org.springframework.retry.annotation.Backoff;
import com.example.dto.CompleteBookingRequest;
import com.example.model.Booking;
import com.example.model.ParkingHistory;
import com.example.model.ParkingSlot;
import com.example.model.Payment;
import com.example.repository.BookingRepository;
import com.example.repository.ParkingSlotRepository;
import com.example.repository.PaymentRepository;
import com.example.utils.RazorpayUtils;

import java.time.LocalDateTime;
import java.util.Date;
import java.util.List;
import java.util.Optional;

@Service
public class BookingService {

    @Value("${razorpay.key.secret}")
    private String keySecret;

    @Autowired
    private BookingRepository bookingRepository;

    @Autowired
    private ParkingHistoryService parkingHistoryService;

    @Autowired
    private PaymentService paymentService;

    @Autowired
    private ParkingSlotService parkingSlotService;

    @Autowired
    private EmailTemplateService emailTemplateService;

    @Autowired
    private PaymentRepository paymentRepository;
    @Autowired
    private EmailService emailService;

    @Autowired
    private ParkingSlotRepository parkingSlotRepository;

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

    @Retryable(value = { Exception.class }, maxAttempts = 3, backoff = @Backoff(delay = 2000))
    @Transactional
    public Booking completeBooking(CompleteBookingRequest request) {

        boolean isValid = RazorpayUtils.verifySignature(
                request.orderId,
                request.paymentId,
                request.signature,
                keySecret);

        if (!isValid) {
            throw new RuntimeException("Invalid payment signature");
        }

        Optional<Payment> existing = paymentRepository.findByTransactionId(request.transactionId);

        if (existing.isPresent()) {
            throw new RuntimeException("Duplicate payment detected");
        }

        boolean locked = parkingSlotRepository.lockSlot(request.slotId);

        if (!locked) {
            throw new RuntimeException("Slot already booked by another user");
        }

        // 2. Save Parking History
        ParkingHistory history = new ParkingHistory();
        history.setUserId(request.userId);
        history.setVehicleId(request.vehicleNumber);
        history.setSlotId(request.slotNumber);
        history.setParking_lot_id(request.location);
        history.setPaymentId(request.transactionId);
        history.setEntryTime(request.startTime);
        history.setExitTime(request.endTime);
        history.setAmountPaid(String.valueOf(request.amount));

        parkingHistoryService.saveParkingHistory(history);

        // 3. Save Payment
        Payment payment = new Payment();
        payment.setUserId(request.userId);
        payment.setPaymentMethod(request.paymentMethod);
        payment.setStatus("completed");
        payment.setAmount(request.amount);
        payment.setPaymentTime(new Date());

        paymentService.savePayment(payment);

        // 4. Create Booking
        Booking booking = new Booking();
        booking.setUserId(request.userId);
        booking.setEmail(request.email);
        booking.setSlotId(request.slotId);
        booking.setSlotNumber(request.slotNumber);
        booking.setLocation(request.location);
        booking.setAmountPaid(request.amount);

        booking.setLicensePlate(request.vehicleNumber);
        booking.setVehicleType(request.vehicleType);
        booking.setPaymentMethod(request.paymentMethod);
        booking.setPaymentStatus("Completed");
        booking.setTransactionId(request.transactionId);

        Booking savedBooking = bookingRepository.save(booking);

        // 5. Send Email
        try {
            String subject = "Booking Confirmed!";
            String content = emailTemplateService.generateBookingTemplate(savedBooking);
            emailService.sendBookingConfirmation(request.email, subject, content, savedBooking);
        } catch (Exception e) {
            System.out.println("Email failed but booking successful");
        }

        return savedBooking;
    }
}
