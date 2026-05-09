package com.example.dto;

import org.springframework.data.annotation.Id;

import lombok.Data;

@Data
public class ParkingLocationResponse {
    @Id
    private String locationId;
    private String name;
    private String address;
    private String city;
    private String state;
    private String zipCode;
    private int totalSlots;
    private Double lat;
    private Double lng;
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
