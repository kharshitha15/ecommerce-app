package com.example.emostore.service;

import com.example.emostore.dto.CartDTO;
import com.example.emostore.exception.ResourceNotFoundException;
import com.example.emostore.model.Cart;
import com.example.emostore.model.CartItem;
import com.example.emostore.model.Product;
import com.example.emostore.model.User;
import com.example.emostore.repository.CartItemRepository;
import com.example.emostore.repository.CartRepository;
import com.example.emostore.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class CartService {

    private final CartRepository cartRepository;
    private final CartItemRepository cartItemRepository;
    private final ProductRepository productRepository;

    public CartDTO getCartDTO(User user) {
        Cart cart = getOrCreateCart(user);
        return convertToDTO(cart);
    }

    @Transactional
    public CartDTO addToCart(User user, Long productId, Integer quantity) {
        log.info("Adding product {} to cart for user {}", productId, user.getEmail());
        Cart cart = getOrCreateCart(user);
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found"));

        Optional<CartItem> existingItem = cartItemRepository.findByCartAndProduct(cart, product);
        
        if (existingItem.isPresent()) {
            CartItem item = existingItem.get();
            item.setQuantity(item.getQuantity() + quantity);
            cartItemRepository.save(item);
        } else {
            CartItem newItem = CartItem.builder()
                    .cart(cart)
                    .product(product)
                    .quantity(quantity)
                    .build();
            cartItemRepository.save(newItem);
            cart.getItems().add(newItem);
        }

        return convertToDTO(cartRepository.save(cart));
    }

    @Transactional
    public CartDTO removeFromCart(User user, Long productId) {
        log.info("Removing product {} from cart for user {}", productId, user.getEmail());
        Cart cart = getOrCreateCart(user);
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found"));

        CartItem item = cartItemRepository.findByCartAndProduct(cart, product)
                .orElseThrow(() -> new ResourceNotFoundException("Product not in cart"));

        cart.getItems().remove(item);
        cartItemRepository.delete(item);

        return convertToDTO(cartRepository.save(cart));
    }

    private Cart getOrCreateCart(User user) {
        return cartRepository.findByUser(user)
                .orElseGet(() -> cartRepository.save(Cart.builder().user(user).items(new ArrayList<>()).build()));
    }

    private CartDTO convertToDTO(Cart cart) {
        List<CartDTO.CartItemDTO> itemDTOs = cart.getItems().stream()
                .map(item -> CartDTO.CartItemDTO.builder()
                        .id(item.getId())
                        .productId(item.getProduct().getId())
                        .productName(item.getProduct().getName())
                        .productImageUrl(item.getProduct().getImageUrl())
                        .productPrice(item.getProduct().getPrice())
                        .quantity(item.getQuantity())
                        .subtotal(item.getProduct().getPrice().multiply(BigDecimal.valueOf(item.getQuantity())))
                        .build())
                .collect(Collectors.toList());

        BigDecimal total = itemDTOs.stream()
                .map(CartDTO.CartItemDTO::getSubtotal)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        return CartDTO.builder()
                .id(cart.getId())
                .items(itemDTOs)
                .totalAmount(total)
                .build();
    }
}
