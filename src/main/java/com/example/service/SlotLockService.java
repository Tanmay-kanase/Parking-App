package com.example.service;

import lombok.RequiredArgsConstructor;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Service;

import java.time.Duration;

@Service
@RequiredArgsConstructor
public class SlotLockService {

    private final StringRedisTemplate redisTemplate;

    private static final long LOCK_TIME = 300;

    public boolean lockSlot(String slotId, String userId) {

        String key = "lock:slot:" + slotId;

        Boolean success = redisTemplate
                .opsForValue()
                .setIfAbsent(
                        key,
                        userId,
                        Duration.ofSeconds(LOCK_TIME));

        return Boolean.TRUE.equals(success);
    }

    public void unlockSlot(String slotId) {

        String key = "lock:slot:" + slotId;

        redisTemplate.delete(key);
    }

    public String getLockOwner(String slotId) {

        String key = "lock:slot:" + slotId;

        return redisTemplate.opsForValue().get(key);
    }

    public boolean isLocked(String slotId) {

        String key = "lock:slot:" + slotId;

        return Boolean.TRUE.equals(redisTemplate.hasKey(key));
    }
}