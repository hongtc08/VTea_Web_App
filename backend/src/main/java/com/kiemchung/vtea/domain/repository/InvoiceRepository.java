package com.kiemchung.vtea.domain.repository;

import com.kiemchung.vtea.domain.entity.Invoice;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

/**
 * Giao tiếp với bảng 'order' (hóa đơn).
 */
@Repository
public interface InvoiceRepository extends JpaRepository<Invoice, Integer> {
}
