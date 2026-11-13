package com.kiemchung.vtea.domain.dto.response;

import java.math.BigDecimal;

/**
 * DTO trả về hiệu suất bán hàng của từng nhân viên:
 * ID nhân viên, tên đăng nhập, họ tên, tên hiển thị, tổng số đơn đã lập và tổng doanh thu.
 */
public class StaffPerformanceResponse {

    private Integer userId;
    private String username;
    private String fullName;
    private String staffName;
    private Long orderCount;
    private BigDecimal totalRevenue;

    public StaffPerformanceResponse() {
    }

    public StaffPerformanceResponse(Integer userId, String username, String fullName, Long orderCount, BigDecimal totalRevenue) {
        this.userId = userId;
        this.username = username;
        this.fullName = fullName;
        this.staffName = (fullName != null && !fullName.isBlank()) ? fullName : username;
        this.orderCount = orderCount != null ? orderCount : 0L;
        this.totalRevenue = totalRevenue != null ? totalRevenue : BigDecimal.ZERO;
    }

    public Integer getUserId() {
        return userId;
    }

    public void setUserId(Integer userId) {
        this.userId = userId;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getFullName() {
        return fullName;
    }

    public void setFullName(String fullName) {
        this.fullName = fullName;
        this.staffName = (fullName != null && !fullName.isBlank()) ? fullName : this.username;
    }

    public String getStaffName() {
        return staffName != null ? staffName : ((fullName != null && !fullName.isBlank()) ? fullName : username);
    }

    public void setStaffName(String staffName) {
        this.staffName = staffName;
    }

    public Long getOrderCount() {
        return orderCount;
    }

    public void setOrderCount(Long orderCount) {
        this.orderCount = orderCount;
    }

    public BigDecimal getTotalRevenue() {
        return totalRevenue;
    }

    public void setTotalRevenue(BigDecimal totalRevenue) {
        this.totalRevenue = totalRevenue;
    }
}
