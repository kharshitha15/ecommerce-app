package com.example.emostore.service;

import com.example.emostore.dto.OrderItemRequest;
import com.example.emostore.dto.OrderRequest;
import com.example.emostore.model.Order;
import com.example.emostore.model.OrderItem;
import com.example.emostore.model.Product;
import com.example.emostore.model.User;
import com.example.emostore.repository.OrderRepository;
import com.example.emostore.repository.ProductRepository;
import com.example.emostore.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Service
public class OrderService {

    private final OrderRepository orderRepository;
    private final ProductRepository productRepository;
    private final UserRepository userRepository;

    public OrderService(OrderRepository orderRepository, ProductRepository productRepository, UserRepository userRepository) {
        this.orderRepository = orderRepository;
        this.productRepository = productRepository;
        this.userRepository = userRepository;
    }

    @Transactional
    public Order createOrder(OrderRequest orderRequest, String email) {
        User user = userRepository.findByEmail(email).orElseThrow(() -> new RuntimeException("User not found"));
        
        Order order = new Order();
        order.setUser(user);
        order.setOrderDate(LocalDateTime.now());
        order.setPaymentMethod(orderRequest.getPaymentMethod());

        List<OrderItem> items = new ArrayList<>();
        BigDecimal totalAmount = BigDecimal.ZERO;

        for (OrderItemRequest itemRequest : orderRequest.getItems()) {
            Long productId = itemRequest.getProductId();
            if (productId == null) throw new RuntimeException("Product ID cannot be null");
            
            Product product = productRepository.findById(productId)
                    .orElseThrow(() -> new RuntimeException("Product not found"));

            OrderItem orderItem = new OrderItem();
            orderItem.setOrder(order);
            orderItem.setProduct(product);
            orderItem.setQuantity(itemRequest.getQuantity());
            orderItem.setPrice(product.getPrice());
            items.add(orderItem);

            totalAmount = totalAmount.add(product.getPrice().multiply(new BigDecimal(itemRequest.getQuantity())));
        }

        order.setItems(items);
        order.setTotalAmount(totalAmount);

        if ("COD".equalsIgnoreCase(orderRequest.getPaymentMethod())) {
            order.setPaymentStatus("PENDING_COD");
            order.setStatus("PLACED");
        } else {
            order.setPaymentStatus("INITIALIZING");
            order.setStatus("PENDING_PAYMENT");
        }

        Order savedOrder = orderRepository.save(order);
        return savedOrder;
    }


    public List<Order> getUserOrders(String email) {
        User user = userRepository.findByEmail(email).orElseThrow(() -> new RuntimeException("User not found"));
        return orderRepository.findByUserId(user.getId());
    }
}
