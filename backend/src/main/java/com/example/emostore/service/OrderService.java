package com.example.emostore.service;

import com.example.emostore.dto.OrderItemRequest;
import com.example.emostore.dto.OrderRequest;
import com.example.emostore.exception.ResourceNotFoundException;
import com.example.emostore.model.Order;
import com.example.emostore.model.OrderItem;
import com.example.emostore.model.Product;
import com.example.emostore.model.User;
import com.example.emostore.repository.OrderRepository;
import com.example.emostore.repository.ProductRepository;
import com.example.emostore.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class OrderService {

    private final OrderRepository orderRepository;
    private final ProductRepository productRepository;
    private final UserRepository userRepository;

    @Transactional
    public Order createOrder(OrderRequest orderRequest, String email) {
        log.info("Creating order for user: {}", email);
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        
        Order order = Order.builder()
                .user(user)
                .orderDate(LocalDateTime.now())
                .paymentMethod(orderRequest.getPaymentMethod())
                .items(new ArrayList<>())
                .build();

        BigDecimal totalAmount = BigDecimal.ZERO;

        for (OrderItemRequest itemRequest : orderRequest.getItems()) {
            Product product = productRepository.findById(itemRequest.getProductId())
                    .orElseThrow(() -> new ResourceNotFoundException("Product not found: " + itemRequest.getProductId()));

            // Task 3: Add stock quantity validation
            if (product.getStockQuantity() < itemRequest.getQuantity()) {
                throw new RuntimeException("Insufficient stock for product: " + product.getName() + 
                                         ". Available: " + product.getStockQuantity());
            }

            // Task 3: Deduct stock quantity
            product.setStockQuantity(product.getStockQuantity() - itemRequest.getQuantity());
            productRepository.save(product);

            OrderItem orderItem = OrderItem.builder()
                    .order(order)
                    .product(product)
                    .quantity(itemRequest.getQuantity())
                    .price(product.getPrice())
                    .build();
            order.getItems().add(orderItem);

            totalAmount = totalAmount.add(product.getPrice().multiply(new BigDecimal(itemRequest.getQuantity())));
        }

        order.setTotalAmount(totalAmount);

        if ("COD".equalsIgnoreCase(orderRequest.getPaymentMethod())) {
            order.setPaymentStatus("PENDING_COD");
            order.setStatus("PLACED");
        } else {
            order.setPaymentStatus("INITIALIZING");
            order.setStatus("PENDING_PAYMENT");
        }

        return orderRepository.save(order);
    }

    public List<Order> getUserOrders(String email) {
        log.debug("Fetching orders for user: {}", email);
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        return orderRepository.findByUserId(user.getId());
    }

    public List<Order> getAllOrders() {
        log.info("Fetching all orders for admin");
        return orderRepository.findAll();
    }

    @Transactional
    public Order updateOrderStatus(Long id, String status) {
        log.info("Updating order status for id: {} to {}", id, status);
        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found with id: " + id));
        order.setStatus(status);
        return orderRepository.save(order);
    }
}

