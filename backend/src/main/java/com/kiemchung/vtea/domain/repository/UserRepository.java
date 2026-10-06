package com.kiemchung.vtea.domain.repository;

import com.kiemchung.vtea.domain.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

/**
 * Giao tiếp với bảng 'users' trong database.
 * Kế thừa JpaRepository để có sẵn các hàm CRUD cơ bản.
 */
@Repository
public interface UserRepository extends JpaRepository<User, Integer> {

    /**
     * Tìm user theo username — dùng khi đăng nhập.
     */
    Optional<User> findByUsername(String username);

    boolean existsByUsername(String username);
}