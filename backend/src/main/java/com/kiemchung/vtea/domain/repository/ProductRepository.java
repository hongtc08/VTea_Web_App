package com.kiemchung.vtea.domain.repository;

import com.kiemchung.vtea.domain.entity.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

/**
 * Giao tiếp với bảng 'product' (món nước).
 */
@Repository
public interface ProductRepository extends JpaRepository<Product, Integer> {
}
