package com.example.emostore.controller;

import com.example.emostore.dto.ApiResponse;
import com.example.emostore.dto.AuthRequest;
import com.example.emostore.dto.AuthResponse;
import com.example.emostore.dto.RegisterRequest;
import com.example.emostore.service.AuthService;
import com.example.emostore.service.RateLimitService;
import io.github.bucket4j.Bucket;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService service;
    private final RateLimitService rateLimitService;

    @PostMapping("/register")
    public ResponseEntity<ApiResponse<AuthResponse>> register(@Valid @RequestBody RegisterRequest request) {
        return ResponseEntity.ok(ApiResponse.success("User registered successfully", service.register(request)));
    }

    @PostMapping("/login")
    public ResponseEntity<ApiResponse<AuthResponse>> authenticate(@Valid @RequestBody AuthRequest request, HttpServletRequest servletRequest) {
        String ip = servletRequest.getRemoteAddr();
        Bucket bucket = rateLimitService.resolveBucket(ip);
        
        if (bucket.tryConsume(1)) {
            return ResponseEntity.ok(ApiResponse.success("User authenticated successfully", service.authenticate(request)));
        }
        
        return ResponseEntity.status(HttpStatus.TOO_MANY_REQUESTS)
                .body(ApiResponse.error("Too many login attempts. Please try again in a minute."));
    }
}
