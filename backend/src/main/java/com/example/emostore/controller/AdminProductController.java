package com.example.emostore.controller;

import com.example.emostore.dto.ProductDTO;
import com.example.emostore.service.CloudinaryService;
import com.example.emostore.service.ProductService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.math.BigDecimal;

@RestController
@RequestMapping("/api/v1/admin/products")
@RequiredArgsConstructor
public class AdminProductController {

    private final ProductService productService;
    private final CloudinaryService cloudinaryService;

    @PostMapping
    public ResponseEntity<ProductDTO> addProduct(
            @RequestParam("name") String name,
            @RequestParam("description") String description,
            @RequestParam("price") BigDecimal price,
            @RequestParam("stockQuantity") Integer stockQuantity,
            @RequestParam("category") String category,
            @RequestParam(value = "image", required = false) MultipartFile imageFile) throws IOException {

        ProductDTO productDTO = ProductDTO.builder()
                .name(name)
                .description(description)
                .price(price)
                .stockQuantity(stockQuantity)
                .category(category)
                .build();

        if (imageFile != null && !imageFile.isEmpty()) {
            String secureUrl = cloudinaryService.upload(imageFile);
            productDTO.setImageUrl(secureUrl);
        }

        return ResponseEntity.ok(productService.createProduct(productDTO));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ProductDTO> editProduct(
            @PathVariable Long id,
            @RequestParam("name") String name,
            @RequestParam("description") String description,
            @RequestParam("price") BigDecimal price,
            @RequestParam("stockQuantity") Integer stockQuantity,
            @RequestParam("category") String category,
            @RequestParam(value = "image", required = false) MultipartFile imageFile) throws IOException {

        ProductDTO productDTO = ProductDTO.builder()
                .name(name)
                .description(description)
                .price(price)
                .stockQuantity(stockQuantity)
                .category(category)
                .build();

        if (imageFile != null && !imageFile.isEmpty()) {
            String secureUrl = cloudinaryService.upload(imageFile);
            productDTO.setImageUrl(secureUrl);
        }

        return ResponseEntity.ok(productService.updateProduct(id, productDTO));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteProduct(@PathVariable Long id) {
        productService.deleteProduct(id);
        return ResponseEntity.noContent().build();
    }
}
