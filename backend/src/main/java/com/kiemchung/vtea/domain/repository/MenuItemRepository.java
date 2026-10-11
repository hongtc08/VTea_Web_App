package com.kiemchung.vtea.domain.repository;

import com.kiemchung.vtea.domain.entity.MenuItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

/**
 * Giao diện (Interface) làm việc với cơ sở dữ liệu cho bảng menu_items.
 * Kế thừa JpaRepository để sử dụng sẵn các hàm CRUD cơ bản.
 */
@Repository
public interface MenuItemRepository extends JpaRepository<MenuItem, Long> {

    /**
     * Kiểm tra xem tên món đã tồn tại trong menu hay chưa.
     */
    boolean existsByName(String name);
}
