package com.kiemchung.vtea.application.service.impl;

import com.kiemchung.vtea.domain.dto.response.RevenueStatisticsResponse;
import com.kiemchung.vtea.domain.dto.response.RevenueStatisticsResponse.RevenuePoint;
import com.kiemchung.vtea.domain.entity.Invoice;
import com.kiemchung.vtea.domain.entity.PaymentMethod;
import com.kiemchung.vtea.domain.repository.InvoiceRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

/**
 * Mục đích file: Unit test cho StatisticsServiceImpl nhằm kiểm tra nghiệp vụ
 * thống kê doanh thu (theo ngày, tuần, tháng) và thống kê tổng số lượng hóa đơn.
 */
@ExtendWith(MockitoExtension.class)
class StatisticsServiceImplTest {

    @Mock
    private InvoiceRepository invoiceRepository;

    @InjectMocks
    private StatisticsServiceImpl statisticsService;

    private Invoice createInvoice(int id, String amount, LocalDateTime createdAt) {
        Invoice inv = new Invoice();
        inv.setInvoiceId(id);
        inv.setTotalAmount(amount != null ? new BigDecimal(amount) : null);
        inv.setPaymentMethod(PaymentMethod.CASH);
        inv.setCreatedAt(createdAt);
        return inv;
    }

    @Test
    void getRevenueStatistics_GroupByDay_ReturnsDailyTimelineAndTotals() {
        LocalDate start = LocalDate.of(2026, 6, 1);
        LocalDate end = LocalDate.of(2026, 6, 16);

        List<Invoice> mockInvoices = List.of(
                createInvoice(1, "100000", LocalDateTime.of(2026, 6, 2, 9, 30)),
                createInvoice(2, "250000", LocalDateTime.of(2026, 6, 2, 14, 15)),
                createInvoice(3, "450000", LocalDateTime.of(2026, 6, 3, 10, 0))
        );

        when(invoiceRepository.findByCreatedAtBetweenOrderByCreatedAtAsc(any(), any()))
                .thenReturn(mockInvoices);

        RevenueStatisticsResponse response = statisticsService.getRevenueStatistics(start, end, "DAY");

        assertEquals("DAY", response.getGroupBy());
        assertEquals(start, response.getStartDate());
        assertEquals(end, response.getEndDate());
        assertEquals(new BigDecimal("800000"), response.getTotalRevenue());
        assertEquals(3L, response.getTotalInvoices());

        List<RevenuePoint> timeline = response.getTimeline();
        assertEquals(2, timeline.size());

        assertEquals("2026-06-02", timeline.get(0).getDate());
        assertEquals(new BigDecimal("350000"), timeline.get(0).getRevenue());
        assertEquals(2L, timeline.get(0).getInvoiceCount());

        assertEquals("2026-06-03", timeline.get(1).getDate());
        assertEquals(new BigDecimal("450000"), timeline.get(1).getRevenue());
        assertEquals(1L, timeline.get(1).getInvoiceCount());
    }

    @Test
    void getRevenueStatistics_GroupByWeek_ReturnsWeeklyTimelineAndTotals() {
        LocalDate start = LocalDate.of(2026, 6, 1);
        LocalDate end = LocalDate.of(2026, 6, 30);

        // 2026-06-01 & 2026-06-03 thuộc tuần 2026-W23; 2026-06-10 thuộc tuần 2026-W24
        List<Invoice> mockInvoices = List.of(
                createInvoice(1, "120000", LocalDateTime.of(2026, 6, 1, 8, 0)),
                createInvoice(2, "180000", LocalDateTime.of(2026, 6, 3, 12, 0)),
                createInvoice(3, "500000", LocalDateTime.of(2026, 6, 10, 16, 0))
        );

        when(invoiceRepository.findByCreatedAtBetweenOrderByCreatedAtAsc(any(), any()))
                .thenReturn(mockInvoices);

        RevenueStatisticsResponse response = statisticsService.getRevenueStatistics(start, end, "weekly");

        assertEquals("WEEK", response.getGroupBy());
        assertEquals(new BigDecimal("800000"), response.getTotalRevenue());
        assertEquals(3L, response.getTotalInvoices());

        List<RevenuePoint> timeline = response.getTimeline();
        assertEquals(2, timeline.size());

        assertEquals("2026-W23", timeline.get(0).getDate());
        assertEquals(new BigDecimal("300000"), timeline.get(0).getRevenue());
        assertEquals(2L, timeline.get(0).getInvoiceCount());

        assertEquals("2026-W24", timeline.get(1).getDate());
        assertEquals(new BigDecimal("500000"), timeline.get(1).getRevenue());
        assertEquals(1L, timeline.get(1).getInvoiceCount());
    }

