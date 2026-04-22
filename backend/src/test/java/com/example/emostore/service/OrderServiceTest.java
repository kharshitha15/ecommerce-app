package com.example.emostore.service;

import com.example.emostore.dto.OrderItemRequest;
import com.example.emostore.dto.OrderRequest;
import com.example.emostore.exception.InsufficientStockException;
import com.example.emostore.model.Order;
import com.example.emostore.model.Product;
import com.example.emostore.model.User;
import com.example.emostore.repository.OrderRepository;
import com.example.emostore.repository.ProductRepository;
import com.example.emostore.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class OrderServiceTest {

    @Mock
    private OrderRepository orderRepository;
    @Mock
    private ProductRepository productRepository;
    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private OrderService orderService;

    private User user;
    private Product product;
    private OrderRequest orderRequest;

    @BeforeEach
    void setUp() {
        user = User.builder().id(1L).email("john@example.com").build();
        product = Product.builder()
                .id(1L)
                .name("Test Product")
                .price(BigDecimal.valueOf(100))
                .stockQuantity(10)
                .build();
        
        OrderItemRequest itemRequest = new OrderItemRequest();
        itemRequest.setProductId(1L);
        itemRequest.setQuantity(2);
        
        orderRequest = new OrderRequest();
        orderRequest.setPaymentMethod("COD");
        orderRequest.setItems(List.of(itemRequest));
    }

    @Test
    void createOrder_Success() {
        when(userRepository.findByEmail(anyString())).thenReturn(Optional.of(user));
        when(productRepository.findById(1L)).thenReturn(Optional.of(product));
        when(orderRepository.save(any(Order.class))).thenAnswer(invocation -> invocation.getArgument(0));

        Order order = orderService.createOrder(orderRequest, "john@example.com");

        assertNotNull(order);
        assertEquals(8, product.getStockQuantity()); // 10 - 2
        verify(productRepository, times(1)).save(product);
        verify(orderRepository, times(1)).save(any(Order.class));
    }

    @Test
    void createOrder_ThrowsInsufficientStockException() {
        product.setStockQuantity(1); // Only 1 in stock, request wants 2
        when(userRepository.findByEmail(anyString())).thenReturn(Optional.of(user));
        when(productRepository.findById(1L)).thenReturn(Optional.of(product));

        assertThrows(InsufficientStockException.class, () -> orderService.createOrder(orderRequest, "john@example.com"));
        verify(orderRepository, never()).save(any(Order.class));
    }
}
