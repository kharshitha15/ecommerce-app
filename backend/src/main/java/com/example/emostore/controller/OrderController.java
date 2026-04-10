package com.example.emostore.controller;

import com.example.emostore.dto.OrderRequest;
import com.example.emostore.model.Order;
import com.example.emostore.service.OrderService;
import com.example.emostore.service.PaymentService;
import jakarta.validation.Valid;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/orders")
@Slf4j
public class OrderController {

    private final OrderService orderService;
    private final PaymentService paymentService;

    public OrderController(OrderService orderService, PaymentService paymentService) {
        this.orderService = orderService;
        this.paymentService = paymentService;
    }

    @PostMapping
    public ResponseEntity<?> placeOrder(@Valid @RequestBody OrderRequest orderRequest, Authentication authentication) {
        String email = authentication.getName();
        log.info("Processing order for user: {}, method: {}", email, orderRequest.getPaymentMethod());
        
        Order order = orderService.createOrder(orderRequest, email);
        
        if ("COD".equalsIgnoreCase(orderRequest.getPaymentMethod())) {
            log.info("COD Order created with ID: {}", order.getId());
            return ResponseEntity.ok(Map.of(
                "orderId", order.getId(),
                "paymentMethod", "COD",
                "status", "PLACED"
            ));
        } else {
            String rzpId = paymentService.createRazorpayOrder(order);
            log.info("Razorpay Order created: {} for Order: {}", rzpId, order.getId());
            return ResponseEntity.ok(Map.of(
                "orderId", order.getId(),
                "razorpayOrderId", rzpId,
                "amount", order.getTotalAmount(),
                "status", "CREATED"
            ));
        }
    }

    @GetMapping
    public ResponseEntity<List<Order>> getUserOrders(Authentication authentication) {
        String email = authentication.getName();
        return ResponseEntity.ok(orderService.getUserOrders(email));
    }
}

