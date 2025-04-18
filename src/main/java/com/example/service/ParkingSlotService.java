package com.example.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.model.ParkingSlot;
import com.example.repository.ParkingSlotRepository;

import java.util.List;
import java.util.Optional;

@Service
public class ParkingSlotService {

    @Autowired
    private ParkingSlotRepository parkingSlotRepository;

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
}
