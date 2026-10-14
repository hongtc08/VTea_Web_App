package com.kiemchung.vtea.domain.repository;

import com.kiemchung.vtea.domain.entity.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * Giao tiếp với bảng 'product' (món nước).
 */
@Repository
public interface ProductRepository extends JpaRepository<Product, Integer> {

    /**
     * Kiểm tra xem tên món nước đã tồn tại trong bảng product hay chưa.
     */
    boolean existsByName(String name);

    /**
     * Lấy danh sách các món nước đang mở bán (is_available = true).
     */
    List<Product> findByIsAvailableTrue();

    /**
     * Truy vấn danh sách món đang mở bán (is_available = true) tối ưu cho màn hình POS,
     * hỗ trợ lọc theo ID danh mục (categoryId), tên danh mục (categoryName)
     * và tìm kiếm nhanh theo tên món (keyword).
     */
    @Query("SELECT p FROM Product p LEFT JOIN FETCH p.category c " +
           "WHERE p.isAvailable = true " +
           "AND (c IS NULL OR c.isAvailable = true) " +
           "AND (:categoryId IS NULL OR c.categoryId = :categoryId) " +
           "AND (:categoryName IS NULL OR LOWER(c.name) = LOWER(:categoryName)) " +
           "AND (:keyword IS NULL OR LOWER(p.name) LIKE LOWER(CONCAT('%', :keyword, '%')))")
    List<Product> searchAvailableProductsForPos(
            @Param("keyword") String keyword,
            @Param("categoryId") Integer categoryId,
            @Param("categoryName") String categoryName
    );
}
