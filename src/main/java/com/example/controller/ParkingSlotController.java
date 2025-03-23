package com.example.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import com.example.model.ParkingSlot;
import com.example.service.ParkingSlotService;

import java.util.Optional;

@RestController
@RequestMapping("/api/parking-slots")
public class ParkingSlotController {

    @Autowired
    private ParkingSlotService parkingSlotService;

    @GetMapping("/{slotId}")
    public Optional<ParkingSlot> getSlotById(@PathVariable String slotId) {
        return parkingSlotService.getSlotById(slotId);
    }
}
