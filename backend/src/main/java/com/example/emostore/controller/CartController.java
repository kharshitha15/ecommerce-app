package com.example.emostore.controller;

import com.example.emostore.dto.CartDTO;
import com.example.emostore.model.User;
import com.example.emostore.service.CartService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/user/cart")
@RequiredArgsConstructor
public class CartController {

    private final CartService cartService;

    @GetMapping
    public ResponseEntity<CartDTO> getCart(@AuthenticationPrincipal User user) {
        return ResponseEntity.ok(cartService.getCartDTO(user));
    }

    @PostMapping("/add/{productId}")
    public ResponseEntity<CartDTO> addToCart(
            @AuthenticationPrincipal User user,
            @PathVariable Long productId,
            @RequestParam(defaultValue = "1") Integer quantity) {
        return ResponseEntity.ok(cartService.addToCart(user, productId, quantity));
    }

    @DeleteMapping("/remove/{productId}")
    public ResponseEntity<CartDTO> removeFromCart(
            @AuthenticationPrincipal User user,
            @PathVariable Long productId) {
        return ResponseEntity.ok(cartService.removeFromCart(user, productId));
    }
}
