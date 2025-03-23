package com.example.repository;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;
import com.example.model.ParkingSlot;

import java.util.Optional;

@Repository
public interface ParkingSlotRepository extends MongoRepository<ParkingSlot, String> {
    Optional<ParkingSlot> findBySlotId(String slotId);
}
