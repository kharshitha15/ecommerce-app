package com.example.emostore.dto;

import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class OrderRequest {
    
    @NotEmpty(message = "Items list cannot be empty")
    private List<OrderItemRequest> items;
    
    @NotNull(message = "Payment method is required")
    private String paymentMethod;
}

