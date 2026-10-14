package com.kiemchung.vtea.presentation.controller;

import com.kiemchung.vtea.domain.dto.response.PosProductResponse;
import com.kiemchung.vtea.domain.entity.Category;
import com.kiemchung.vtea.domain.entity.Product;
import com.kiemchung.vtea.domain.repository.ProductRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/products")
public class ProductController {

    private final ProductRepository productRepository;

    public ProductController(ProductRepository productRepository) {
        this.productRepository = productRepository;
    }

    @GetMapping
    public ResponseEntity<List<PosProductResponse>> getProducts(
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) String search,
            @RequestParam(required = false) Integer categoryId,
            @RequestParam(required = false) String category) {
        String effectiveKeyword = normalize(firstNonBlank(keyword, search));
        String effectiveCategory = normalize(category);

        List<PosProductResponse> response = productRepository
                .searchAvailableProductsForPos(effectiveKeyword, categoryId, effectiveCategory)
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());

        return ResponseEntity.ok(response);
    }

    private PosProductResponse mapToResponse(Product product) {
        Category category = product.getCategory();
        Integer categoryId = category != null ? category.getCategoryId() : null;
        String categoryName = category != null ? category.getName() : null;

        return new PosProductResponse(
                product.getProductId(),
                product.getName(),
                product.getPrice(),
                product.getImageUrl(),
                categoryId,
                categoryName
        );
    }

    private String firstNonBlank(String first, String second) {
        return normalize(first) != null ? first : second;
    }

    private String normalize(String value) {
        if (value == null || value.trim().isEmpty() || "Tất cả".equalsIgnoreCase(value.trim())) {
            return null;
        }
        return value.trim();
    }
}
