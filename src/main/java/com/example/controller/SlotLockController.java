package com.example.controller;

import com.example.events.SlotEvent;
import com.example.dto.SlotLockRequest;
import com.example.dto.SlotLockResponse;
import com.example.service.SlotLockService;
import lombok.RequiredArgsConstructor;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/slots")
@RequiredArgsConstructor
public class SlotLockController {

        private final SlotLockService slotLockService;
        private final SimpMessagingTemplate messagingTemplate;

        @PostMapping("/lock")
        public SlotLockResponse lockSlot(
                        @RequestBody SlotLockRequest request) {

                boolean locked = slotLockService.lockSlot(
                                request.getSlotId(),
                                request.getUserId());

                if (!locked) {
                        return new SlotLockResponse(
                                        false,
                                        "Slot already locked");
                }

                messagingTemplate.convertAndSend(
                                "/topic/slot-updates",
                                new SlotEvent(
                                                request.getSlotId(),
                                                request.getUserId(),
                                                "LOCKED"));

                return new SlotLockResponse(
                                true,
                                "Slot locked successfully");
        }

        @PostMapping("/unlock")
        public SlotLockResponse unlockSlot(
                        @RequestBody SlotLockRequest request) {

                String owner = slotLockService.getLockOwner(
                                request.getSlotId());

                if (owner == null || !owner.equals(request.getUserId())) {

                        return new SlotLockResponse(
                                        false,
                                        "You are not lock owner");
                }

                slotLockService.unlockSlot(request.getSlotId());

                messagingTemplate.convertAndSend(
                                "/topic/slot-updates",
                                new SlotEvent(
                                                request.getSlotId(),
                                                request.getUserId(),
                                                "UNLOCKED"));

                return new SlotLockResponse(
                                true,
                                "Slot unlocked");
        }
}