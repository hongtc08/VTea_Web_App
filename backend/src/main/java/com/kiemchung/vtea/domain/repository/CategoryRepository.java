package com.kiemchung.vtea.domain.repository;

import com.kiemchung.vtea.domain.entity.Category;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/**
 * Giao tiếp với bảng 'category' (danh mục món nước).
 */
@Repository
public interface CategoryRepository extends JpaRepository<Category, Integer> {

    /**
     * Lấy danh sách các danh mục đang mở bán (is_available = true).
     */
    List<Category> findByIsAvailableTrue();

    /**
     * Tìm danh mục theo tên (không phân biệt hoa thường).
     */
    Optional<Category> findByNameIgnoreCase(String name);

    /**
     * Kiểm tra tồn tại danh mục theo tên (không phân biệt hoa thường).
     */
    boolean existsByNameIgnoreCase(String name);
}
