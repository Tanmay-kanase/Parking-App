package com.example.repository;

import org.springframework.data.mongodb.repository.Aggregation;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;

import com.example.model.ParkingSlot;

import java.time.Instant;
import java.util.List;

public interface ParkingSlotRepository extends MongoRepository<ParkingSlot, String>, ParkingSlotRepositoryCustom {
    List<ParkingSlot> findByLocation(String location);

    List<ParkingSlot> findByIsAvailable(boolean isAvailable);

    List<ParkingSlot> findByUserId(String userId);

    List<ParkingSlot> findByParkingId(String parkingId);

    @Aggregation(pipeline = {
            // ?0 = parkingId
            "{ $match: { parkingId: ?0 } }",

            "{ $lookup: { " +
                    "    from: 'bookings', " +
                    "    let: { slotIdStr: { $toString: '$_id' } }, " +
                    "    pipeline: [ " +
                    "      { $match: { $expr: { $and: [ " +
                    "        { $eq: ['$slotId', '$$slotIdStr'] }, " +
                    // ?2 = endTime (Existing booking starts BEFORE the NEW booking ends)
                    "        { $lt: ['$startTime', ?2] }, " +
                    // ?1 = startTime (Existing booking ends AFTER the NEW booking starts)
                    "        { $gt: ['$endTime', ?1] } " +
                    "      ] } } } " +
                    "    ], " +
                    "    as: 'overlappingBookings' " +
                    "} }",

            "{ $match: { overlappingBookings: { $size: 0 } } }",

            "{ $project: { overlappingBookings: 0 } }"
    })
    List<ParkingSlot> findAvailableSlotsByAggregation(String parkingId, Instant startTime, Instant endTime);

    List<ParkingSlot> findByParkingIdAndVehicleType(String parkingId, String vehicleType);
}
