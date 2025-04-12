package com.example.controller;

import com.example.dto.ParkingLocationResponse;
import com.example.model.ParkingLocation;
import com.example.service.ParkingLocationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/parking-locations")
public class ParkingLocationController {

    @Autowired
    private ParkingLocationService parkingLocationService;

    @GetMapping
    public List<ParkingLocation> getAllParkingLocations() {
        return parkingLocationService.getAllParkingLocations();
    }

    @GetMapping("/user/{userId}")
    public List<ParkingLocation> getByUserId(@PathVariable String userId) {
        return parkingLocationService.getParkingLocationsByUserId(userId);
    }

    @GetMapping("/{id}")
    public ResponseEntity<ParkingLocation> getParkingLocationById(@PathVariable String id) {
        Optional<ParkingLocation> location = parkingLocationService.getParkingLocationById(id);
        return location.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    @GetMapping("/city/{city}")
    public ResponseEntity<List<ParkingLocationResponse>> getByCity(@PathVariable String city) {
        List<ParkingLocationResponse> list = parkingLocationService.getParkingLocationsByCity(city);
        return ResponseEntity.ok(list);
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

    @GetMapping("/nearby")
    public ResponseEntity<List<ParkingLocationResponse>> getNearbyParkings(
            @RequestParam double lat,
            @RequestParam double lng,
            @RequestParam(defaultValue = "5") double radiusKm // default 5km
    ) {
        List<ParkingLocationResponse> results = parkingLocationService.getNearbyParkings(lat, lng, radiusKm);
        return ResponseEntity.ok(results);
    }

}
