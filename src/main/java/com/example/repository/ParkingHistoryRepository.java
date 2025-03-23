package com.example.repository;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;
import com.example.model.ParkingHistory;

import java.util.List;

@Repository
public interface ParkingHistoryRepository extends MongoRepository<ParkingHistory, String> {
    List<ParkingHistory> findByUserId(String userId);

    List<ParkingHistory> findByVehicleId(String vehicleId);
}
