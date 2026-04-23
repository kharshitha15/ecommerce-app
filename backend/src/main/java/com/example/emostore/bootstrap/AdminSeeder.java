package com.example.emostore.bootstrap;

import com.example.emostore.model.Category;
import com.example.emostore.model.Product;
import com.example.emostore.model.Role;
import com.example.emostore.model.User;
import com.example.emostore.repository.CategoryRepository;
import com.example.emostore.repository.ProductRepository;
import com.example.emostore.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

@Component
@RequiredArgsConstructor
@Slf4j
public class AdminSeeder implements CommandLineRunner {

    private final UserRepository userRepository;
    private final ProductRepository productRepository;
    private final CategoryRepository categoryRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {
        log.info("Starting database seeding process...");
        seedUsers();
        seedCategories();
        seedProducts();
        log.info("Database seeding process completed.");
    }

    private void seedUsers() {
        if (!userRepository.existsByEmail("admin@emostore.com")) {
            User admin = User.builder()
                    .firstName("Admin")
                    .lastName("User")
                    .email("admin@emostore.com")
                    .password(passwordEncoder.encode("admin123"))
                    .role(Role.ADMIN)
                    .enabled(true)
                    .build();
            userRepository.save(admin);
            log.info("Admin user created: admin@emostore.com / admin123");
        }

        if (!userRepository.existsByEmail("user@emostore.com")) {
            User user = User.builder()
                    .firstName("Default")
                    .lastName("User")
                    .email("user@emostore.com")
                    .password(passwordEncoder.encode("user123"))
                    .role(Role.USER)
                    .enabled(true)
                    .build();
            userRepository.save(user);
            log.info("Default user created: user@emostore.com / user123");
        }
    }

    private void seedCategories() {
        if (categoryRepository.count() == 0) {
            List<String> categories = List.of("Electronics", "Accessories", "Home", "Health");
            categories.forEach(name -> {
                categoryRepository.save(Category.builder().name(name).build());
            });
            log.info("Categories seeded.");
        }
    }

    private void seedProducts() {
        if (productRepository.count() == 0) {
            Category electronics = categoryRepository.findByName("Electronics").orElse(null);
            Category accessories = categoryRepository.findByName("Accessories").orElse(null);

            List<Product> products = List.of(
                Product.builder().name("Wireless Headphones").description("Noise cancelling").price(BigDecimal.valueOf(299.99)).stockQuantity(50).imageUrl("https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500").category(electronics).build(),
                Product.builder().name("Smart Watch").description("Fitness tracking").price(BigDecimal.valueOf(399.00)).stockQuantity(120).imageUrl("https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500").category(electronics).build(),
                Product.builder().name("Leather Backpack").description("Premium quality").price(BigDecimal.valueOf(149.50)).stockQuantity(30).imageUrl("https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500").category(accessories).build(),
                Product.builder().name("Mechanical Keyboard").description("RGB Lighting").price(BigDecimal.valueOf(119.99)).stockQuantity(85).imageUrl("https://images.unsplash.com/photo-1595225476474-87563907a212?w=500").category(accessories).build()
            );
            productRepository.saveAll(products);
            log.info("Products seeded.");
        }
    }
}
