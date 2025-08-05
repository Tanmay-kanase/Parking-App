package com.example.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import com.example.model.ParkingHistory;
import com.example.service.ParkingHistoryService;

import java.util.List;

@RestController
@RequestMapping("/api/parking-history")
public class ParkingHistoryController {

    @Autowired
    private ParkingHistoryService parkingHistoryService;

    @PostMapping
public ParkingHistory createParkingHistory(@RequestBody ParkingHistory parkingHistory) {
    return parkingHistoryService.saveParkingHistory(parkingHistory);
}

    @GetMapping("/user/{userId}")
    public List<ParkingHistory> getHistoryByUserId(@PathVariable String userId) {
        return parkingHistoryService.getHistoryByUserId(userId);
    }

    @GetMapping("/vehicle/{vehicleId}")
    public List<ParkingHistory> getHistoryByVehicleId(@PathVariable String vehicleId) {
        return parkingHistoryService.getHistoryByVehicleId(vehicleId);
    }
}
