package com.example.repository;

import org.springframework.data.mongodb.repository.MongoRepository;

import com.example.model.ParkingSlot;

import java.util.List;

public interface ParkingSlotRepository extends MongoRepository<ParkingSlot, String> {
    List<ParkingSlot> findByLocation(String location);

    List<ParkingSlot> findByIsAvailable(boolean isAvailable);

    List<ParkingSlot> findByUserId(String userId);

}
