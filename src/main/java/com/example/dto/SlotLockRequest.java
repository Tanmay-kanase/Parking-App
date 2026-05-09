package com.example.dto;

import lombok.Data;

@Data
public class SlotLockRequest {

    private String slotId;
    private String userId;
}