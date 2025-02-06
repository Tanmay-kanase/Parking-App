package com.example.demo.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "http://localhost:5173") // Allow frontend requests
public class GooglePlacesController {

    private final String API_KEY = "AIzaSyApoBOETb-W1x9P4xNUr9Vdy6SyKfUi3zM";

    @GetMapping("/nearby-places")
    public ResponseEntity<String> getNearbyPlaces(
            @RequestParam double lat,
            @RequestParam double lng,
            @RequestParam int radius,
            @RequestParam String type) {

        String url = "https://maps.googleapis.com/maps/api/place/nearbysearch/json?location="
                + lat + "," + lng + "&radius=" + radius + "&type=" + type + "&key=" + API_KEY;

        RestTemplate restTemplate = new RestTemplate();
        String result = restTemplate.getForObject(url, String.class);

        return ResponseEntity.ok(result);
    }
}
