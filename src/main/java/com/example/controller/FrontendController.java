package com.example.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class FrontendController {

    @GetMapping({
            "/signin",
            "/signup",
            "/profile",
            "/edit-profile",
            "/booking",
            "/do-booking",
            "/mybookings",
            "/admin",
            "/payments",
            "/verify",
            "/searchParking",
            "/show-parkings",
            "/show-parkings-nearby",
            "/upload-parking-location",
            "/upload-parking-slots",
            "/arch",
            "/parking-spots",
            "/parking-slots",
            "/park-history"
    })
    public String forwardReactRoutes() {
        return "forward:/index.html";
    }
}