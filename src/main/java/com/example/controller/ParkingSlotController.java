package com.example.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.example.model.ParkingSlot;
import com.example.service.EmailService;
import com.example.service.ParkingSlotService;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/parking-slots")
public class ParkingSlotController {

    @Autowired
    private EmailService emailService;

    @Autowired
    private ParkingSlotService parkingSlotService;

    @GetMapping
    public List<ParkingSlot> getAllSlots() {
        return parkingSlotService.getAllSlots();
    }

    @GetMapping("/{slotId}")
    public ResponseEntity<ParkingSlot> getSlotById(@PathVariable String slotId) {
        Optional<ParkingSlot> slot = parkingSlotService.getSlotById(slotId);
        return slot.map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<ParkingSlot>> getSlotsByUserId(@PathVariable String userId) {
        List<ParkingSlot> slots = parkingSlotService.getSlotsByUserId(userId);
        return slots.isEmpty() ? ResponseEntity.notFound().build() : ResponseEntity.ok(slots);
    }

    @GetMapping("/parking/{parkingId}")
    public ResponseEntity<List<ParkingSlot>> getSlotsByParkingId(@PathVariable String parkingId) {
        List<ParkingSlot> slots = parkingSlotService.getSlotsByParkingId(parkingId);
        return slots.isEmpty() ? ResponseEntity.notFound().build() : ResponseEntity.ok(slots);
    }

    @GetMapping("/available")
    public List<ParkingSlot> getAvailableSlots() {
        return parkingSlotService.getAvailableSlots();
    }

    @PostMapping
    public ResponseEntity<ParkingSlot> createSlot(@RequestBody ParkingSlot slot) {
        ParkingSlot createdSlot = parkingSlotService.createSlot(slot);
        System.out.println("Received Request: " + slot);
        return ResponseEntity.ok(createdSlot);
    }

    @PutMapping("/{slotId}")
    public ResponseEntity<ParkingSlot> updateSlot(@PathVariable String slotId, @RequestBody ParkingSlot updatedSlot) {
        try {
            System.out.println("\n\n\nBooking started\n\n\n");
            ParkingSlot slot = parkingSlotService.updateSlot(slotId, updatedSlot);

            // Compose email content
            // String subject = "Your Parking Slot Booking is Confirmed!";
            // String body = "Booking Confirmed";

            // try {
            //     emailService.sendBookingConfirmation("tanmaykanase06@gmail.com", subject,
            //             body);
            //     System.out.println("Booking mail is sent to user.");
            // } catch (Exception e) {
            //     System.out.println("❌ Error sending email: " + e.getMessage());
            //     e.printStackTrace();
            // }
            return ResponseEntity.ok(slot);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{slotId}")
    public ResponseEntity<Void> deleteSlot(@PathVariable String slotId) {
        parkingSlotService.deleteSlot(slotId);
        return ResponseEntity.noContent().build();
    }
}
