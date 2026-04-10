package com.example.repository;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;

import com.example.model.ParkingSlot;

import java.util.List;

public interface ParkingSlotRepository extends MongoRepository<ParkingSlot, String>, ParkingSlotRepositoryCustom {
    List<ParkingSlot> findByLocation(String location);

    List<ParkingSlot> findByIsAvailable(boolean isAvailable);

    List<ParkingSlot> findByUserId(String userId);

    List<ParkingSlot> findByParkingId(String parkingId);

    List<ParkingSlot> findByParkingIdAndVehicleType(String parkingId, String vehicleType);
}
