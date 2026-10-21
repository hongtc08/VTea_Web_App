package com.kiemchung.vtea.application.service.impl;

import com.kiemchung.vtea.application.service.StatisticsService;
import com.kiemchung.vtea.domain.dto.response.RevenueStatisticsResponse;
import com.kiemchung.vtea.domain.dto.response.RevenueStatisticsResponse.RevenuePoint;
import com.kiemchung.vtea.domain.entity.Invoice;
import com.kiemchung.vtea.domain.repository.InvoiceRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.YearMonth;
import java.time.temporal.IsoFields;
import java.util.ArrayList;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.TreeMap;

/**
 * Thực thi nghiệp vụ thống kê doanh thu (theo ngày, tuần, tháng)
 * và tổng số lượng hóa đơn trong hệ thống.
 */
@Service
public class StatisticsServiceImpl implements StatisticsService {

    public static final String GROUP_BY_DAY = "DAY";
    public static final String GROUP_BY_WEEK = "WEEK";
    public static final String GROUP_BY_MONTH = "MONTH";

    private final InvoiceRepository invoiceRepository;

    public StatisticsServiceImpl(InvoiceRepository invoiceRepository) {
        this.invoiceRepository = invoiceRepository;
    }

    /**
     * Thống kê doanh thu và tổng số lượng hóa đơn theo khoảng thời gian và đơn vị nhóm (DAY, WEEK, MONTH).
     */
    @Override
    @Transactional(readOnly = true)
    public RevenueStatisticsResponse getRevenueStatistics(LocalDate startDate, LocalDate endDate, String groupBy) {
        String normalizedGroupBy = normalizeGroupBy(groupBy);
        validateDateRange(startDate, endDate);

        List<Invoice> invoices = fetchInvoices(startDate, endDate);

        BigDecimal totalRevenue = BigDecimal.ZERO;
        long totalInvoices = 0L;
        Map<String, RevenuePoint> groupedMap = new TreeMap<>();

        if (invoices != null) {
            for (Invoice invoice : invoices) {
                if (invoice == null || invoice.getCreatedAt() == null) {
                    continue;
                }

                BigDecimal amount = invoice.getTotalAmount() != null ? invoice.getTotalAmount() : BigDecimal.ZERO;
                totalRevenue = totalRevenue.add(amount);
                totalInvoices++;

                String timeKey = formatTimeKey(invoice.getCreatedAt().toLocalDate(), normalizedGroupBy);
                RevenuePoint point = groupedMap.computeIfAbsent(
                        timeKey,
                        key -> new RevenuePoint(key, BigDecimal.ZERO, 0L)
                );
                point.setRevenue(point.getRevenue().add(amount));
                point.setInvoiceCount(point.getInvoiceCount() + 1L);
            }
        }

        RevenueStatisticsResponse response = new RevenueStatisticsResponse();
        response.setGroupBy(normalizedGroupBy);
        response.setStartDate(startDate);
        response.setEndDate(endDate);
        response.setTotalRevenue(totalRevenue);
        response.setTotalInvoices(totalInvoices);
        response.setTimeline(new ArrayList<>(groupedMap.values()));

        return response;
    }

    /**
     * Chuẩn hóa tham số groupBy về 1 trong 3 giá trị chuẩn: DAY, WEEK, MONTH.
     */
    private String normalizeGroupBy(String groupBy) {
        if (groupBy == null || groupBy.isBlank()) {
            return GROUP_BY_DAY;
        }
        String normalized = groupBy.trim().toUpperCase(Locale.ROOT);
        return switch (normalized) {
            case "DAY", "DAILY" -> GROUP_BY_DAY;
            case "WEEK", "WEEKLY" -> GROUP_BY_WEEK;
            case "MONTH", "MONTHLY" -> GROUP_BY_MONTH;
            default -> throw new IllegalArgumentException(
                    "Kiểu thống kê không hợp lệ! Chỉ hỗ trợ: DAY, WEEK, MONTH."
            );
        };
    }

    /**
     * Kiểm tra tính hợp lệ của khoảng ngày bắt đầu và ngày kết thúc.
     */
    private void validateDateRange(LocalDate startDate, LocalDate endDate) {
        if (startDate != null && endDate != null && startDate.isAfter(endDate)) {
            throw new IllegalArgumentException("Ngày bắt đầu không được lớn hơn ngày kết thúc!");
        }
    }

    /**
     * Truy vấn danh sách hóa đơn từ Database theo khoảng thời gian lọc.
     */
    private List<Invoice> fetchInvoices(LocalDate startDate, LocalDate endDate) {
        if (startDate == null && endDate == null) {
            return invoiceRepository.findAllByOrderByCreatedAtAsc();
        }
        LocalDateTime from = (startDate != null)
                ? startDate.atStartOfDay()
                : LocalDate.of(1970, 1, 1).atStartOfDay();
        LocalDateTime to = (endDate != null)
                ? endDate.atTime(LocalTime.MAX)
                : LocalDateTime.of(9999, 12, 31, 23, 59, 59);

        return invoiceRepository.findByCreatedAtBetweenOrderByCreatedAtAsc(from, to);
    }

    /**
     * Định dạng nhãn thời gian (date) tương ứng với đơn vị nhóm:
     * - DAY: YYYY-MM-DD (ví dụ: 2026-06-02)
     * - WEEK: YYYY-Www theo chuẩn ISO-8601 (ví dụ: 2026-W23)
     * - MONTH: YYYY-MM (ví dụ: 2026-06)
     */
    private String formatTimeKey(LocalDate date, String normalizedGroupBy) {
        return switch (normalizedGroupBy) {
            case GROUP_BY_WEEK -> {
                int weekYear = date.get(IsoFields.WEEK_BASED_YEAR);
                int weekNumber = date.get(IsoFields.WEEK_OF_WEEK_BASED_YEAR);
                yield String.format("%04d-W%02d", weekYear, weekNumber);
            }
            case GROUP_BY_MONTH -> YearMonth.from(date).toString();
            default -> date.toString();
        };
    }
}
