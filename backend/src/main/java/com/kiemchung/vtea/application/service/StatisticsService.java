package com.kiemchung.vtea.application.service;

import com.kiemchung.vtea.domain.dto.response.CategoryProportionResponse;
import com.kiemchung.vtea.domain.dto.response.RevenueStatisticsResponse;
import com.kiemchung.vtea.domain.dto.response.StaffPerformanceResponse;
import com.kiemchung.vtea.domain.dto.response.TopProductResponse;

import java.time.LocalDate;
import java.util.List;

/**
 * Định nghĩa interface nghiệp vụ thống kê doanh thu (theo ngày, tuần, tháng),
 * món bán chạy, tỷ trọng danh mục và hiệu suất nhân viên.
 */
public interface StatisticsService {

    /**
     * Thống kê doanh thu và tổng số lượng hóa đơn theo khoảng thời gian và đơn vị nhóm (DAY, WEEK, MONTH).
     *
     * @param startDate Ngày bắt đầu lọc (có thể null để lấy từ đầu)
     * @param endDate   Ngày kết thúc lọc (có thể null để lấy đến hiện tại)
     * @param groupBy   Đơn vị nhóm thời gian: DAY (mặc định), WEEK, MONTH
     * @return RevenueStatisticsResponse chứa tổng doanh thu, tổng số hóa đơn và chuỗi dữ liệu theo mốc thời gian
     */
    RevenueStatisticsResponse getRevenueStatistics(LocalDate startDate, LocalDate endDate, String groupBy);

    /**
     * Lấy danh sách "Top món bán chạy nhất" theo tổng số lượng bán trong khoảng thời gian.
     *
     * @param startDate Ngày bắt đầu lọc (có thể null để lấy từ đầu)
     * @param endDate   Ngày kết thúc lọc (có thể null để lấy đến hiện tại)
     * @param limit     Số món tối đa cần lấy (1..50), null thì dùng mặc định 5
     * @return Danh sách món xếp hạng giảm dần theo số lượng bán (rỗng nếu chưa có giao dịch)
     */
    List<TopProductResponse> getTopSellingProducts(LocalDate startDate, LocalDate endDate, Integer limit);

    /**
     * Lấy tỷ trọng bán theo từng danh mục món trong khoảng thời gian.
     *
     * @param startDate Ngày bắt đầu lọc (có thể null để lấy từ đầu)
     * @param endDate   Ngày kết thúc lọc (có thể null để lấy đến hiện tại)
     * @return Danh sách tỷ trọng danh mục kèm tỷ lệ phần trăm (%)
     */
    List<CategoryProportionResponse> getCategoryProportions(LocalDate startDate, LocalDate endDate);

    /**
     * Thống kê hiệu suất bán hàng của từng nhân viên trong khoảng thời gian.
     *
     * @param startDate Ngày bắt đầu lọc (có thể null để lấy từ đầu)
     * @param endDate   Ngày kết thúc lọc (có thể null để lấy đến hiện tại)
     * @return Danh sách hiệu suất nhân viên xếp hạng theo doanh thu
     */
    List<StaffPerformanceResponse> getStaffPerformance(LocalDate startDate, LocalDate endDate);
}
