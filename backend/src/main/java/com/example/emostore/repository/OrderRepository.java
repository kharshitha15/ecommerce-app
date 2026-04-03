package com.example.emostore.repository;

import com.example.emostore.model.Order;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface OrderRepository extends JpaRepository<Order, Long> {
    List<Order> findByUserId(Long userId);
    java.util.Optional<Order> findByRazorpayOrderId(String razorpayOrderId);
}
