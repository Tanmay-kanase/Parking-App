package com.example.repository;

import com.example.dto.ParkingLocationResponse;
import com.example.model.ParkingLocation;
import org.springframework.data.geo.Distance;
import org.springframework.data.mongodb.core.geo.GeoJsonPoint;
import org.springframework.data.mongodb.repository.Aggregation;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface ParkingLocationRepository extends MongoRepository<ParkingLocation, String> {
    List<ParkingLocation> findByCity(String city);

    List<ParkingLocation> findByUserId(String userId);

    List<ParkingLocation> findByCityRegexIgnoreCase(String cityPattern);

    List<ParkingLocation> findByLocationNear(GeoJsonPoint point, Distance distance);

    @Aggregation(pipeline = {
            "{ $match: { address: { $regex: ?0, $options: 'i' } } }",
            "{ $lookup: { from: 'users', localField: 'userId', foreignField: '_id', as: 'user_info' } }",
            "{ $unwind: { path: '$user_info', preserveNullAndEmptyArrays: true } }",
            "{ $lookup: { from: 'parking_slots', let: { locationIdStr: { $toString: '$_id' } }, pipeline: [ { $match: { $expr: { $eq: ['$parkingId', '$$locationIdStr'] } } } ], as: 'slots' } }",
            "{ $project: { _id: 0, locationId: { $toString: '$_id' }, name: 1, address: 1, city: 1, state: 1, zipCode: 1, evCharging: { $ifNull: ['$evCharging', false] }, cctvCamera: { $ifNull: ['$cctvCamera', false] }, washing: { $ifNull: ['$washing', false] }, lat: { $arrayElemAt: ['$location.coordinates', 1] }, lng: { $arrayElemAt: ['$location.coordinates', 0] }, totalSlots: { $size: '$slots' }, bikeSlots: { $size: { $filter: { input: '$slots', as: 'slot', cond: { $eq: ['$$slot.vehicleType', 'bike'] } } } }, sedanSlots: { $size: { $filter: { input: '$slots', as: 'slot', cond: { $eq: ['$$slot.vehicleType', 'sedan'] } } } }, truckSlots: { $size: { $filter: { input: '$slots', as: 'slot', cond: { $eq: ['$$slot.vehicleType', 'truck'] } } } }, busSlots: { $size: { $filter: { input: '$slots', as: 'slot', cond: { $eq: ['$$slot.vehicleType', 'bus'] } } } }, available: { $gt: [ { $size: { $filter: { input: '$slots', as: 'slot', cond: { $eq: ['$$slot.isAvailable', true] } } } }, 0 ] }, user: { id: '$user_info._id', name: '$user_info.name', email: '$user_info.email', photo: '$user_info.photo', role: '$user_info.role' } } }"
    })
    List<ParkingLocationResponse> getParkingLocationsByAddress(String address);

    @Query(value = "{ 'address': { $regex: ?0, $options: 'i' } }", fields = "{ 'locationId': 1, 'address': 1 }")
    List<ParkingLocation> searchLocations(String keyword);
}
