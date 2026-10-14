package com.kiemchung.vtea.presentation.controller;

import com.kiemchung.vtea.application.service.PosMenuService;
import com.kiemchung.vtea.domain.dto.response.PosMenuResponse;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

/**
 * Controller cung cấp API lấy toàn bộ danh sách Menu + Topping tối ưu cho màn hình POS.
 */
@RestController
@RequestMapping("/api/pos")
public class PosMenuController {

    private final PosMenuService posMenuService;

    public PosMenuController(PosMenuService posMenuService) {
        this.posMenuService = posMenuService;
    }

    /**
     * API lấy toàn bộ danh sách Danh mục, Món nước và Topping đang mở bán cho màn hình POS.
     * Hỗ trợ tìm kiếm nhanh theo tên món (keyword / search) và lọc theo danh mục (categoryId / category).
     */
    @GetMapping("/menu")
    public ResponseEntity<PosMenuResponse> getPosMenu(
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) String search,
            @RequestParam(required = false) Integer categoryId,
            @RequestParam(required = false) String category) {
        String effectiveKeyword = (keyword != null && !keyword.trim().isEmpty()) ? keyword : search;
        PosMenuResponse response = posMenuService.getPosMenu(effectiveKeyword, categoryId, category);
        return ResponseEntity.ok(response);
    }
}
