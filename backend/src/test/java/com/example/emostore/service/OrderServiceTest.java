package com.example.emostore.service;

import com.example.emostore.dto.OrderItemRequest;
import com.example.emostore.dto.OrderRequest;
import com.example.emostore.exception.InsufficientStockException;
import com.example.emostore.exception.ResourceNotFoundException;
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
import org.springframework.orm.ObjectOptimisticLockingFailureException;

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
        user = User.builder()
                .id(1L)
                .email("test@example.com")
                .build();

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
        orderRequest.setItems(List.of(itemRequest));
        orderRequest.setPaymentMethod("COD");
    }

    @Test
    void createOrder_Success() {
        when(userRepository.findByEmail(anyString())).thenReturn(Optional.of(user));
        when(productRepository.findById(1L)).thenReturn(Optional.of(product));
        when(orderRepository.save(any(Order.class))).thenAnswer(i -> i.getArguments()[0]);

        Order createdOrder = orderService.createOrder(orderRequest, "test@example.com");

        assertNotNull(createdOrder);
        assertEquals(user, createdOrder.getUser());
        assertEquals(BigDecimal.valueOf(200), createdOrder.getTotalAmount());
        assertEquals(8, product.getStockQuantity());
        verify(productRepository, times(1)).saveAndFlush(product);
    }

    @Test
    void createOrder_ThrowsInsufficientStockException() {
        product.setStockQuantity(1);
        when(userRepository.findByEmail(anyString())).thenReturn(Optional.of(user));
        when(productRepository.findById(1L)).thenReturn(Optional.of(product));

        assertThrows(InsufficientStockException.class, () -> orderService.createOrder(orderRequest, "test@example.com"));
    }

    @Test
    void createOrder_ThrowsOptimisticLockException() {
        when(userRepository.findByEmail(anyString())).thenReturn(Optional.of(user));
        when(productRepository.findById(1L)).thenReturn(Optional.of(product));
        doThrow(new ObjectOptimisticLockingFailureException(Product.class, 1L))
                .when(productRepository).saveAndFlush(any(Product.class));

        RuntimeException exception = assertThrows(RuntimeException.class, () -> orderService.createOrder(orderRequest, "test@example.com"));
        assertTrue(exception.getMessage().contains("Product stock was updated by another transaction"));
    }

    @Test
    void createOrder_ThrowsUserNotFound() {
        when(userRepository.findByEmail(anyString())).thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class, () -> orderService.createOrder(orderRequest, "test@example.com"));
    }
}
