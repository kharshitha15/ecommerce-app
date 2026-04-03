package com.example.emostore.repository;

import com.example.emostore.model.Cart;
import com.example.emostore.model.CartItem;
import com.example.emostore.model.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface CartItemRepository extends JpaRepository<CartItem, Long> {
    Optional<CartItem> findByCartAndProduct(Cart cart, Product product);
}
