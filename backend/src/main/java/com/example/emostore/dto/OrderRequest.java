package com.example.emostore.dto;

import java.util.List;

public class OrderRequest {
    private List<OrderItemRequest> items;
    private String paymentMethod;

    public OrderRequest() {}
    public OrderRequest(List<OrderItemRequest> items, String paymentMethod) { 
        this.items = items; 
        this.paymentMethod = paymentMethod;
    }
    
    public List<OrderItemRequest> getItems() { return items; }
    public void setItems(List<OrderItemRequest> items) { this.items = items; }
    
    public String getPaymentMethod() { return paymentMethod; }
    public void setPaymentMethod(String paymentMethod) { this.paymentMethod = paymentMethod; }
}
