package com.example.dto;

import lombok.Data;

@Data
public class ParkingLocationResponse {
    private String locationId;
    private String name;
    private String address;
    private String city;
    private String state;
    private String zipCode;
    private int totalSlots;

    private boolean evCharging;
    private boolean cctvCamera;
    private boolean washing;

    private int bikeSlots;
    private int sedanSlots;
    private int truckSlots;
    private int busSlots;

    private boolean available;
    private UserDTO user;
}
