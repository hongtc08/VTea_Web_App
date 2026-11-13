package com.kiemchung.vtea.presentation.controller;

import com.kiemchung.vtea.application.service.StatisticsService;
import com.kiemchung.vtea.domain.dto.response.CategoryProportionResponse;
import com.kiemchung.vtea.domain.dto.response.RevenueStatisticsResponse;
import com.kiemchung.vtea.domain.dto.response.StaffPerformanceResponse;
import com.kiemchung.vtea.domain.dto.response.TopProductResponse;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.ResponseEntity;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

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
    void getTopSellingProducts_Success_Returns200() {
        List<TopProductResponse> top = List.of(
                new TopProductResponse(1, "Cà phê Sữa đá", 15L, new BigDecimal("450000")));
        when(statisticsService.getTopSellingProducts(startDate, endDate, 5)).thenReturn(top);

        ResponseEntity<?> response = statisticsController.getTopSellingProducts(startDate, endDate, 5);

        assertEquals(200, response.getStatusCode().value());
        assertEquals(top, response.getBody());
    }

    @Test
    void getTopSellingProducts_NoParams_Returns200WithEmptyList() {
        when(statisticsService.getTopSellingProducts(null, null, null)).thenReturn(List.of());

        ResponseEntity<?> response = statisticsController.getTopSellingProducts(null, null, null);

        assertEquals(200, response.getStatusCode().value());
        assertEquals(List.of(), response.getBody());
    }

    @Test
    void getTopSellingProducts_InvalidInput_Returns400() {
        when(statisticsService.getTopSellingProducts(startDate, endDate, 99))
                .thenThrow(new IllegalArgumentException("Số lượng món phải nằm trong khoảng 1 đến 50!"));

        ResponseEntity<?> response = statisticsController.getTopSellingProducts(startDate, endDate, 99);

        assertEquals(400, response.getStatusCode().value());
        assertEquals("Số lượng món phải nằm trong khoảng 1 đến 50!", response.getBody());
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

    @Test
    void getCategoryProportions_Success_Returns200() {
        List<CategoryProportionResponse> categories = List.of(
                new CategoryProportionResponse(1, "Cà phê", 10L, new BigDecimal("300000")));
        when(statisticsService.getCategoryProportions(startDate, endDate)).thenReturn(categories);

        ResponseEntity<?> response = statisticsController.getCategoryProportions(startDate, endDate);

        assertEquals(200, response.getStatusCode().value());
        assertEquals(categories, response.getBody());
    }

    @Test
    void getCategoryProportions_InvalidInput_Returns400() {
        when(statisticsService.getCategoryProportions(startDate, endDate))
                .thenThrow(new IllegalArgumentException("Ngày bắt đầu không được lớn hơn ngày kết thúc!"));

        ResponseEntity<?> response = statisticsController.getCategoryProportions(startDate, endDate);

        assertEquals(400, response.getStatusCode().value());
        assertEquals("Ngày bắt đầu không được lớn hơn ngày kết thúc!", response.getBody());
    }

    @Test
    void getStaffPerformance_Success_Returns200() {
        List<StaffPerformanceResponse> staff = List.of(
                new StaffPerformanceResponse(1, "admin", "Nguyễn Văn A", 10L, new BigDecimal("800000")));
        when(statisticsService.getStaffPerformance(startDate, endDate)).thenReturn(staff);

        ResponseEntity<?> response = statisticsController.getStaffPerformance(startDate, endDate);

        assertEquals(200, response.getStatusCode().value());
        assertEquals(staff, response.getBody());
    }

    @Test
    void getStaffPerformance_InvalidInput_Returns400() {
        when(statisticsService.getStaffPerformance(startDate, endDate))
                .thenThrow(new IllegalArgumentException("Ngày bắt đầu không được lớn hơn ngày kết thúc!"));

        ResponseEntity<?> response = statisticsController.getStaffPerformance(startDate, endDate);

        assertEquals(400, response.getStatusCode().value());
        assertEquals("Ngày bắt đầu không được lớn hơn ngày kết thúc!", response.getBody());
    }
}
