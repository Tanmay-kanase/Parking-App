package com.example.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.example.model.ParkingSlot;
import com.example.repository.ParkingSlotRepository;

import java.util.Optional;

@Service
public class ParkingSlotService {

    @Autowired
    private ParkingSlotRepository parkingSlotRepository;

    public Optional<ParkingSlot> getSlotById(String slotId) {
        return parkingSlotRepository.findBySlotId(slotId);
    }
}
