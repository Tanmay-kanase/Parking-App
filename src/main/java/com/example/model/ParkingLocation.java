package com.example.model;

import lombok.*;
import org.springframework.data.annotation.Id;
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

    public void addSlot(String slotId) {
        this.slotIds.add(slotId);
    }
}
