package com.kiemchung.vtea.application.service.impl;

import com.kiemchung.vtea.application.service.CategoryService;
import com.kiemchung.vtea.domain.dto.request.CategoryRequest;
import com.kiemchung.vtea.domain.dto.response.CategoryResponse;
import com.kiemchung.vtea.domain.entity.Category;
import com.kiemchung.vtea.domain.repository.CategoryRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class CategoryServiceImpl implements CategoryService {

    private final CategoryRepository categoryRepository;

    public CategoryServiceImpl(CategoryRepository categoryRepository) {
        this.categoryRepository = categoryRepository;
    }

    @Override
    @Transactional(readOnly = true)
    public List<CategoryResponse> getAllCategories() {
        return categoryRepository.findAll().stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<CategoryResponse> getAvailableCategories() {
        return categoryRepository.findByIsAvailableTrue().stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public CategoryResponse getCategoryById(Integer id) {
        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy danh mục với ID: " + id));
        return mapToResponse(category);
    }

    @Override
    @Transactional
    public CategoryResponse createCategory(CategoryRequest request) {
        if (request.getName() == null || request.getName().trim().isEmpty()) {
            throw new RuntimeException("Tên danh mục không được để trống!");
        }

        String trimmedName = request.getName().trim();

        // Chặn trùng tên danh mục (không phân biệt hoa thường)
        if (categoryRepository.existsByNameIgnoreCase(trimmedName)) {
            throw new RuntimeException("Tên danh mục đã tồn tại!");
        }

        Category category = new Category();
        category.setName(trimmedName);
        category.setIsAvailable(request.getIsAvailable() != null ? request.getIsAvailable() : true);

        Category savedCategory = categoryRepository.save(category);
        return mapToResponse(savedCategory);
    }

    @Override
    @Transactional
    public CategoryResponse updateCategory(Integer id, CategoryRequest request) {
        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy danh mục với ID: " + id));

        if (request.getName() != null && !request.getName().trim().isEmpty()) {
            String trimmedName = request.getName().trim();
            if (!trimmedName.equalsIgnoreCase(category.getName())) {
                if (categoryRepository.existsByNameIgnoreCase(trimmedName)) {
                    throw new RuntimeException("Tên danh mục đã tồn tại!");
                }
                category.setName(trimmedName);
            }
        }

        if (request.getIsAvailable() != null) {
            category.setIsAvailable(request.getIsAvailable());
        }

        Category updatedCategory = categoryRepository.save(category);
        return mapToResponse(updatedCategory);
    }

    @Override
    @Transactional
    public void deleteCategory(Integer id) {
        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy danh mục với ID: " + id));

        category.setIsAvailable(false);
        categoryRepository.save(category);
    }

    private CategoryResponse mapToResponse(Category category) {
        return new CategoryResponse(
                category.getCategoryId(),
                category.getName(),
                category.getIsAvailable());
    }
}