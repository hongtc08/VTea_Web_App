package com.kiemchung.vtea.application.service.impl;

import com.kiemchung.vtea.application.service.MenuItemService;
import com.kiemchung.vtea.domain.dto.response.MenuItemResponse;
import com.kiemchung.vtea.domain.entity.MenuItem;
import com.kiemchung.vtea.domain.repository.MenuItemRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

/**
 * Lớp thực thi các nghiệp vụ liên quan đến Menu.
 * Nơi xử lý logic (nếu có) trước khi lấy hoặc lưu dữ liệu vào DB.
 */
@Service
public class MenuItemServiceImpl implements MenuItemService {

    private final MenuItemRepository repository;

    public MenuItemServiceImpl(MenuItemRepository repository) {
        this.repository = repository;
    }

    /**
     * Lấy tất cả các món nước trong DB và chuyển đổi (map) sang định dạng DTO.
     * @return Danh sách MenuItemResponse trả về cho Controller
     */
    @Override
    public List<MenuItemResponse> getAllMenuItems() {
        // 1. Gọi DB lấy danh sách các Entity (MenuItem)
        // 2. stream().map() để biến đổi từng Entity thành DTO (MenuItemResponse)
        // 3. gom lại thành 1 List
        return repository.findAll().stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
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