    @Test
    void getRevenueStatistics_GroupByMonth_ReturnsMonthlyTimelineAndTotals() {
        LocalDate start = LocalDate.of(2026, 1, 1);
        LocalDate end = LocalDate.of(2026, 12, 31);

        List<Invoice> mockInvoices = List.of(
                createInvoice(1, "300000", LocalDateTime.of(2026, 6, 5, 10, 0)),
                createInvoice(2, "700000", LocalDateTime.of(2026, 6, 20, 15, 0)),
                createInvoice(3, "950000", LocalDateTime.of(2026, 7, 12, 11, 0))
        );

        when(invoiceRepository.findByCreatedAtBetweenOrderByCreatedAtAsc(any(), any()))
                .thenReturn(mockInvoices);

        RevenueStatisticsResponse response = statisticsService.getRevenueStatistics(start, end, "MONTHLY");

        assertEquals("MONTH", response.getGroupBy());
        assertEquals(new BigDecimal("1950000"), response.getTotalRevenue());
        assertEquals(3L, response.getTotalInvoices());

        List<RevenuePoint> timeline = response.getTimeline();
        assertEquals(2, timeline.size());

        assertEquals("2026-06", timeline.get(0).getDate());
        assertEquals(new BigDecimal("1000000"), timeline.get(0).getRevenue());
        assertEquals(2L, timeline.get(0).getInvoiceCount());

        assertEquals("2026-07", timeline.get(1).getDate());
        assertEquals(new BigDecimal("950000"), timeline.get(1).getRevenue());
        assertEquals(1L, timeline.get(1).getInvoiceCount());
    }

    @Test
    void getRevenueStatistics_NullOrBlankGroupBy_DefaultsToDay() {
        when(invoiceRepository.findAllByOrderByCreatedAtAsc()).thenReturn(List.of());

        RevenueStatisticsResponse resNull = statisticsService.getRevenueStatistics(null, null, null);
        assertEquals("DAY", resNull.getGroupBy());
        assertEquals(BigDecimal.ZERO, resNull.getTotalRevenue());
        assertEquals(0L, resNull.getTotalInvoices());
        assertTrue(resNull.getTimeline().isEmpty());

        RevenueStatisticsResponse resBlank = statisticsService.getRevenueStatistics(null, null, "   ");
        assertEquals("DAY", resBlank.getGroupBy());

        RevenueStatisticsResponse resDaily = statisticsService.getRevenueStatistics(null, null, "daily");
        assertEquals("DAY", resDaily.getGroupBy());
    }

    @Test
    void getRevenueStatistics_InvalidGroupBy_ThrowsIllegalArgumentException() {
        LocalDate start = LocalDate.of(2026, 6, 1);
        LocalDate end = LocalDate.of(2026, 6, 10);

        IllegalArgumentException ex = assertThrows(
                IllegalArgumentException.class,
                () -> statisticsService.getRevenueStatistics(start, end, "YEAR")
        );
        assertEquals("Kiểu thống kê không hợp lệ! Chỉ hỗ trợ: DAY, WEEK, MONTH.", ex.getMessage());
        verifyNoInteractions(invoiceRepository);
    }

    @Test
    void getRevenueStatistics_StartDateAfterEndDate_ThrowsIllegalArgumentException() {
        LocalDate start = LocalDate.of(2026, 6, 20);
        LocalDate end = LocalDate.of(2026, 6, 1);

        IllegalArgumentException ex = assertThrows(
                IllegalArgumentException.class,
                () -> statisticsService.getRevenueStatistics(start, end, "DAY")
        );
        assertEquals("Ngày bắt đầu không được lớn hơn ngày kết thúc!", ex.getMessage());
        verifyNoInteractions(invoiceRepository);
    }

    @Test
    void getRevenueStatistics_PartialDateRange_CallsBetweenQuery() {
        when(invoiceRepository.findByCreatedAtBetweenOrderByCreatedAtAsc(any(), any()))
                .thenReturn(List.of());

        RevenueStatisticsResponse onlyStart = statisticsService.getRevenueStatistics(
                LocalDate.of(2026, 6, 1), null, "WEEK"
        );
        assertEquals("WEEK", onlyStart.getGroupBy());

        RevenueStatisticsResponse onlyEnd = statisticsService.getRevenueStatistics(
                null, LocalDate.of(2026, 6, 30), "MONTH"
        );
        assertEquals("MONTH", onlyEnd.getGroupBy());

        verify(invoiceRepository, times(2)).findByCreatedAtBetweenOrderByCreatedAtAsc(any(), any());
    }

    @Test
    void getRevenueStatistics_HandlesNullListAndIncompleteInvoicesGracefully() {
        when(invoiceRepository.findAllByOrderByCreatedAtAsc()).thenReturn(null);
        RevenueStatisticsResponse nullListRes = statisticsService.getRevenueStatistics(null, null, "DAY");
        assertEquals(BigDecimal.ZERO, nullListRes.getTotalRevenue());
        assertEquals(0L, nullListRes.getTotalInvoices());

        Invoice nullCreatedAtInvoice = createInvoice(10, "50000", null);
        Invoice nullAmountInvoice = createInvoice(11, null, LocalDateTime.of(2026, 6, 2, 10, 0));

        when(invoiceRepository.findAllByOrderByCreatedAtAsc())
                .thenReturn(Arrays.asList(null, nullCreatedAtInvoice, nullAmountInvoice));

        RevenueStatisticsResponse edgeRes = statisticsService.getRevenueStatistics(null, null, "DAY");
        assertEquals(BigDecimal.ZERO, edgeRes.getTotalRevenue());
        assertEquals(1L, edgeRes.getTotalInvoices());
        assertEquals(1, edgeRes.getTimeline().size());
        assertEquals(BigDecimal.ZERO, edgeRes.getTimeline().get(0).getRevenue());
        assertEquals(1L, edgeRes.getTimeline().get(0).getInvoiceCount());
    }
}
