package com.kiemchung.vtea.presentation.controller;

import com.kiemchung.vtea.application.service.StatisticsService;
import com.kiemchung.vtea.domain.dto.response.RevenueStatisticsResponse;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.ResponseEntity;

import java.math.BigDecimal;
import java.time.LocalDate;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.when;

/**
 * Mục đích file: Unit test cho StatisticsController nhằm kiểm tra phản hồi HTTP
 * khi gọi các API thống kê doanh thu (theo ngày, tuần, tháng) và tổng số lượng hóa đơn.
 */
@ExtendWith(MockitoExtension.class)
class StatisticsControllerTest {

    @Mock
    private StatisticsService statisticsService;

    @InjectMocks
    private StatisticsController statisticsController;

    private RevenueStatisticsResponse sampleResponse;
    private LocalDate startDate;
    private LocalDate endDate;

    @BeforeEach
    void setUp() {
        startDate = LocalDate.of(2026, 6, 1);
        endDate = LocalDate.of(2026, 6, 16);

        sampleResponse = new RevenueStatisticsResponse();
        sampleResponse.setGroupBy("DAY");
        sampleResponse.setStartDate(startDate);
        sampleResponse.setEndDate(endDate);
        sampleResponse.setTotalRevenue(new BigDecimal("1500000"));
        sampleResponse.setTotalInvoices(25L);
    }

    @Test
    void getRevenueStatistics_Success_Returns200() {
        when(statisticsService.getRevenueStatistics(startDate, endDate, "DAY")).thenReturn(sampleResponse);

        ResponseEntity<?> response = statisticsController.getRevenueStatistics(startDate, endDate, "DAY");

        assertEquals(200, response.getStatusCode().value());
        assertEquals(sampleResponse, response.getBody());
    }

    @Test
    void getRevenueStatistics_InvalidInput_Returns400() {
        when(statisticsService.getRevenueStatistics(startDate, endDate, "INVALID"))
                .thenThrow(new IllegalArgumentException("Kiểu thống kê không hợp lệ! Chỉ hỗ trợ: DAY, WEEK, MONTH."));

        ResponseEntity<?> response = statisticsController.getRevenueStatistics(startDate, endDate, "INVALID");

        assertEquals(400, response.getStatusCode().value());
        assertEquals("Kiểu thống kê không hợp lệ! Chỉ hỗ trợ: DAY, WEEK, MONTH.", response.getBody());
    }

    @Test
    void getDailyRevenueStatistics_Success_Returns200() {
        when(statisticsService.getRevenueStatistics(startDate, endDate, "DAY")).thenReturn(sampleResponse);

        ResponseEntity<?> response = statisticsController.getDailyRevenueStatistics(startDate, endDate);

        assertEquals(200, response.getStatusCode().value());
        assertEquals(sampleResponse, response.getBody());
    }

    @Test
    void getWeeklyRevenueStatistics_Success_Returns200() {
        sampleResponse.setGroupBy("WEEK");
        when(statisticsService.getRevenueStatistics(startDate, endDate, "WEEK")).thenReturn(sampleResponse);

        ResponseEntity<?> response = statisticsController.getWeeklyRevenueStatistics(startDate, endDate);

        assertEquals(200, response.getStatusCode().value());
        assertEquals(sampleResponse, response.getBody());
    }

    @Test
    void getMonthlyRevenueStatistics_Success_Returns200() {
        sampleResponse.setGroupBy("MONTH");
        when(statisticsService.getRevenueStatistics(startDate, endDate, "MONTH")).thenReturn(sampleResponse);

        ResponseEntity<?> response = statisticsController.getMonthlyRevenueStatistics(startDate, endDate);

        assertEquals(200, response.getStatusCode().value());
        assertEquals(sampleResponse, response.getBody());
    }
}
