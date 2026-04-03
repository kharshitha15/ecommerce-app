package com.example.emostore.controller;

import com.example.emostore.dto.OrderRequest;
import com.example.emostore.model.Order;
import com.example.emostore.service.OrderService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/orders")
public class OrderController {

    private final OrderService orderService;
    private final com.example.emostore.service.PaymentService paymentService;

    public OrderController(OrderService orderService, com.example.emostore.service.PaymentService paymentService) {
        this.orderService = orderService;
        this.paymentService = paymentService;
    }

    @PostMapping
    public ResponseEntity<?> placeOrder(@RequestBody OrderRequest orderRequest, Authentication authentication) {
        String email = authentication.getName();
        System.out.println("Processing order for user: " + email + ", method: " + orderRequest.getPaymentMethod());
        try {
            Order order = orderService.createOrder(orderRequest, email);
            
            if ("COD".equalsIgnoreCase(orderRequest.getPaymentMethod())) {
                System.out.println("COD Order created with ID: " + order.getId());
                return ResponseEntity.ok(java.util.Map.of(
                    "orderId", order.getId(),
                    "paymentMethod", "COD",
                    "status", "PLACED"
                ));
            } else {
                String rzpId = paymentService.createRazorpayOrder(order);
                System.out.println("Razorpay Order created: " + rzpId + " for Order: " + order.getId());
                return ResponseEntity.ok(java.util.Map.of(
                    "orderId", order.getId(),
                    "razorpayOrderId", rzpId,
                    "amount", order.getTotalAmount(),
                    "status", "CREATED"
                ));
            }
        } catch(Exception e) {
            System.err.println("CRITICAL ERROR IN ORDER PLACEMENT: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.badRequest().body(java.util.Map.of("error", e.getMessage()));
        }
    }

    @GetMapping
    public ResponseEntity<List<Order>> getUserOrders(Authentication authentication) {
        String email = authentication.getName();
        return ResponseEntity.ok(orderService.getUserOrders(email));
    }
}
