package com.kiemchung.vtea.domain.repository;

import com.kiemchung.vtea.domain.entity.Topping;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * Giao diện (Interface) làm việc với cơ sở dữ liệu cho bảng 'topping'.
 * Kế thừa JpaRepository để sử dụng sẵn các hàm CRUD cơ bản.
 */
@Repository
public interface ToppingRepository extends JpaRepository<Topping, Integer> {

    /**
     * Kiểm tra xem tên topping đã tồn tại hay chưa.
     */
    boolean existsByName(String name);

    /**
     * Lấy danh sách các topping đang mở bán (is_available = true).
     */
    List<Topping> findByIsAvailableTrue();
}
