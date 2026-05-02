package com.example.emostore.service;

import com.example.emostore.dto.ProductDTO;
import com.example.emostore.exception.ResourceNotFoundException;
import com.example.emostore.model.Category;
import com.example.emostore.model.Product;
import com.example.emostore.repository.CategoryRepository;
import com.example.emostore.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class ProductService {

    private final ProductRepository productRepository;
    private final CategoryRepository categoryRepository;

    @Cacheable(value = "products", key = "#pageable.pageNumber + '-' + #pageable.pageSize")
    public Page<ProductDTO> getAllProducts(Pageable pageable) {
        log.info("Fetching products with pagination: {}", pageable);
        return productRepository.findAll(pageable)
                .map(this::convertToDTO);
    }

    @Cacheable(value = "product", key = "#id")
    public ProductDTO getProductById(Long id) {
        log.debug("Fetching product by id: {}", id);
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found with id: " + id));
        return convertToDTO(product);
    }

    /**
     * allEntries=true is needed because the 'products' cache uses pagination as part of the key.
     * When a new product is added, we don't know which page it will appear on, so we must 
     * invalidate the entire collection cache to ensure consistency.
     */
    @CacheEvict(value = "products", allEntries = true)
    public ProductDTO createProduct(ProductDTO productDTO) {
        log.info("Creating new product: {}", productDTO.getName());
        Product product = convertToEntity(productDTO);
        
        if (productDTO.getCategoryName() != null) {
            Category category = categoryRepository.findByName(productDTO.getCategoryName())
                    .orElseGet(() -> categoryRepository.save(Category.builder().name(productDTO.getCategoryName()).build()));
            product.setCategory(category);
        }
        
        Product savedProduct = productRepository.save(product);
        return convertToDTO(savedProduct);
    }

    @CacheEvict(value = {"products", "product"}, allEntries = true)
    public ProductDTO updateProduct(Long id, ProductDTO productDTO) {
        log.info("Updating product with id: {}", id);
        Product existingProduct = productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found with id: " + id));
        
        existingProduct.setName(productDTO.getName());
        existingProduct.setDescription(productDTO.getDescription());
        existingProduct.setPrice(productDTO.getPrice());
        existingProduct.setImageUrl(productDTO.getImageUrl());
        existingProduct.setStockQuantity(productDTO.getStockQuantity());
        
        if (productDTO.getCategoryName() != null) {
            Category category = categoryRepository.findByName(productDTO.getCategoryName())
                    .orElseGet(() -> categoryRepository.save(Category.builder().name(productDTO.getCategoryName()).build()));
            existingProduct.setCategory(category);
        }
        
        Product updatedProduct = productRepository.save(existingProduct);
        return convertToDTO(updatedProduct);
    }

    @CacheEvict(value = {"products", "product"}, allEntries = true)
    public void deleteProduct(Long id) {
        log.warn("Deleting product with id: {}", id);
        if (!productRepository.existsById(id)) {
            throw new ResourceNotFoundException("Product not found with id: " + id);
        }
        productRepository.deleteById(id);
    }

    public List<ProductDTO> searchProducts(String name) {
        return productRepository.findByNameContainingIgnoreCase(name).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    private ProductDTO convertToDTO(Product product) {
        return ProductDTO.builder()
                .id(product.getId())
                .name(product.getName())
                .description(product.getDescription())
                .price(product.getPrice())
                .imageUrl(product.getImageUrl())
                .stockQuantity(product.getStockQuantity())
                .categoryName(product.getCategory() != null ? product.getCategory().getName() : null)
                .build();
    }

    private Product convertToEntity(ProductDTO dto) {
        return Product.builder()
                .id(dto.getId())
                .name(dto.getName())
                .description(dto.getDescription())
                .price(dto.getPrice())
                .imageUrl(dto.getImageUrl())
                .stockQuantity(dto.getStockQuantity())
                .build();
    }
}

