package com.example.repository;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;
import com.example.model.Booking;
import java.util.Date;
import java.util.List;
import java.util.Optional;

@Repository
public interface BookingRepository extends MongoRepository<Booking, String> {
    Optional<Booking> findByUserId(String userId);


    List<Booking> findAllByUserId(String userId);

    List<Booking> findBySlotIdAndStartTimeLessThanAndEndTimeGreaterThan(String slotId,
            Date startTime, Date endTime);

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
            Date startTime,
            Date endTime
    );


}
