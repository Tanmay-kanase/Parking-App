package com.example.events;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class SlotEvent {

    private String slotId;
    private String userId;
    private String status;
}