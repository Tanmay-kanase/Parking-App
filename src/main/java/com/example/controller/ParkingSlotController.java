package com.example.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.example.model.ParkingSlot;
import com.example.service.ParkingSlotService;
import com.example.repository.ParkingSlotRepository;
import java.util.List;
import java.util.Optional;
import java.text.SimpleDateFormat;
import java.util.Date;

@RestController
@RequestMapping("/api/parking-slots")
public class ParkingSlotController {

    @Autowired
    private ParkingSlotService parkingSlotService;

    @Autowired
    private ParkingSlotRepository parkingSlotRepository;

    @GetMapping
    public List<ParkingSlot> getAllSlots() {
        return parkingSlotService.getAllSlots();
    }

    @GetMapping("/{slotId}")
    public ResponseEntity<ParkingSlot> getSlotById(@PathVariable String slotId) {
        Optional<ParkingSlot> slot = parkingSlotService.getSlotById(slotId);
        return slot.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
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
    public ResponseEntity<ParkingSlot> updateSlot(@PathVariable String slotId,
            @RequestBody ParkingSlot updatedSlot) {
        try {
            System.out.println("\n\n\nBooking started\n\n\n");
            ParkingSlot slot = parkingSlotService.updateSlot(slotId, updatedSlot);
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

    @PostMapping("/batch")
    public ResponseEntity<?> addParkingSlots(@RequestBody List<ParkingSlot> slots) {
        List<ParkingSlot> savedSlots = parkingSlotRepository.saveAll(slots);
        return ResponseEntity.ok(savedSlots);
    }

    @GetMapping("/available-by-time")
    public ResponseEntity<List<ParkingSlot>> getAvailableSlotsByTime(@RequestParam String parkingId,
            @RequestParam String vehicleType, @RequestParam String startTime,
            @RequestParam String endTime) {

        try {
            SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd'T'HH:mm");
            Date start = sdf.parse(startTime);
            Date end = sdf.parse(endTime);
            System.out.println("Available Tiem" + parkingId + " " + vehicleType + " " + startTime
                    + " " + endTime);
            List<ParkingSlot> availableSlots =
                    parkingSlotService.getAvailableSlotsByTime(parkingId, vehicleType, start, end);
            System.out.println("AvailableSlots : " + availableSlots);
            return ResponseEntity.ok(availableSlots);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @GetMapping("/availableByVehicle")
    public List<ParkingSlot> getAvailableSlots(@RequestParam String parkingId,
            @RequestParam String vehicleType,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) Date startTime,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) Date endTime) {
        return parkingSlotService.getAvailableSlots(parkingId, vehicleType, startTime, endTime);
    }

}
