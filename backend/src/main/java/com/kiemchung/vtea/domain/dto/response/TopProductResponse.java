package com.kiemchung.vtea.domain.dto.response;

import java.math.BigDecimal;

/**
 * DTO trả về 1 dòng trong bảng xếp hạng "Top món bán chạy":
 * mã món, tên món, tổng số lượng đã bán và tổng doanh thu của riêng món đó.
 */
public class TopProductResponse {

    private Integer productId;
    private String productName;
    private Long totalQuantity;
    private BigDecimal totalRevenue;

    public TopProductResponse() {
    }

    public TopProductResponse(Integer productId, String productName, Long totalQuantity, BigDecimal totalRevenue) {
        this.productId = productId;
        this.productName = productName;
        this.totalQuantity = totalQuantity;
        this.totalRevenue = totalRevenue;
    }

    public Integer getProductId() { return productId; }
    public void setProductId(Integer productId) { this.productId = productId; }

    public String getProductName() { return productName; }
    public void setProductName(String productName) { this.productName = productName; }

    public Long getTotalQuantity() { return totalQuantity; }
    public void setTotalQuantity(Long totalQuantity) { this.totalQuantity = totalQuantity; }

    public BigDecimal getTotalRevenue() { return totalRevenue; }
    public void setTotalRevenue(BigDecimal totalRevenue) { this.totalRevenue = totalRevenue; }
}
