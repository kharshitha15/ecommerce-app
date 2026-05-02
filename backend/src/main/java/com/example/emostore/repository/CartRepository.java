package com.example.emostore.repository;

import com.example.emostore.model.Cart;
import com.example.emostore.model.User;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface CartRepository extends JpaRepository<Cart, Long> {
    
    @EntityGraph(attributePaths = {"items", "items.product"})
    Optional<Cart> findByUser(User user);
}
