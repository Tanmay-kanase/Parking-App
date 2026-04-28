package com.example.repository;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;
import com.example.model.Booking;

import java.time.Instant;
import java.time.LocalDateTime;
import java.util.Date;
import java.util.List;
import java.util.Optional;

@Repository
public interface BookingRepository extends MongoRepository<Booking, String> {
        Optional<Booking> findByUserId(String userId);

        List<Booking> findByStatusAndEndTimeBefore(String status, Instant currentTime);

        List<Booking> findByLocationId(String locationId);

        List<Booking> findAllByUserId(String userId);

        @Query("{ 'locationId': ?0, 'startTime': { $lte: ?1 }, 'endTime': { $gte: ?1 } }")
        List<Booking> findActiveBookings(String locationId, Instant now);

        List<Booking> findBySlotIdAndStartTimeLessThanAndEndTimeGreaterThan(String slotId,
                        Instant startTime, Instant endTime);

        // Find bookings that overlap with provided time window
        @Query("""
                            {
                              'slotId': { $in: ?0 },
                              'startTime': { $lt: ?2 },
                              'endTime': { $gt: ?1 }
                            }
                        """)
        List<Booking> findOverlappingBookings(
                        List<String> slotIds,
                        Instant startTime,
                        Instant endTime);

}
