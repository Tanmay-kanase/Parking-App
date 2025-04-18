package com.example.service;

import com.example.dto.ParkingLocationResponse;
import com.example.dto.UserDTO;
import com.example.model.ParkingLocation;
import com.example.model.ParkingSlot;
import com.example.repository.ParkingLocationRepository;
import com.example.repository.ParkingSlotRepository;
import com.example.repository.UserRepository;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.geo.Distance;
import org.springframework.data.geo.Metrics;
import org.springframework.data.mongodb.core.geo.GeoJsonPoint;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class ParkingLocationService {

    // private final UserRepository userRepository;

    // private final ParkingSlotRepository parkingSlotRepository;

    private final ParkingSlotRepository parkingSlotRepository;
    private final UserRepository userRepository;

    @Autowired
    private ParkingLocationRepository parkingLocationRepository;

    ParkingLocationService(UserRepository userRepository, ParkingSlotRepository parkingSlotRepository) {
        this.userRepository = userRepository;
        this.parkingSlotRepository = parkingSlotRepository;
    }

    public List<ParkingLocation> getAllParkingLocations() {
        return parkingLocationRepository.findAll();
    }

    public List<ParkingLocation> getParkingLocationsByUserId(String userId) {
        return parkingLocationRepository.findByUserId(userId);
    }

    public Optional<ParkingLocation> getParkingLocationById(String id) {
        return parkingLocationRepository.findById(id);
    }

    public ParkingLocation addParkingLocation(ParkingLocation location) {
        if (location.getLat() != null && location.getLng() != null) {
            GeoJsonPoint point = new GeoJsonPoint(location.getLng(), location.getLat());
            location.setLocation(point);
        }
        return parkingLocationRepository.save(location);
    }

    public List<ParkingLocationResponse> getNearbyParkings(double lat, double lng, double radiusInKm) {
        System.out.println("🔍 Finding nearby parkings...");
        System.out.println("📍 Latitude: " + lat);
        System.out.println("📍 Longitude: " + lng);
        System.out.println("📏 Radius (KM): " + radiusInKm);
        GeoJsonPoint userLocation = new GeoJsonPoint(lng, lat);
        Distance radius = new Distance(radiusInKm, Metrics.KILOMETERS);

        List<ParkingLocation> nearbyLocations = parkingLocationRepository.findByLocationNear(userLocation, radius);

        List<ParkingLocationResponse> responses = new ArrayList<>();

        for (ParkingLocation location : nearbyLocations) {
            System.out.println(
                    "    Location (lat,lng): " + location.getLocation().getY() + ", " + location.getLocation().getX());
            ParkingLocationResponse response = new ParkingLocationResponse();
            BeanUtils.copyProperties(location, response);

            response.setLat(location.getLocation().getY()); // latitude
            response.setLng(location.getLocation().getX()); // longitude

            userRepository.findById(location.getUserId()).ifPresent(user -> {
                UserDTO dto = new UserDTO();
                dto.setName(user.getName());
                dto.setPhone(user.getPhone());
                response.setUser(dto);
            });

            responses.add(response);
        }

        return responses;
    }

    public ParkingLocation updateParkingLocation(String id, ParkingLocation updatedLocation) {
        return parkingLocationRepository.findById(id).map(existingLocation -> {
            existingLocation.setName(updatedLocation.getName());
            existingLocation.setAddress(updatedLocation.getAddress());
            existingLocation.setCity(updatedLocation.getCity());
            existingLocation.setState(updatedLocation.getState());
            existingLocation.setZipCode(updatedLocation.getZipCode());
            existingLocation.setTotalSlots(updatedLocation.getTotalSlots());
            existingLocation.setSlotIds(updatedLocation.getSlotIds());
            return parkingLocationRepository.save(existingLocation);
        }).orElse(null);
    }

    public boolean deleteParkingLocation(String id) {
        if (parkingLocationRepository.existsById(id)) {
            parkingLocationRepository.deleteById(id);
            return true;
        }
        return false;
    }

    public void addSlotToParking(String locationId, String slotId) {
        parkingLocationRepository.findById(locationId).ifPresent(location -> {
            location.getSlotIds().add(slotId);
            parkingLocationRepository.save(location);
        });
    }

    public List<ParkingLocationResponse> getParkingLocationsByCity(String city) {
        List<ParkingLocation> locations = parkingLocationRepository.findByCityRegexIgnoreCase(".*" + city + ".*");

        List<ParkingLocationResponse> responses = new ArrayList<>();

        for (ParkingLocation location : locations) {
            List<ParkingSlot> slots = parkingSlotRepository.findByParkingId(location.getLocationId());

            int bike = 0, sedan = 0, truck = 0, bus = 0;
            boolean anyAvailable = false;

            ParkingLocationResponse response = new ParkingLocationResponse();
            BeanUtils.copyProperties(location, response);

            response.setBikeSlots(bike);
            response.setSedanSlots(sedan);
            response.setTruckSlots(truck);
            response.setBusSlots(bus);
            response.setAvailable(anyAvailable);

            userRepository.findById(location.getUserId()).ifPresent(user -> {
                UserDTO dto = new UserDTO();
                dto.setName(user.getName());
                dto.setPhone(user.getPhone());
                response.setUser(dto);
            });

            System.out.println("City = " + city);
            System.out.println("Found locations = " + locations.size());

            for (ParkingLocation loc : locations) {
                System.out.println("LocationID: " + loc.getLocationId());
            }

            responses.add(response);
        }

        return responses;
    }
}
