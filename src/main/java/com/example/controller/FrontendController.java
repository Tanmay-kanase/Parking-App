package com.example.controller;

import jakarta.servlet.RequestDispatcher;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.boot.web.servlet.error.ErrorController;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
public class FrontendController implements ErrorController {

    @RequestMapping("/error")
    public String handleError(HttpServletRequest request) {
        Object status = request.getAttribute(RequestDispatcher.ERROR_STATUS_CODE);
        String uri = (String) request.getAttribute(RequestDispatcher.ERROR_REQUEST_URI);

        // If the error is a 404 Not Found
        if (status != null && Integer.valueOf(status.toString()) == HttpStatus.NOT_FOUND.value()) {

            // And it's NOT an API request
            if (uri != null && !uri.startsWith("/api/")) {
                // Forward to React to handle the frontend routing
                return "forward:/index.html";
            }
        }

        // For all other errors (500s, API 404s), use Spring's default error handling
        return "error";
    }
}