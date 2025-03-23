package com.example.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import com.example.model.Vehicle;
import com.example.service.VehicleService;

import java.util.List;

@RestController
@RequestMapping("/api/vehicles")
public class VehicleController {

    @Autowired
    private VehicleService vehicleService;

    @GetMapping("/user/{userId}")
    public List<Vehicle> getVehiclesByUserId(@PathVariable String userId) {
        return vehicleService.getVehiclesByUserId(userId);
    }
}
