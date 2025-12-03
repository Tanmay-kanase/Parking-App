package com.example.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.example.model.Booking;
import com.example.model.ParkingSlot;
import com.example.repository.BookingRepository;
import com.example.repository.ParkingSlotRepository;

import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.Collections;
import java.util.Date;
import java.util.stream.Collectors;


@Service
public class ParkingSlotService {

    @Autowired
    private ParkingSlotRepository parkingSlotRepository;

    @Autowired
    private BookingRepository bookingRepository;

    public List<ParkingSlot> getAllSlots() {
        return parkingSlotRepository.findAll();
    }

    public Optional<ParkingSlot> getSlotById(String slotId) {
        return parkingSlotRepository.findById(slotId);
    }

    public List<ParkingSlot> getSlotsByUserId(String userId) {
        return parkingSlotRepository.findByUserId(userId);
    }

    public List<ParkingSlot> getAvailableSlots() {
        return parkingSlotRepository.findByIsAvailable(true);
    }

    public ParkingSlot createSlot(ParkingSlot slot) {
        System.out.println(slot);
        slot.setAvailable(slot.isAvailable());
        return parkingSlotRepository.save(slot);
    }

    public List<ParkingSlot> getSlotsByParkingId(String parkingId) {
        return parkingSlotRepository.findByParkingId(parkingId);
    }

    public ParkingSlot updateSlot(String slotId, ParkingSlot updatedSlot) {
        return parkingSlotRepository.findById(slotId).map(slot -> {
            if (updatedSlot.getSlotNumber() != null)
                slot.setSlotNumber(updatedSlot.getSlotNumber());
            if (updatedSlot.getLocation() != null)
                slot.setLocation(updatedSlot.getLocation());
            if (updatedSlot.getPricePerHour() != 0.0)
                slot.setPricePerHour(updatedSlot.getPricePerHour());
            if (updatedSlot.getVehicleType() != null)
                slot.setVehicleType(updatedSlot.getVehicleType());

            // Always update availability if sent
            slot.setAvailable(updatedSlot.isAvailable());

            return parkingSlotRepository.save(slot);
        }).orElseThrow(() -> new RuntimeException("Parking Slot not found"));
    }

    public void deleteSlot(String slotId) {
        parkingSlotRepository.deleteById(slotId);
    }

    public List<ParkingSlot> getAvailableSlotsByTime(String parkingId, String vehicleType,
            Date start, Date end) {

        // Get all slots for that parking + vehicle type
        List<ParkingSlot> slots = parkingSlotRepository.findByParkingId(parkingId).stream()
                .filter(slot -> slot.getVehicleType().equalsIgnoreCase(vehicleType))
                .collect(Collectors.toList());
        System.out.println("Slots" + slots);
        // Filter out slots that are already booked
        return slots.stream().filter(slot -> {
            List<Booking> conflicts =
                    bookingRepository.findBySlotIdAndStartTimeLessThanAndEndTimeGreaterThan(
                            slot.getSlotId(), start, end);

            System.out.println("Conflicts" + conflicts);
            return conflicts.isEmpty(); // keep slot only if NOT conflicting
        }).collect(Collectors.toList());
    }


    public List<ParkingSlot> getAvailableSlots(String parkingId, String vehicleType, Date startTime,
            Date endTime) {

        List<ParkingSlot> slots;
        if ("ALL".equalsIgnoreCase(vehicleType) || vehicleType == null
                || vehicleType.trim().isEmpty()) {
            // If ALL, get all slots for the given parking lot.
            slots = parkingSlotRepository.findByParkingId(parkingId);
        } else {
            // Otherwise, filter by the specific vehicle type.
            slots = parkingSlotRepository.findByParkingIdAndVehicleType(parkingId, vehicleType);
        }
        if (slots.isEmpty())
            return Collections.emptyList();

        // Extract slot IDs
        List<String> slotIds = slots.stream().map(ParkingSlot::getSlotId).toList();

        // Step 2: Find overlapping bookings
        List<Booking> overlappingBookings =
                bookingRepository.findOverlappingBookings(slotIds, startTime, endTime);

        Set<String> bookedSlotIds =
                overlappingBookings.stream().map(Booking::getSlotId).collect(Collectors.toSet());

        // Step 3: Filter available slots
        return slots.stream().filter(s -> !bookedSlotIds.contains(s.getSlotId())).toList();
    }

}
