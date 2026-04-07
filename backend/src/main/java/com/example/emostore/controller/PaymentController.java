package com.example.emostore.controller;

import com.example.emostore.dto.ApiResponse;
import com.example.emostore.dto.PaymentCallbackRequest;
import com.example.emostore.service.PaymentService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/v1/payment")
@RequiredArgsConstructor
public class PaymentController {

    private final PaymentService paymentService;

    @PostMapping("/verify")
    public ResponseEntity<ApiResponse<Object>> verifyPayment(@RequestBody PaymentCallbackRequest request) {
        boolean isValid = paymentService.verifyPaymentSignature(
                request.getRazorpayOrderId(),
                request.getRazorpayPaymentId(),
                request.getRazorpaySignature()
        );

        if (isValid) {
            return ResponseEntity.ok(ApiResponse.success("Payment verified successfully", null));
        } else {
            return ResponseEntity.badRequest().body(ApiResponse.error("Payment verification failed"));
        }
    }

    @PostMapping("/simulate")
    public ResponseEntity<ApiResponse<Object>> simulatePayment(@RequestParam boolean success) {
        if (success) {
            return ResponseEntity.ok(ApiResponse.success("Payment Simulation: Success", null));
        } else {
            return ResponseEntity.badRequest().body(ApiResponse.error("Payment Simulation: Failure"));
        }
    }
}
