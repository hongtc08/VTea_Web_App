package com.kiemchung.vtea.domain.repository;

import com.kiemchung.vtea.domain.entity.Invoice;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

/**
 * Giao tiếp với bảng 'order' (hóa đơn).
 */
@Repository
public interface InvoiceRepository extends JpaRepository<Invoice, Integer> {

    /**
     * Lấy toàn bộ lịch sử hóa đơn (dành cho ADMIN), sắp xếp mới nhất lên đầu.
     */
    List<Invoice> findAllByOrderByCreatedAtDesc();

    /**
     * Lấy danh sách hóa đơn do 1 nhân viên tạo (dành cho STAFF), sắp xếp mới nhất lên đầu.
     */
    List<Invoice> findByUser_UserIdOrderByCreatedAtDesc(Integer userId);

    /**
     * Lấy toàn bộ hóa đơn sắp xếp tăng dần theo thời gian tạo (phục vụ thống kê).
     */
    List<Invoice> findAllByOrderByCreatedAtAsc();

    /**
     * Lấy danh sách hóa đơn trong khoảng thời gian chỉ định, sắp xếp tăng dần theo thời gian tạo.
     */
    List<Invoice> findByCreatedAtBetweenOrderByCreatedAtAsc(LocalDateTime startDateTime, LocalDateTime endDateTime);
}
