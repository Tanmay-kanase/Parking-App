package com.example.model;

import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Data
@Document(collection = "parking_history")
public class ParkingHistory {

    @Id
    private String histroy_id;
    private String userId;
    private String vehicleId;
    private String parking_lot_id;
    private String slotId;
    private String paymentId;
    private String entryTime;
    private String exitTime;
    private String amountPaid;
}
