package com.kiemchung.vtea.presentation.controller;

import com.kiemchung.vtea.application.service.MenuItemService;
import com.kiemchung.vtea.domain.dto.request.CreateMenuItemRequest;
import com.kiemchung.vtea.domain.dto.request.UpdateMenuItemRequest;
import com.kiemchung.vtea.domain.dto.response.MenuItemResponse;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * Controller xử lý các API liên quan đến Menu (CRUD món nước).
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

    /**
     * API lấy thông tin chi tiết 1 món nước theo ID.
     * GET /api/menu/{id}
     */
    @GetMapping("/{id}")
    public ResponseEntity<?> getMenuItemById(@PathVariable Long id) {
        try {
            return ResponseEntity.ok(service.getMenuItemById(id));
        } catch (RuntimeException e) {
            return ResponseEntity.status(404).body(e.getMessage());
        }
    }

    /**
     * API thêm món nước mới vào thực đơn.
     * POST /api/menu
     */
    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> createMenuItem(@RequestBody CreateMenuItemRequest request) {
        try {
            MenuItemResponse response = service.createMenuItem(request);
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Lỗi server: " + e.getMessage());
        }
    }

    /**
     * API cập nhật thông tin món nước.
     * PUT /api/menu/{id}
     */
    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> updateMenuItem(@PathVariable Long id, @RequestBody UpdateMenuItemRequest request) {
        try {
            return ResponseEntity.ok(service.updateMenuItem(id, request));
        } catch (RuntimeException e) {
            return ResponseEntity.status(404).body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Lỗi server: " + e.getMessage());
        }
    }

    /**
     * API xóa món nước khỏi thực đơn.
     * DELETE /api/menu/{id}
     */
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> deleteMenuItem(@PathVariable Long id) {
        try {
            service.deleteMenuItem(id);
            return ResponseEntity.ok("Xóa món nước thành công!");
        } catch (RuntimeException e) {
            return ResponseEntity.status(404).body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Lỗi server: " + e.getMessage());
        }
    }
}
