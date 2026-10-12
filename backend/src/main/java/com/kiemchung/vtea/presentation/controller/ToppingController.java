package com.kiemchung.vtea.presentation.controller;

import com.kiemchung.vtea.application.service.ToppingService;
import com.kiemchung.vtea.domain.dto.request.CreateToppingRequest;
import com.kiemchung.vtea.domain.dto.request.UpdateToppingRequest;
import com.kiemchung.vtea.domain.dto.response.ToppingResponse;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * Controller xử lý các API quản lý Topping (CRUD topping).
 */
@RestController
@RequestMapping("/api/toppings")
public class ToppingController {

    private final ToppingService toppingService;

    public ToppingController(ToppingService toppingService) {
        this.toppingService = toppingService;
    }

    /**
     * API lấy danh sách toàn bộ topping.
     * GET /api/toppings
     */
    @GetMapping
    public ResponseEntity<List<ToppingResponse>> getAllToppings() {
        return ResponseEntity.ok(toppingService.getAllToppings());
    }

    /**
     * API lấy thông tin chi tiết 1 topping theo ID.
     * GET /api/toppings/{id}
     */
    @GetMapping("/{id}")
    public ResponseEntity<?> getToppingById(@PathVariable Integer id) {
        try {
            return ResponseEntity.ok(toppingService.getToppingById(id));
        } catch (RuntimeException e) {
            return ResponseEntity.status(404).body(e.getMessage());
        }
    }

    /**
     * API tạo mới topping.
     * POST /api/toppings
     */
    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> createTopping(@RequestBody CreateToppingRequest request) {
        try {
            ToppingResponse response = toppingService.createTopping(request);
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Lỗi server: " + e.getMessage());
        }
    }

    /**
     * API cập nhật thông tin topping.
     * PUT /api/toppings/{id}
     */
    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> updateTopping(@PathVariable Integer id, @RequestBody UpdateToppingRequest request) {
        try {
            return ResponseEntity.ok(toppingService.updateTopping(id, request));
        } catch (RuntimeException e) {
            return ResponseEntity.status(404).body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Lỗi server: " + e.getMessage());
        }
    }

    /**
     * API xóa topping (Soft Delete).
     * DELETE /api/toppings/{id}
     */
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> deleteTopping(@PathVariable Integer id) {
        try {
            toppingService.deleteTopping(id);
            return ResponseEntity.ok("Xóa topping thành công!");
        } catch (RuntimeException e) {
            return ResponseEntity.status(404).body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Lỗi server: " + e.getMessage());
        }
    }
}
