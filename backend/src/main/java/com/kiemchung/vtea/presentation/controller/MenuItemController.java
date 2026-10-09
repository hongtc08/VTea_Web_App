package com.kiemchung.vtea.presentation.controller;

import com.kiemchung.vtea.application.service.MenuItemService;
import com.kiemchung.vtea.domain.dto.response.MenuItemResponse;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

/**
 * Controller xử lý các API liên quan đến Menu.
 * Đóng vai trò tiếp nhận Request từ Frontend và trả về Response.
 */
@RestController
@RequestMapping("/api/menu")
public class MenuItemController {

    private final MenuItemService service;

    public MenuItemController(MenuItemService service) {
        this.service = service;
    }

    /**
     * API lấy danh sách toàn bộ món nước.
     * GET /api/menu
     */
    @GetMapping
    public ResponseEntity<List<MenuItemResponse>> getMenu() {
        List<MenuItemResponse> response = service.getAllMenuItems();
        return ResponseEntity.ok(response);
    }
}
