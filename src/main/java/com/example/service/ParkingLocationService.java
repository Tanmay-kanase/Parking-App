package com.example.service;


import com.example.model.ParkingLocation;
import com.example.repository.ParkingLocationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

@Service
public class ParkingLocationService {

    @Autowired
    private ParkingLocationRepository parkingLocationRepository;

    public List<ParkingLocation> getAllParkingLocations() {
        return parkingLocationRepository.findAll();
    }

    public Optional<ParkingLocation> getParkingLocationById(String id) {
        return parkingLocationRepository.findById(id);
    }

    public List<ParkingLocation> getParkingLocationsByCity(String city) {
        return parkingLocationRepository.findByCity(city);
    }

    public ParkingLocation addParkingLocation(ParkingLocation location) {
        return parkingLocationRepository.save(location);
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
}
