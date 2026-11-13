import { apiFetch } from '@/lib/api';
import {
  RevenueStatisticsResponseDto,
  TopProductResponseDto,
  CategoryProportionResponseDto,
  StaffPerformanceResponseDto,
  StatisticsQueryParams,
} from '@/types/statistics';

function buildQueryString(params: Record<string, string | number | undefined>): string {
  const query = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && String(value).trim() !== '') {
      query.set(key, String(value).trim());
    }
  });
  const str = query.toString();
  return str ? `?${str}` : '';
}

export const statisticsService = {
  /**
   * Thống kê doanh thu và tổng số hóa đơn theo khoảng thời gian và đơn vị nhóm (DAY, WEEK, MONTH).
   * GET /api/statistics/revenue?startDate=...&endDate=...&groupBy=...
   */
  async getRevenueStatistics(params: StatisticsQueryParams = {}): Promise<RevenueStatisticsResponseDto> {
    const qs = buildQueryString({
      startDate: params.startDate,
      endDate: params.endDate,
      groupBy: params.groupBy || 'DAY',
    });
    return await apiFetch<RevenueStatisticsResponseDto>(`/api/statistics/revenue${qs}`);
  },

  /**
   * Bảng xếp hạng top món bán chạy nhất theo tổng số lượng bán.
   * GET /api/statistics/top-products?startDate=...&endDate=...&limit=...
   */
  async getTopSellingProducts(params: StatisticsQueryParams = {}): Promise<TopProductResponseDto[]> {
    const qs = buildQueryString({
      startDate: params.startDate,
      endDate: params.endDate,
      limit: params.limit ?? 5,
    });
    const data = await apiFetch<TopProductResponseDto[]>(`/api/statistics/top-products${qs}`);
    return Array.isArray(data) ? data : [];
  },

  /**
   * Thống kê tỷ trọng bán theo từng danh mục món.
   * GET /api/statistics/category-proportion?startDate=...&endDate=...
   */
  async getCategoryProportions(params: StatisticsQueryParams = {}): Promise<CategoryProportionResponseDto[]> {
    const qs = buildQueryString({
      startDate: params.startDate,
      endDate: params.endDate,
    });
    const data = await apiFetch<CategoryProportionResponseDto[]>(`/api/statistics/category-proportion${qs}`);
    return Array.isArray(data) ? data : [];
  },

  /**
   * Thống kê hiệu suất bán hàng của từng nhân viên.
   * GET /api/statistics/staff-performance?startDate=...&endDate=...
   */
  async getStaffPerformance(params: StatisticsQueryParams = {}): Promise<StaffPerformanceResponseDto[]> {
    const qs = buildQueryString({
      startDate: params.startDate,
      endDate: params.endDate,
    });
    const data = await apiFetch<StaffPerformanceResponseDto[]>(`/api/statistics/staff-performance${qs}`);
    return Array.isArray(data) ? data : [];
  },
};
