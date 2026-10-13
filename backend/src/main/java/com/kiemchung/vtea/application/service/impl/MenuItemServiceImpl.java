package com.kiemchung.vtea.application.service.impl;

import com.kiemchung.vtea.application.service.MenuItemService;
import com.kiemchung.vtea.domain.dto.request.CreateMenuItemRequest;
import com.kiemchung.vtea.domain.dto.request.UpdateMenuItemRequest;
import com.kiemchung.vtea.domain.dto.response.MenuItemResponse;
import com.kiemchung.vtea.domain.entity.Category;
import com.kiemchung.vtea.domain.entity.Product;
import com.kiemchung.vtea.domain.repository.CategoryRepository;
import com.kiemchung.vtea.domain.repository.ProductRepository;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;

/**
 * Lớp thực thi các nghiệp vụ liên quan đến Menu (CRUD món nước).
 * Đồng bộ trực tiếp với bảng 'product' và 'category' chính thức của hệ thống.
 */
@Service
public class MenuItemServiceImpl implements MenuItemService {

    private final ProductRepository productRepository;
    private final CategoryRepository categoryRepository;

    public MenuItemServiceImpl(ProductRepository productRepository, CategoryRepository categoryRepository) {
        this.productRepository = productRepository;
        this.categoryRepository = categoryRepository;
    }

    /**
     * Lấy danh sách các món nước đang mở bán (isAvailable = true) trong DB và chuyển đổi sang DTO.
     */
    @Override
    public List<MenuItemResponse> getAllMenuItems() {
        return productRepository.findByIsAvailableTrue().stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    /**
     * Lấy thông tin chi tiết 1 món nước đang mở bán theo ID.
     */
    @Override
    public MenuItemResponse getMenuItemById(Long id) {
        Product product = productRepository.findById(id.intValue())
                .filter(p -> Boolean.TRUE.equals(p.getIsAvailable()))
                .orElseThrow(() -> new RuntimeException("Không tìm thấy món nước với ID: " + id));
        return mapToResponse(product);
    }

    /**
     * Thêm món nước mới vào thực đơn (bảng product).
     */
    @Override
    public MenuItemResponse createMenuItem(CreateMenuItemRequest request) {
        if (request.getName() == null || request.getName().trim().isEmpty()) {
            throw new RuntimeException("Tên món nước không được để trống!");
        }
        if (request.getPrice() == null || request.getPrice().compareTo(BigDecimal.ZERO) <= 0) {
            throw new RuntimeException("Giá bán phải lớn hơn 0!");
        }

        String trimmedName = request.getName().trim();
        if (productRepository.existsByName(trimmedName)) {
            throw new RuntimeException("Tên món nước đã tồn tại!");
        }

        Product product = new Product();
        product.setName(trimmedName);
        product.setPrice(request.getPrice());
        product.setImageUrl(request.getImageUrl());
        product.setIsAvailable(true);
        product.setCategory(resolveCategory(request.getCategory()));

        Product savedProduct = productRepository.save(product);
        return mapToResponse(savedProduct);
    }

    /**
     * Cập nhật thông tin món nước theo ID.
     */
    @Override
    public MenuItemResponse updateMenuItem(Long id, UpdateMenuItemRequest request) {
        Product product = productRepository.findById(id.intValue())
                .orElseThrow(() -> new RuntimeException("Không tìm thấy món nước với ID: " + id));

        if (request.getName() != null && !request.getName().trim().isEmpty()) {
            String newName = request.getName().trim();
            if (!newName.equalsIgnoreCase(product.getName()) && productRepository.existsByName(newName)) {
                throw new RuntimeException("Tên món nước đã tồn tại!");
            }
            product.setName(newName);
        }

        if (request.getPrice() != null) {
            if (request.getPrice().compareTo(BigDecimal.ZERO) <= 0) {
                throw new RuntimeException("Giá bán phải lớn hơn 0!");
            }
            product.setPrice(request.getPrice());
        }

        if (request.getImageUrl() != null) {
            product.setImageUrl(request.getImageUrl());
        }

        if (request.getCategory() != null && !request.getCategory().trim().isEmpty()) {
            product.setCategory(resolveCategory(request.getCategory()));
        }

        Product updatedProduct = productRepository.save(product);
        return mapToResponse(updatedProduct);
    }

    /**
     * Xóa món nước (Soft Delete: đặt isAvailable = false thay vì xóa hẳn khỏi DB).
     */
    @Override
    public void deleteMenuItem(Long id) {
        Product product = productRepository.findById(id.intValue())
                .orElseThrow(() -> new RuntimeException("Không tìm thấy món nước với ID: " + id));
        product.setIsAvailable(false);
        productRepository.save(product);
    }

    /**
     * Tìm danh mục theo tên, nếu chưa tồn tại thì tạo mới.
     */
    private Category resolveCategory(String categoryName) {
        String catName = (categoryName == null || categoryName.trim().isEmpty())
                ? "Khác"
                : categoryName.trim();
        return categoryRepository.findByNameIgnoreCase(catName)
                .orElseGet(() -> {
                    Category newCat = new Category();
                    newCat.setName(catName);
                    newCat.setIsAvailable(true);
                    return categoryRepository.save(newCat);
                });
    }

    /**
     * Hàm hỗ trợ chuyển đổi từ Product Entity -> MenuItemResponse DTO.
     */
    private MenuItemResponse mapToResponse(Product product) {
        Long id = product.getProductId() != null ? product.getProductId().longValue() : null;
        String categoryName = product.getCategory() != null ? product.getCategory().getName() : null;
        return new MenuItemResponse(
                id,
                product.getName(),
                null,
                product.getPrice(),
                product.getImageUrl(),
                categoryName
        );
    }
}
