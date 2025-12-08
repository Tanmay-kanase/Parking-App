package com.example.service;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import java.util.HashMap;
import java.util.Map;
import java.util.Random;
import java.util.concurrent.ConcurrentHashMap;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import com.example.model.Booking;
import com.example.utils.ICalGenerator;
import com.example.utils.PdfGenerator;
import com.example.utils.QrCodeGenerator;
import org.springframework.web.client.RestTemplate;

@Service
public class EmailService {

    @Autowired
    private JavaMailSender mailSender;

    private final RestTemplate restTemplate = new RestTemplate();

    public String emailServiceBaseUrl = "http://localhost:3000";

    private final Map<String, String> otpStorage = new ConcurrentHashMap<>();

    public void sendBookingConfirmation(String toEmail, String subject, String htmlBody,
            Booking booking) throws Exception {
        String url = emailServiceBaseUrl + "/email/sendBooking";


        Map<String, Object> payload = new HashMap<>();
        payload.put("email", toEmail);
        payload.put("subject", subject);
        payload.put("html", htmlBody);
        payload.put("booking", booking);


        try {
            ResponseEntity<Map> response = restTemplate.postForEntity(url, payload, Map.class);

            if (response.getStatusCode() == HttpStatus.OK) {
                System.out.println("✅ Booking confirmation email sent via microservice");
            } else {
                System.out.println("❌ Microservice failed to send booking email");
            }

        } catch (Exception e) {
            System.out.println("❌ Error calling booking microservice: " + e.getMessage());
            throw new RuntimeException("Microservice unavailable");
        }


    }

    public String sendOtpEmail(String toEmail) {

        String url = emailServiceBaseUrl + "/email/sendOtp/" + toEmail;

        try {
            ResponseEntity<Map> response = restTemplate.postForEntity(url, null, Map.class);

            if (response.getStatusCode() == HttpStatus.OK && response.getBody() != null) {
                String otp = (String) response.getBody().get("otp");
                System.out.println("✅ OTP received from microservice: " + otp);
                return otp;
            } else {
                throw new RuntimeException("Failed to send OTP via microservice");
            }
        } catch (Exception e) {
            System.out.println("❌ Error calling email microservice: " + e.getMessage());
            throw new RuntimeException("Email microservice error", e);
        }
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
