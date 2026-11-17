export interface RevenuePointDto {
  date: string;
  revenue: number;
  invoiceCount: number;
}

export interface RevenueStatisticsResponseDto {
  groupBy: string;
  startDate?: string;
  endDate?: string;
  totalRevenue: number;
  totalInvoices: number;
  timeline: RevenuePointDto[];
}

export interface TopProductResponseDto {
  productId: number;
  productName: string;
  totalQuantity: number;
  totalRevenue: number;
}

export interface CategoryProportionResponseDto {
  categoryId: number | null;
  categoryName: string;
  totalQuantity: number;
  totalRevenue: number;
  percentage: number;
}

export interface StaffPerformanceResponseDto {
  userId: number;
  username: string;
  fullName?: string;
  staffName: string;
  orderCount: number;
  totalRevenue: number;
}

export interface StatisticsQueryParams {
  startDate?: string;
  endDate?: string;
  groupBy?: 'DAY' | 'WEEK' | 'MONTH';
  limit?: number;
}
