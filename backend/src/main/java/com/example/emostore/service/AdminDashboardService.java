package com.example.emostore.service;

import com.example.emostore.repository.OrderRepository;
import com.example.emostore.repository.ProductRepository;
import com.example.emostore.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Map;

@Service
@RequiredArgsConstructor
public class AdminDashboardService {

    private final ProductRepository productRepository;
    private final OrderRepository orderRepository;
    private final UserRepository userRepository;

    public Map<String, Long> getDashboardStats() {
        return Map.of(
            "totalProducts", productRepository.count(),
            "totalOrders", orderRepository.count(),
            "totalUsers", userRepository.count()
        );
    }
}
