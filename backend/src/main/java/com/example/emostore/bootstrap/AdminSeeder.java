package com.example.emostore.bootstrap;

import com.example.emostore.model.Product;
import com.example.emostore.model.Role;
import com.example.emostore.model.User;
import com.example.emostore.repository.ProductRepository;
import com.example.emostore.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.util.List;

@Component
@RequiredArgsConstructor
@Slf4j
public class AdminSeeder implements CommandLineRunner {

    private final UserRepository userRepository;
    private final ProductRepository productRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {
        log.info("Starting database seeding...");
        loadUsers();
        loadProducts();
        log.info("Database seeding completed.");
    }

    private void loadUsers() {
        if (userRepository.count() == 0) {
            User admin = User.builder()
                    .firstName("Admin")
                    .lastName("User")
                    .email("admin@emostore.com")
                    .password(passwordEncoder.encode("admin123"))
                    .role(Role.ADMIN)
                    .enabled(true)
                    .build();
            userRepository.save(admin);
            
            User user = User.builder()
                    .firstName("John")
                    .lastName("Doe")
                    .email("user@emostore.com")
                    .password(passwordEncoder.encode("user123"))
                    .role(Role.USER)
                    .enabled(true)
                    .build();
            userRepository.save(user);
        }
    }

    private void loadProducts() {
        if (productRepository.count() == 0) {
            productRepository.saveAll(List.of(
                Product.builder().name("Wireless Noise-Cancelling Headphones").description("Premium over-ear headphones with active noise cancellation and 30-hour battery life.").price(new BigDecimal("299.99")).imageUrl("https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&q=80").stockQuantity(50).category("Electronics").build(),
                Product.builder().name("Smart Watch Series X").description("Advanced smartwatch with health tracking, GPS, and cellular connectivity.").price(new BigDecimal("399.00")).imageUrl("https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&q=80").stockQuantity(120).category("Electronics").build(),
                Product.builder().name("Minimalist Leather Backpack").description("Handcrafted from genuine leather, featuring a padded laptop sleeve and hidden pockets.").price(new BigDecimal("149.50")).imageUrl("https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500&q=80").stockQuantity(30).category("Accessories").build(),
                Product.builder().name("Mechanical Keyboard").description("Tenkeyless mechanical keyboard with RGB backlighting and tactile switches.").price(new BigDecimal("119.99")).imageUrl("https://images.unsplash.com/photo-1595225476474-87563907a212?w=500&q=80").stockQuantity(85).category("Accessories").build(),
                Product.builder().name("4K Ultra HD Monitor").description("27-inch 4K monitor with ultra-thin bezels, perfect for creative work and gaming.").price(new BigDecimal("450.00")).imageUrl("https://images.unsplash.com/photo-1527443154391-42078028ff7b?w=500&q=80").stockQuantity(25).category("Electronics").build(),
                Product.builder().name("Ceramic Coffee Mug").description("Hand-thrown ceramic mug with a unique glaze finish, 12oz capacity.").price(new BigDecimal("24.00")).imageUrl("https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?w=500&q=80").stockQuantity(200).category("Home").build(),
                Product.builder().name("Aroma Essential Oil Diffuser").description("Ultrasonic diffuser with LED lights and automatic shut-off.").price(new BigDecimal("45.99")).imageUrl("https://images.unsplash.com/photo-1602928321679-560bb453f190?w=500&q=80").stockQuantity(150).category("Home").build(),
                Product.builder().name("Fitness Smart Scale").description("Measures weight, body fat percentage, and muscle mass with app sync.").price(new BigDecimal("59.99")).imageUrl("https://images.unsplash.com/photo-1579626402482-eb064d7df6db?w=500&q=80").stockQuantity(80).category("Health").build()
            ));
        }
    }
}
