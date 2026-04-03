package com.example.emostore.bootstrap;

import com.example.emostore.model.Product;
import com.example.emostore.model.Role;
import com.example.emostore.model.User;
import com.example.emostore.repository.ProductRepository;
import com.example.emostore.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.util.List;

@Component
public class AdminSeeder implements CommandLineRunner {

    private final UserRepository userRepository;
    private final ProductRepository productRepository;
    private final PasswordEncoder passwordEncoder;
    
    public AdminSeeder(UserRepository userRepository, ProductRepository productRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.productRepository = productRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) {
        loadUsers();
        loadProducts();
    }

    private void loadUsers() {
        if (userRepository.count() == 0) {
            User admin = new User();
            admin.setFirstName("Admin");
            admin.setLastName("User");
            admin.setEmail("admin@emostore.com");
            admin.setPassword(passwordEncoder.encode("admin123"));
            admin.setRole(Role.ADMIN);
            userRepository.save(admin);
            
            User user = new User();
            user.setFirstName("John");
            user.setLastName("Doe");
            user.setEmail("user@emostore.com");
            user.setPassword(passwordEncoder.encode("user123"));
            user.setRole(Role.USER);
            userRepository.save(user);
        }
    }

    private void loadProducts() {
        if (productRepository.count() == 0) {
            productRepository.saveAll(List.of(
                new Product(null, "Wireless Noise-Cancelling Headphones", "Premium over-ear headphones with active noise cancellation and 30-hour battery life.", new BigDecimal("299.99"), "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&q=80", 50, "Electronics"),
                new Product(null, "Smart Watch Series X", "Advanced smartwatch with health tracking, GPS, and cellular connectivity.", new BigDecimal("399.00"), "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&q=80", 120, "Electronics"),
                new Product(null, "Minimalist Leather Backpack", "Handcrafted from genuine leather, featuring a padded laptop sleeve and hidden pockets.", new BigDecimal("149.50"), "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500&q=80", 30, "Accessories"),
                new Product(null, "Mechanical Keyboard", "Tenkeyless mechanical keyboard with RGB backlighting and tactile switches.", new BigDecimal("119.99"), "https://images.unsplash.com/photo-1595225476474-87563907a212?w=500&q=80", 85, "Accessories"),
                new Product(null, "4K Ultra HD Monitor", "27-inch 4K monitor with ultra-thin bezels, perfect for creative work and gaming.", new BigDecimal("450.00"), "https://images.unsplash.com/photo-1527443154391-42078028ff7b?w=500&q=80", 25, "Electronics"),
                new Product(null, "Ceramic Coffee Mug", "Hand-thrown ceramic mug with a unique glaze finish, 12oz capacity.", new BigDecimal("24.00"), "https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?w=500&q=80", 200, "Home"),
                new Product(null, "Aroma Essential Oil Diffuser", "Ultrasonic diffuser with LED lights and automatic shut-off.", new BigDecimal("45.99"), "https://images.unsplash.com/photo-1602928321679-560bb453f190?w=500&q=80", 150, "Home"),
                new Product(null, "Fitness Smart Scale", "Measures weight, body fat percentage, and muscle mass with app sync.", new BigDecimal("59.99"), "https://images.unsplash.com/photo-1579626402482-eb064d7df6db?w=500&q=80", 80, "Health")
            ));
        }
    }
}
