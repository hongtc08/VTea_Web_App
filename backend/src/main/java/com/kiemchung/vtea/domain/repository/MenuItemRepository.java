package com.kiemchung.vtea.domain.repository;

import com.kiemchung.vtea.domain.entity.MenuItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

/**
 * Giao diện (Interface) làm việc với cơ sở dữ liệu cho bảng MenuItem.
 * Kế thừa JpaRepository để sử dụng sẵn các hàm như findAll(), save(), delete() mà không cần viết SQL.
 */
@Repository
public interface MenuItemRepository extends JpaRepository<MenuItem, Long> {
}
