package com.kiemchung.vtea.domain.dto.response;

import java.math.BigDecimal;

/**
 * DTO trả về dữ liệu tỷ trọng bán theo từng danh mục món:
 * mã danh mục, tên danh mục, tổng số lượng bán, tổng doanh thu và tỷ lệ phần trăm (%).
 */
public class CategoryProportionResponse {

    private Integer categoryId;
    private String categoryName;
    private Long totalQuantity;
    private BigDecimal totalRevenue;
    private Double percentage;

    public CategoryProportionResponse() {
    }

    public CategoryProportionResponse(Integer categoryId, String categoryName, Long totalQuantity, BigDecimal totalRevenue) {
        this.categoryId = categoryId;
        this.categoryName = (categoryName != null && !categoryName.isBlank()) ? categoryName : "Khác";
        this.totalQuantity = totalQuantity != null ? totalQuantity : 0L;
        this.totalRevenue = totalRevenue != null ? totalRevenue : BigDecimal.ZERO;
        this.percentage = 0.0;
    }

    public Integer getCategoryId() {
        return categoryId;
    }

    public void setCategoryId(Integer categoryId) {
        this.categoryId = categoryId;
    }

    public String getCategoryName() {
        return categoryName;
    }

    public void setCategoryName(String categoryName) {
        this.categoryName = categoryName;
    }

    public Long getTotalQuantity() {
        return totalQuantity;
    }

    public void setTotalQuantity(Long totalQuantity) {
        this.totalQuantity = totalQuantity;
    }

    public BigDecimal getTotalRevenue() {
        return totalRevenue;
    }

    public void setTotalRevenue(BigDecimal totalRevenue) {
        this.totalRevenue = totalRevenue;
    }

    public Double getPercentage() {
        return percentage;
    }

    public void setPercentage(Double percentage) {
        this.percentage = percentage;
    }
}
