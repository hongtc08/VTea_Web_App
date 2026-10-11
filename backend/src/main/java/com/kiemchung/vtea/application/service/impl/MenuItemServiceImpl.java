package com.kiemchung.vtea.application.service.impl;

import com.kiemchung.vtea.application.service.MenuItemService;
import com.kiemchung.vtea.domain.dto.request.CreateMenuItemRequest;
import com.kiemchung.vtea.domain.dto.request.UpdateMenuItemRequest;
import com.kiemchung.vtea.domain.dto.response.MenuItemResponse;
import com.kiemchung.vtea.domain.entity.MenuItem;
import com.kiemchung.vtea.domain.repository.MenuItemRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

/**
 * Lớp thực thi các nghiệp vụ liên quan đến Menu (CRUD món nước).
 */
@Service
public class MenuItemServiceImpl implements MenuItemService {

    private final MenuItemRepository repository;

    public MenuItemServiceImpl(MenuItemRepository repository) {
        this.repository = repository;
    }

    /**
     * Lấy tất cả các món nước trong DB và chuyển đổi (map) sang định dạng DTO.
     */
    @Override
    public List<MenuItemResponse> getAllMenuItems() {
        return repository.findAll().stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    /**
     * Lấy thông tin chi tiết 1 món nước theo ID.
     */
    @Override
    public MenuItemResponse getMenuItemById(Long id) {
        MenuItem item = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy món nước với ID: " + id));
        return mapToResponse(item);
    }

    /**
     * Thêm món nước mới vào thực đơn.
     */
    @Override
    public MenuItemResponse createMenuItem(CreateMenuItemRequest request) {
        if (repository.existsByName(request.getName())) {
            throw new RuntimeException("Tên món nước đã tồn tại!");
        }

        MenuItem item = new MenuItem();
        item.setName(request.getName());
        item.setDescription(request.getDescription());
        item.setPrice(request.getPrice());
        item.setImageUrl(request.getImageUrl());
        item.setCategory(request.getCategory());

        MenuItem savedItem = repository.save(item);
        return mapToResponse(savedItem);
    }

    /**
     * Cập nhật thông tin món nước theo ID.
     */
    @Override
    public MenuItemResponse updateMenuItem(Long id, UpdateMenuItemRequest request) {
        MenuItem item = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy món nước với ID: " + id));

        if (request.getName() != null) item.setName(request.getName());
        if (request.getDescription() != null) item.setDescription(request.getDescription());
        if (request.getPrice() != null) item.setPrice(request.getPrice());
        if (request.getImageUrl() != null) item.setImageUrl(request.getImageUrl());
        if (request.getCategory() != null) item.setCategory(request.getCategory());

        MenuItem updatedItem = repository.save(item);
        return mapToResponse(updatedItem);
    }

    /**
     * Xóa món nước khỏi thực đơn theo ID.
     */
    @Override
    public void deleteMenuItem(Long id) {
        MenuItem item = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy món nước với ID: " + id));
        repository.delete(item);
    }

    /**
     * Hàm hỗ trợ chuyển đổi từ Entity -> DTO.
     */
    private MenuItemResponse mapToResponse(MenuItem entity) {
        return new MenuItemResponse(
                entity.getId(),
                entity.getName(),
                entity.getDescription(),
                entity.getPrice(),
                entity.getImageUrl(),
                entity.getCategory()
        );
    }
}
