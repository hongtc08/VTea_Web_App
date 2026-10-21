package com.kiemchung.vtea.presentation.controller;

import com.kiemchung.vtea.application.service.StatisticsService;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDate;

/**
 * Controller tiếp nhận các API thống kê doanh thu (theo ngày, tuần, tháng)
 * và tổng số lượng hóa đơn (chỉ dành cho ADMIN).
 */
@RestController
@RequestMapping("/api/statistics")
public class StatisticsController {

    private final StatisticsService statisticsService;

    public StatisticsController(StatisticsService statisticsService) {
        this.statisticsService = statisticsService;
    }

    /**
     * API thống kê doanh thu và tổng số lượng hóa đơn theo khoảng thời gian và đơn vị nhóm.
     * GET /api/statistics/revenue?startDate=2026-06-01&endDate=2026-06-16&groupBy=DAY
     *
     * @param startDate Ngày bắt đầu (YYYY-MM-DD, tùy chọn)
     * @param endDate   Ngày kết thúc (YYYY-MM-DD, tùy chọn)
     * @param groupBy   Đơn vị nhóm: DAY (mặc định), WEEK, MONTH
     */
    @GetMapping({"", "/revenue"})
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> getRevenueStatistics(
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate,
            @RequestParam(required = false, defaultValue = "DAY") String groupBy) {
        try {
            return ResponseEntity.ok(statisticsService.getRevenueStatistics(startDate, endDate, groupBy));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    /**
     * API thống kê doanh thu và tổng số lượng hóa đơn theo ngày.
     * GET /api/statistics/revenue/daily?startDate=2026-06-01&endDate=2026-06-16
     */
    @GetMapping("/revenue/daily")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> getDailyRevenueStatistics(
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {
        return getRevenueStatistics(startDate, endDate, "DAY");
    }

    /**
     * API thống kê doanh thu và tổng số lượng hóa đơn theo tuần.
     * GET /api/statistics/revenue/weekly?startDate=2026-06-01&endDate=2026-06-30
     */
    @GetMapping("/revenue/weekly")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> getWeeklyRevenueStatistics(
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {
        return getRevenueStatistics(startDate, endDate, "WEEK");
    }

    /**
     * API thống kê doanh thu và tổng số lượng hóa đơn theo tháng.
     * GET /api/statistics/revenue/monthly?startDate=2026-01-01&endDate=2026-12-31
     */
    @GetMapping("/revenue/monthly")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> getMonthlyRevenueStatistics(
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {
        return getRevenueStatistics(startDate, endDate, "MONTH");
    }
}
