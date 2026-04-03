package com.example.emostore.repository;

import com.example.emostore.model.Cart;
import com.example.emostore.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface CartRepository extends JpaRepository<Cart, Long> {
    Optional<Cart> findByUser(User user);
}
