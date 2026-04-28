package com.example.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.retry.annotation.Retryable;
import org.springframework.scheduling.annotation.Scheduled;
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
import com.razorpay.RazorpayClient;

import java.time.Instant;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.Date;
import java.util.List;
import java.util.Optional;

@Service
public class BookingService {

    @Value("${razorpay.key.secret}")
    private String keySecret;
    @Value("${razorpay.key.id}")
    private String keyId;
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

    @Scheduled(fixedRate = 60000) // Runs every 60 seconds
    public void expireOldBookings() {
        Instant now = Instant.now();

        // Only fetch bookings that are still marked as ACTIVE but have expired
        List<Booking> expiredBookings = bookingRepository.findByStatusAndEndTimeBefore("ACTIVE", now);

        if (!expiredBookings.isEmpty()) {
            System.out.println("Found " + expiredBookings.size() + " expired bookings. Updating status...");

            for (Booking booking : expiredBookings) {
                try {
                    // 1. Free up the parking slot so others can book it
                    // slotService.markSlotAsAvailable(booking.getSlotId());

                    // 2. Change the status instead of deleting
                    booking.setStatus("EXPIRED");
                    bookingRepository.save(booking);

                    System.out.println(" Marked booking " + booking.getBookingId() + " as EXPIRED and freed slot "
                            + booking.getSlotId());
                } catch (Exception e) {
                    System.out.println("❌ Failed to update booking " + booking.getBookingId() + ": " + e.getMessage());
                }
            }
        }
    }

    public List<Booking> getBookingsByLocationId(String locationId) {
        return bookingRepository.findByLocationId(locationId);
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

        String finalStatus = "completed"; // Default fallback
        String finalMethod = request.paymentMethod;
        String r_email = request.email;
        String r_contact = null;
        String r_bank = null;
        String r_wallet = null;
        String r_vpa = null;
        Long r_fee = 0L;
        Long r_tax = 0L;

        try {
            RazorpayClient razorpay = new RazorpayClient(keyId, keySecret);
            com.razorpay.Payment rpPayment = razorpay.payments.fetch(request.paymentId);
            com.razorpay.Order razorpayOrder = razorpay.orders.fetch(request.orderId);
            if (rpPayment != null) {
                // Get Status and Method directly from Razorpay
                finalStatus = razorpayOrder.has("status") ? razorpayOrder.get("status") : "completed"; // e.g.,
                                                                                                       // "captured",
                                                                                                       // "authorized"
                finalMethod = rpPayment.get("method"); // e.g., "netbanking", "upi", "card"

                // Extract metadata safely
                r_email = rpPayment.has("email") ? rpPayment.get("email") : request.email;
                r_contact = rpPayment.has("contact") ? rpPayment.get("contact") : null;
                r_bank = rpPayment.has("bank") ? rpPayment.get("bank") : null;
                r_wallet = rpPayment.has("wallet") ? rpPayment.get("wallet") : null;
                r_vpa = rpPayment.has("vpa") ? rpPayment.get("vpa") : null;

                r_fee = rpPayment.has("fee") ? Long.valueOf(rpPayment.get("fee").toString()) : 0L;
                r_tax = rpPayment.has("tax") ? Long.valueOf(rpPayment.get("tax").toString()) : 0L;
            }
        } catch (Exception e) {
            System.err.println("Razorpay Fetch Failed - using request fallback: " + e.getMessage());
        }
        // --- End: Gateway Data Fetching ---

        // 4. Save Payment Entity
        Payment payment = new Payment();
        payment.setPaymentId(request.paymentId);
        payment.setUserId(request.userId);
        payment.setTransactionId(request.paymentId);
        payment.setEmail(r_email);
        payment.setContact(r_contact);
        payment.setBank(r_bank);
        payment.setWallet(r_wallet);
        payment.setVpa(r_vpa);
        payment.setFee(r_fee);
        payment.setTax(r_tax);
        payment.setAmount(request.amount);
        payment.setPaymentMethod(finalMethod); // API Value
        payment.setStatus(finalStatus); // API Value
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
        booking.setLocationId(request.locationId);
        booking.setLicensePlate(request.vehicleNumber);
        booking.setVehicleType(request.vehicleType);
        booking.setPaymentMethod(request.paymentMethod);
        booking.setPaymentStatus("Completed");
        booking.setTransactionId(request.transactionId);
        booking.setStatus("ACTIVE");
        System.out.println("====== BACKEND DEBUG: ATTEMPTING TO PARSE ======");
        Instant start = Instant.parse(request.startTime);
        Instant end = Instant.parse(request.endTime);

        System.out.println("3. Parsed Start Instant: " + start.toString());
        System.out.println("4. Parsed End Instant:   " + end.toString());
        System.out.println("================================================");

        booking.setStartTime(start);
        booking.setEndTime(end);
        Booking savedBooking = bookingRepository.save(booking);

        // 5. Send Email
        try {
            String subject = "Booking Confirmed!";
            String content = emailTemplateService.generateBookingTemplate(savedBooking);
            emailService.sendBookingConfirmation(request.email, subject, content, savedBooking);
        } catch (Exception e) {
            System.out.println("Email failed but booking successful");
        }

        try {
            RazorpayClient razorpay = new RazorpayClient(keyId, keySecret);

            // Fetch Payment
            com.razorpay.Payment razorpayPayment = razorpay.payments.fetch(request.paymentId);

            // Fetch Order
            com.razorpay.Order razorpayOrder = razorpay.orders.fetch(request.orderId);

            System.out.println("=== FULL PAYMENT OBJECT ===");
            System.out.println(razorpayPayment.toString());

            // {
            // "payment": {
            // "id": "pay_Sbs3Vk1ihD4Krx",
            // "entity": "payment",
            // "amount": 50000,
            // "currency": "INR",
            // "status": "captured",
            // "order_id": "order_Sbs3HbwIySfce6",
            // "method": "netbanking",
            // "bank": "PUNB_R",
            // "contact": "+919702210707",
            // "email": "test@gmail.com",
            // "description": "Parking Slot Booking",
            // "fee": 1180,
            // "tax": 180,
            // "amount_refunded": 0,
            // "refund_status": null,
            // "captured": true,
            // "international": false,
            // "invoice_id": null,
            // "wallet": null,
            // "vpa": null,
            // "card_id": null,
            // "notes": [],
            // "created_at": 1775841774,
            // "acquirer_data": {
            // "bank_transaction_id": "4695128"
            // },
            // "error": {
            // "code": null,
            // "description": null,
            // "source": null,
            // "step": null,
            // "reason": null
            // }
            // },
            // "order": {
            // "id": "order_Sbs3HbwIySfce6",
            // "entity": "order",
            // "amount": 50000,
            // "amount_paid": 50000,
            // "amount_due": 0,
            // "currency": "INR",
            // "status": "paid",
            // "receipt": "txn_123456",
            // "attempts": 1,
            // "description": null,
            // "offer_id": null,
            // "checkout": null,
            // "notes": [],
            // "created_at": 1775841760
            // }
            // }
            System.out.println("=== FULL ORDER OBJECT ===");
            System.out.println(razorpayOrder.toString());
        } catch (Exception e) {
            System.out.println("Error in fetching payment details");
        }
        return savedBooking;
    }
}
