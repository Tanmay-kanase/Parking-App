package com.example.service;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;

import java.util.Map;
import java.util.Random;
import java.util.concurrent.ConcurrentHashMap;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import com.example.model.Booking;
import com.example.utils.ICalGenerator;
import com.example.utils.PdfGenerator;
import com.example.utils.QrCodeGenerator;

@Service
public class EmailService {

    @Autowired
    private JavaMailSender mailSender;

    private final Map<String, String> otpStorage = new ConcurrentHashMap<>();

    public void sendBookingConfirmation(String toEmail, String subject, String htmlBody, Booking booking)
            throws Exception {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true);

            helper.setFrom("tanmaykanase07@gmail.com"); // Replace with your verified sender
            helper.setTo(toEmail);
            helper.setSubject(subject);
            helper.setText(htmlBody, true); // 'true' enables HTML

            // 1. Generate PDF
            byte[] pdfBytes = PdfGenerator.generateReceipt(booking);
            helper.addAttachment("ParkEasy_Receipt.pdf", new ByteArrayResource(pdfBytes));

            // 2. Generate QR Code
            // byte[] qrCodeBytes =
            // QrCodeGenerator.generateQRCodeImage(booking.getSlotId());
            // helper.addAttachment("ParkingQRCode.png", new
            // ByteArrayResource(qrCodeBytes));

            // 3. Generate iCal Invite
            byte[] icsFile = ICalGenerator.generateCalendarInvite(booking);
            helper.addAttachment("ParkingEvent.ics", new ByteArrayResource(icsFile));

            mailSender.send(message);
            System.out.println("✅ HTML Email sent successfully to " + toEmail);
        } catch (MessagingException e) {
            System.out.println("❌ Failed to send email to " + toEmail + ": " + e.getMessage());
            e.printStackTrace();
        }

    }

    public String sendOtpEmail(String toEmail) {
        String otp = generateOTP();
        otpStorage.put(toEmail, otp);

        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(toEmail);
        message.setSubject("Your OTP for Registration");
        message.setText("Your OTP is: " + otp + "\nValid for 5 minutes.");

        mailSender.send(message);
        return otp;
    }

    public String generateOTP() {
        return String.format("%06d", new Random().nextInt(999999));
    }

    public boolean verifyOtp(String email, String otp) {
        String storedOtp = otpStorage.get(email);
        return storedOtp != null && storedOtp.equals(otp);
    }

    public void clearOtp(String email) {
        otpStorage.remove(email);
    }
}
