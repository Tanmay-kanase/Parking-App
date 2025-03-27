package com.example.controller;

import com.example.model.ParkingLocation;
import com.example.service.ParkingLocationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/parking-locations")
@CrossOrigin(origins = "http://localhost:5173")
public class ParkingLocationController {

    @Autowired
    private ParkingLocationService parkingLocationService;

    @GetMapping
    public List<ParkingLocation> getAllParkingLocations() {
        return parkingLocationService.getAllParkingLocations();
    }

    @GetMapping("/{id}")
    public ResponseEntity<ParkingLocation> getParkingLocationById(@PathVariable String id) {
        Optional<ParkingLocation> location = parkingLocationService.getParkingLocationById(id);
        return location.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    @GetMapping("/city/{city}")
    public List<ParkingLocation> getParkingLocationsByCity(@PathVariable String city) {
        return parkingLocationService.getParkingLocationsByCity(city);
    }

    @PostMapping
    public ResponseEntity<ParkingLocation> addParkingLocation(@RequestBody ParkingLocation location) {
        return ResponseEntity.ok(parkingLocationService.addParkingLocation(location));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ParkingLocation> updateParkingLocation(
            @PathVariable String id, @RequestBody ParkingLocation updatedLocation) {
        ParkingLocation updated = parkingLocationService.updateParkingLocation(id, updatedLocation);
        return updated != null ? ResponseEntity.ok(updated) : ResponseEntity.notFound().build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteParkingLocation(@PathVariable String id) {
        boolean deleted = parkingLocationService.deleteParkingLocation(id);
        return deleted ? ResponseEntity.ok("Parking Location Deleted") : ResponseEntity.notFound().build();
    }

    @PostMapping("/{id}/add-slot")
    public ResponseEntity<String> addSlotToParking(@PathVariable String id, @RequestBody String slotId) {
        parkingLocationService.addSlotToParking(id, slotId);
        return ResponseEntity.ok("Slot added successfully.");
    }
}
