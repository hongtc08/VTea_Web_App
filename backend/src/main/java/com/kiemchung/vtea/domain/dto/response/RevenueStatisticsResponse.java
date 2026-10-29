package com.kiemchung.vtea.domain.dto.response;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

/**
 * DTO trả về kết quả thống kê doanh thu (theo ngày, tuần, tháng)
 * và tổng số lượng hóa đơn trong khoảng thời gian truy vấn.
 */
public class RevenueStatisticsResponse {

    private String groupBy;
    private LocalDate startDate;
    private LocalDate endDate;
    private BigDecimal totalRevenue;
    private Long totalInvoices;
    private List<RevenuePoint> timeline = new ArrayList<>();

    public String getGroupBy() { return groupBy; }
    public void setGroupBy(String groupBy) { this.groupBy = groupBy; }

    public LocalDate getStartDate() { return startDate; }
    public void setStartDate(LocalDate startDate) { this.startDate = startDate; }

    public LocalDate getEndDate() { return endDate; }
    public void setEndDate(LocalDate endDate) { this.endDate = endDate; }

    public BigDecimal getTotalRevenue() { return totalRevenue; }
    public void setTotalRevenue(BigDecimal totalRevenue) { this.totalRevenue = totalRevenue; }

    public Long getTotalInvoices() { return totalInvoices; }
    public void setTotalInvoices(Long totalInvoices) { this.totalInvoices = totalInvoices; }

    public List<RevenuePoint> getTimeline() { return timeline; }
    public void setTimeline(List<RevenuePoint> timeline) { this.timeline = timeline; }

    /**
     * Dữ liệu thống kê doanh thu và số hóa đơn tại 1 mốc thời gian (ngày / tuần / tháng).
     */
    public static class RevenuePoint {
        private String date;
        private BigDecimal revenue;
        private Long invoiceCount;

        public RevenuePoint() {
        }

        public RevenuePoint(String date, BigDecimal revenue, Long invoiceCount) {
            this.date = date;
            this.revenue = revenue;
            this.invoiceCount = invoiceCount;
        }

        public String getDate() { return date; }
        public void setDate(String date) { this.date = date; }

        public BigDecimal getRevenue() { return revenue; }
        public void setRevenue(BigDecimal revenue) { this.revenue = revenue; }

        public Long getInvoiceCount() { return invoiceCount; }
        public void setInvoiceCount(Long invoiceCount) { this.invoiceCount = invoiceCount; }
    }
}
