package com.example.model;

import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Data
@Document(collection = "parking_slots")
public class ParkingSlot {
    @Id
    private String slotId;
    private String parkingId;

    private String slotNumber;
    private String location;
    private double pricePerHour;
    private String slotType; // "compact", "large"
    private boolean isAvailable;
}
