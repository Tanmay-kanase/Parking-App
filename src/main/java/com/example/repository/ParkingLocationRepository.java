package com.example.repository;

import com.example.model.ParkingLocation;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ParkingLocationRepository extends MongoRepository<ParkingLocation, String> {
    List<ParkingLocation> findByCity(String city);
}
