package com.kiemchung.vtea.application.service;

import com.kiemchung.vtea.domain.dto.response.PosMenuResponse;

/**
 * Interface định nghĩa nghiệp vụ lấy dữ liệu Menu + Topping tối ưu cho màn hình POS.
 */
public interface PosMenuService {

    /**
     * Lấy danh sách Danh mục, Món nước (hỗ trợ tìm kiếm theo từ khóa và lọc theo danh mục)
     * cùng danh sách Topping đang mở bán cho màn hình POS.
     *
     * @param keyword      Từ khóa tìm kiếm tên món (có thể null hoặc rỗng)
     * @param categoryId   ID danh mục cần lọc (có thể null để lấy tất cả)
     * @param categoryName Tên danh mục cần lọc (có thể null hoặc "Tất cả")
     * @return PosMenuResponse chứa categories, products, toppings
     */
    PosMenuResponse getPosMenu(String keyword, Integer categoryId, String categoryName);
}
