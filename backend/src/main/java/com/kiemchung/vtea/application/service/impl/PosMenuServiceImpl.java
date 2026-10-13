package com.kiemchung.vtea.application.service.impl;

import com.kiemchung.vtea.application.service.PosMenuService;
import com.kiemchung.vtea.domain.dto.response.CategoryResponse;
import com.kiemchung.vtea.domain.dto.response.PosMenuResponse;
import com.kiemchung.vtea.domain.dto.response.PosProductResponse;
import com.kiemchung.vtea.domain.dto.response.ToppingResponse;
import com.kiemchung.vtea.domain.entity.Category;
import com.kiemchung.vtea.domain.entity.Product;
import com.kiemchung.vtea.domain.entity.Topping;
import com.kiemchung.vtea.domain.repository.CategoryRepository;
import com.kiemchung.vtea.domain.repository.ProductRepository;
import com.kiemchung.vtea.domain.repository.ToppingRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

/**
 * Lớp thực thi nghiệp vụ lấy toàn bộ danh sách Menu + Topping tối ưu cho màn hình POS.
 */
@Service
public class PosMenuServiceImpl implements PosMenuService {

    private final CategoryRepository categoryRepository;
    private final ProductRepository productRepository;
    private final ToppingRepository toppingRepository;

    public PosMenuServiceImpl(CategoryRepository categoryRepository,
                              ProductRepository productRepository,
                              ToppingRepository toppingRepository) {
        this.categoryRepository = categoryRepository;
        this.productRepository = productRepository;
        this.toppingRepository = toppingRepository;
    }

    @Override
    @Transactional(readOnly = true)
    public PosMenuResponse getPosMenu(String keyword, Integer categoryId, String categoryName) {
        String normalizedKeyword = (keyword != null && !keyword.trim().isEmpty())
                ? keyword.trim()
                : null;

        String normalizedCatName = (categoryName != null
                && !categoryName.trim().isEmpty()
                && !"Tất cả".equalsIgnoreCase(categoryName.trim()))
                ? categoryName.trim()
                : null;

        List<CategoryResponse> categories = categoryRepository.findByIsAvailableTrue().stream()
                .map(this::mapCategoryToResponse)
                .collect(Collectors.toList());

        List<PosProductResponse> products = productRepository
                .searchAvailableProductsForPos(normalizedKeyword, categoryId, normalizedCatName)
                .stream()
                .map(this::mapProductToResponse)
                .collect(Collectors.toList());

        List<ToppingResponse> toppings = toppingRepository.findByIsAvailableTrue().stream()
                .map(this::mapToppingToResponse)
                .collect(Collectors.toList());

        return new PosMenuResponse(categories, products, toppings);
    }

    private CategoryResponse mapCategoryToResponse(Category category) {
        return new CategoryResponse(
                category.getCategoryId(),
                category.getName(),
                category.getIsAvailable()
        );
    }

    private PosProductResponse mapProductToResponse(Product product) {
        Category cat = product.getCategory();
        Integer catId = cat != null ? cat.getCategoryId() : null;
        String catName = cat != null ? cat.getName() : null;

        return new PosProductResponse(
                product.getProductId(),
                product.getName(),
                product.getPrice(),
                product.getImageUrl(),
                catId,
                catName
        );
    }

    private ToppingResponse mapToppingToResponse(Topping topping) {
        return new ToppingResponse(
                topping.getToppingId(),
                topping.getName(),
                topping.getPrice(),
                topping.getImageUrl(),
                topping.getIsAvailable()
        );
    }
}
