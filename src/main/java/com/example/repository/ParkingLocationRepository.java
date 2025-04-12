package com.example.repository;

import com.example.model.ParkingLocation;

import org.springframework.data.geo.Distance;
import org.springframework.data.mongodb.core.geo.GeoJsonPoint;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ParkingLocationRepository extends MongoRepository<ParkingLocation, String> {
    List<ParkingLocation> findByCity(String city);
    List<ParkingLocation> findByUserId(String userId);
    List<ParkingLocation> findByCityRegexIgnoreCase(String cityPattern);
     List<ParkingLocation> findByLocationNear(GeoJsonPoint point, Distance distance);

}
