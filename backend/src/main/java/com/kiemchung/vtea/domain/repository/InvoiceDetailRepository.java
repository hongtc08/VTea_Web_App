package com.kiemchung.vtea.domain.repository;

import com.kiemchung.vtea.domain.dto.response.TopProductResponse;
import com.kiemchung.vtea.domain.entity.InvoiceDetail;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

/**
 * Giao tiếp với bảng 'order_detail' (chi tiết hóa đơn) phục vụ thống kê món bán chạy.
 */
@Repository
public interface InvoiceDetailRepository extends JpaRepository<InvoiceDetail, Integer> {

    /**
     * Tổng hợp số lượng bán và doanh thu theo từng món trong khoảng thời gian của hóa đơn,
     * sắp xếp: số lượng giảm dần, đồng hạng thì doanh thu giảm dần, rồi tên món tăng dần.
     * Doanh thu = đơn giá món tại thời điểm bán × số lượng (chưa gồm topping và VAT).
     */
    @Query("SELECT new com.kiemchung.vtea.domain.dto.response.TopProductResponse("
            + "p.productId, p.name, SUM(d.quantity), SUM(d.unitPrice * d.quantity)) "
            + "FROM InvoiceDetail d JOIN d.product p JOIN d.invoice i "
            + "WHERE i.createdAt BETWEEN :from AND :to "
            + "GROUP BY p.productId, p.name "
            + "ORDER BY SUM(d.quantity) DESC, SUM(d.unitPrice * d.quantity) DESC, p.name ASC")
    List<TopProductResponse> findTopSellingProducts(@Param("from") LocalDateTime from,
                                                    @Param("to") LocalDateTime to,
                                                    Pageable pageable);
}
