package com.example.model;

import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.Transient;
import org.springframework.data.mongodb.core.geo.GeoJsonPoint;
import org.springframework.data.mongodb.core.index.GeoSpatialIndexType;
import org.springframework.data.mongodb.core.index.GeoSpatialIndexed;
import org.springframework.data.mongodb.core.mapping.Document;
import java.util.List;

@Data
@Document(collection = "parking_locations")
public class ParkingLocation {
    @Id
    private String locationId;
    private String userId; // User who owns this parking location

    private String name; // Name of the parking location
    private String address;
    private String city;
    private String state;
    private String zipCode;
    private int totalSlots; // Total number of slots available
    private List<String> slotIds; // References to parking slots
    private boolean evCharging;
    private boolean cctvCamera;
    private boolean washing;

    @GeoSpatialIndexed(type = GeoSpatialIndexType.GEO_2DSPHERE)
    private GeoJsonPoint location; // 🌍 This replaces lat & lng
    
    private int bikeSlots;
    private int sedanSlots;
    private int truckSlots;
    private int busSlots;

    @Transient
    private Double lat;

    @Transient
    private Double lng;

    public void addSlot(String slotId) {
        this.slotIds.add(slotId);
    }
}
