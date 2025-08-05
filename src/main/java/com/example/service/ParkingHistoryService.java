package com.example.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.example.model.ParkingHistory;
import com.example.repository.ParkingHistoryRepository;

import java.util.List;

@Service
public class ParkingHistoryService {

    @Autowired
    private ParkingHistoryRepository parkingHistoryRepository;

    public List<ParkingHistory> getHistoryByUserId(String userId) {
        return parkingHistoryRepository.findByUserId(userId);
    }

    public List<ParkingHistory> getHistoryByVehicleId(String vehicleId) {
        return parkingHistoryRepository.findByVehicleId(vehicleId);
    }

    public ParkingHistory saveParkingHistory(ParkingHistory parkingHistory) {
    return parkingHistoryRepository.save(parkingHistory);
}

}
