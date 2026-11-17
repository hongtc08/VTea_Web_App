"use client";

import React, { useState, useEffect, useCallback } from 'react';
import {
  TrendingUp,
  PieChart as PieChartIcon,
  Star,
  Users,
  AlertCircle,
  Loader2,
} from 'lucide-react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
} from 'recharts';
import { statisticsService } from '@/services/statisticsService';
import {
  RevenueStatisticsResponseDto,
  TopProductResponseDto,
  CategoryProportionResponseDto,
  StaffPerformanceResponseDto,
} from '@/types/statistics';
import { toast } from 'sonner';

interface TooltipPayloadItem {
  payload?: {
    invoiceCount?: number;
    revenue?: number;
    quantity?: number;
  };
}

const CATEGORY_COLORS = [
  '#0B3B2C', // primary dark green
  '#9C7A3B', // warm gold/bronze
  '#D8B56A', // light gold/accent
  '#3D6B58', // medium sage green
  '#BDA66F', // muted amber
  '#7A9A60', // olive green
  '#8C6239', // roasted tea brown
  '#5A4527', // dark earth
];

const formatCurrency = (val: number) => {
  return new Intl.NumberFormat('vi-VN').format(val);
};

export default function StatisticsPage() {
  const [startDate, setStartDate] = useState('2026-06-01');
  const [endDate, setEndDate] = useState('2026-06-16');

  // Dữ liệu thực từ API
  const [revenueData, setRevenueData] = useState<RevenueStatisticsResponseDto | null>(null);
  const [topProducts, setTopProducts] = useState<TopProductResponseDto[]>([]);
  const [categoryProportions, setCategoryProportions] = useState<CategoryProportionResponseDto[]>([]);
  const [staffPerformance, setStaffPerformance] = useState<StaffPerformanceResponseDto[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Tải toàn bộ dữ liệu thống kê từ Backend khi bấm Áp dụng hoặc khởi tạo
  const fetchStatistics = useCallback(async (start?: string, end?: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const [revResult, topResult, catResult, staffResult] = await Promise.all([
        statisticsService.getRevenueStatistics({
          startDate: start || undefined,
          endDate: end || undefined,
          groupBy: 'DAY',
        }),
        statisticsService.getTopSellingProducts({
          startDate: start || undefined,
          endDate: end || undefined,
          limit: 5,
        }),
        statisticsService.getCategoryProportions({
          startDate: start || undefined,
          endDate: end || undefined,
        }),
        statisticsService.getStaffPerformance({
          startDate: start || undefined,
          endDate: end || undefined,
        }),
      ]);

      setRevenueData(revResult);
      setTopProducts(topResult);
      setCategoryProportions(catResult);
      setStaffPerformance(staffResult);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Không thể tải dữ liệu thống kê từ máy chủ.';
      setError(msg);
      toast.error(msg);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    let isMounted = true;

    Promise.all([
      statisticsService.getRevenueStatistics({
        startDate: '2026-06-01',
        endDate: '2026-06-16',
        groupBy: 'DAY',
      }),
      statisticsService.getTopSellingProducts({
        startDate: '2026-06-01',
        endDate: '2026-06-16',
        limit: 5,
      }),
      statisticsService.getCategoryProportions({
        startDate: '2026-06-01',
        endDate: '2026-06-16',
      }),
      statisticsService.getStaffPerformance({
        startDate: '2026-06-01',
        endDate: '2026-06-16',
      }),
    ])
      .then(([revResult, topResult, catResult, staffResult]) => {
        if (!isMounted) return;
        setRevenueData(revResult);
        setTopProducts(topResult);
        setCategoryProportions(catResult);
        setStaffPerformance(staffResult);
        setIsLoading(false);
      })
      .catch((err: unknown) => {
        if (!isMounted) return;
        const msg = err instanceof Error ? err.message : 'Không thể tải dữ liệu thống kê.';
        setError(msg);
        toast.error(msg);
        setIsLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const handleApplyFilter = () => {
    if (startDate && endDate && startDate > endDate) {
      toast.error('Ngày bắt đầu không được lớn hơn ngày kết thúc!');
      return;
    }
    fetchStatistics(startDate, endDate);
  };

  // Chuẩn hóa dữ liệu cho biểu đồ đường (Line chart)
  const lineChartData = revenueData?.timeline?.map((item) => ({
    date: item.date,
    revenue: Number(item.revenue),
    invoiceCount: Number(item.invoiceCount),
  })) || [];

  // Chuẩn hóa dữ liệu cho biểu đồ tròn (Pie chart)
  const categoryChartData = categoryProportions.map((cat, idx) => ({
    name: cat.categoryName,
    value: Number(cat.percentage),
    quantity: Number(cat.totalQuantity),
    revenue: Number(cat.totalRevenue),
    color: CATEGORY_COLORS[idx % CATEGORY_COLORS.length],
  }));

  // Chuẩn hóa dữ liệu cho biểu đồ cột ngang (Bar chart)
  const barChartData = topProducts.map((item) => ({
    name: item.productName,
    sales: Number(item.totalQuantity),
    revenue: Number(item.totalRevenue),
  }));

  return (
    <div className="flex flex-col h-full w-full pb-8">
      {/* Header & Date Range Filter */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Báo cáo & Thống kê</h1>
          <p className="text-xs text-muted mt-0.5">
            Phân tích doanh thu và hiệu suất hoạt động
          </p>
        </div>

        {/* Thanh Lọc theo thời gian */}
        <div className="flex items-center gap-2.5 rounded-2xl border border-border bg-surface px-4 py-2.5 shadow-2xs">
          <span className="text-xs text-muted font-medium">Lọc theo:</span>
          
          <div className="relative flex items-center">
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="rounded-lg border border-border bg-white px-3 py-1.5 text-xs text-foreground font-medium focus:border-primary focus:outline-none"
            />
          </div>

          <span className="text-muted font-bold">-</span>

          <div className="relative flex items-center">
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="rounded-lg border border-border bg-white px-3 py-1.5 text-xs text-foreground font-medium focus:border-primary focus:outline-none"
            />
          </div>

          <button
            type="button"
            onClick={handleApplyFilter}
            disabled={isLoading}
            className="flex items-center gap-1.5 rounded-xl bg-primary px-5 py-2 text-xs font-bold text-accent shadow-xs hover:bg-primary-hover transition-colors cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {isLoading && <Loader2 size={13} className="animate-spin" />}
            Áp dụng
          </button>
        </div>
      </div>

      {/* Thông báo lỗi khi gọi API thất bại */}
      {error && !isLoading && (
        <div className="mb-6 bg-red-50 border border-red-200 text-danger rounded-[var(--radius-card)] p-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <AlertCircle size={20} className="shrink-0" />
            <span className="text-sm font-medium">{error}</span>
          </div>
          <button
            onClick={() => fetchStatistics(startDate, endDate)}
            className="px-3 py-1.5 text-xs font-bold bg-danger text-white rounded-[var(--radius-control)] hover:opacity-90 transition-opacity shrink-0 cursor-pointer"
          >
            Thử lại
          </button>
        </div>
      )}

      {/* Grid 4 Khối biểu đồ & Thống kê */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* 1. Biểu đồ Xu hướng doanh thu (Line Chart) */}
        <div className="lg:col-span-7 flex flex-col rounded-2xl border border-border bg-surface p-5 shadow-2xs">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <TrendingUp size={18} className="text-foreground" />
              <h2 className="text-sm font-bold text-foreground">Xu hướng doanh thu</h2>
            </div>
            {revenueData && !isLoading && (
              <div className="flex items-center gap-3 text-xs">
                <span className="text-muted">
                  Tổng: <strong className="text-primary font-bold">{formatCurrency(Number(revenueData.totalRevenue || 0))} đ</strong>
                </span>
                <span className="text-muted">
                  Hóa đơn: <strong className="text-foreground font-bold">{revenueData.totalInvoices || 0}</strong>
                </span>
              </div>
            )}
          </div>

          <div className="h-64 w-full pt-2">
            {isLoading ? (
              <div className="h-full flex items-center justify-center">
                <Loader2 size={24} className="animate-spin text-muted" />
              </div>
            ) : lineChartData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={lineChartData}
                  margin={{ top: 10, right: 20, left: 15, bottom: 25 }}
                >
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2D2AA" opacity={0.6} />
                  <XAxis
                    dataKey="date"
                    tick={{ fontSize: 10, fill: '#5A4527' }}
                    angle={90}
                    textAnchor="start"
                    dy={10}
                    tickLine={false}
                    label={{ value: 'Thời gian', position: 'insideBottom', dy: 25, fontSize: 11, fill: '#3A3323', fontWeight: 600 }}
                  />
                  <YAxis
                    tick={{ fontSize: 10, fill: '#5A4527' }}
                    tickFormatter={(val) => (val === 0 ? '0' : formatCurrency(val))}
                    tickLine={false}
                    axisLine={false}
                    label={{
                      value: 'Doanh thu (VNĐ)',
                      angle: -90,
                      position: 'insideLeft',
                      fontSize: 11,
                      fill: '#3A3323',
                      fontWeight: 600,
                      dy: 40,
                      dx: -10,
                    }}
                  />
                  <RechartsTooltip
                    formatter={(value: unknown, _name: unknown, item: unknown) => {
                      const payload = (item as TooltipPayloadItem)?.payload;
                      return [
                        `${formatCurrency(Number(value || 0))} đ (${payload?.invoiceCount || 0} đơn)`,
                        'Doanh thu',
                      ];
                    }}
                    labelFormatter={(label) => `Ngày: ${label}`}
                    contentStyle={{
                      backgroundColor: '#FCF9F2',
                      borderColor: '#E2D2AA',
                      borderRadius: '0.75rem',
                      fontSize: '11px',
                      color: '#0B3B2C',
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="revenue"
                    stroke="#0B3B2C"
                    strokeWidth={2.5}
                    dot={{ r: 4, stroke: '#0B3B2C', strokeWidth: 2, fill: '#FFF' }}
                    activeDot={{ r: 6, fill: '#D8B56A', stroke: '#0B3B2C', strokeWidth: 2 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-muted text-xs">
                <span>Chưa có phát sinh doanh thu trong khoảng thời gian này.</span>
              </div>
            )}
          </div>
        </div>

        {/* 2. Biểu đồ Tỷ trọng danh mục (Pie Chart) */}
        <div className="lg:col-span-5 flex flex-col rounded-2xl border border-border bg-surface p-5 shadow-2xs">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <PieChartIcon size={18} className="text-foreground" />
              <h2 className="text-sm font-bold text-foreground">Tỷ trọng danh mục</h2>
            </div>
            {categoryProportions.length > 0 && !isLoading && (
              <span className="text-xs text-muted">{categoryProportions.length} danh mục</span>
            )}
          </div>

          <div className="h-56 w-full flex items-center justify-center">
            {isLoading ? (
              <div className="h-full flex items-center justify-center">
                <Loader2 size={24} className="animate-spin text-muted" />
              </div>
            ) : categoryChartData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryChartData}
                    cx="50%"
                    cy="50%"
                    outerRadius={75}
                    dataKey="value"
                    label={({ name }) => name}
                    labelLine={{ stroke: '#9C7A3B', strokeWidth: 1 }}
                  >
                    {categoryChartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} stroke="#FCF9F2" strokeWidth={2} />
                    ))}
                  </Pie>
                  <RechartsTooltip
                    formatter={(val: unknown, _name: unknown, item: unknown) => {
                      const payload = (item as TooltipPayloadItem)?.payload;
                      return [
                        `${val}% (${payload?.quantity || 0} ly - ${formatCurrency(Number(payload?.revenue || 0))} đ)`,
                        'Tỷ trọng',
                      ];
                    }}
                    contentStyle={{
                      backgroundColor: '#FCF9F2',
                      borderColor: '#E2D2AA',
                      borderRadius: '0.75rem',
                      fontSize: '11px',
                      color: '#0B3B2C',
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-muted text-xs">
                <span>Chưa có phát sinh đơn hàng nào theo danh mục.</span>
              </div>
            )}
          </div>

          {/* Chú thích Legend bên dưới */}
          {categoryChartData.length > 0 && (
            <div className="flex flex-wrap items-center justify-center gap-3 mt-1 text-xs text-foreground">
              {categoryChartData.map((item) => (
                <div key={item.name} className="flex items-center gap-1.5">
                  <span
                    className="h-2.5 w-2.5 rounded-full inline-block shrink-0"
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="font-medium text-[11px]">
                    {item.name} ({item.value}%)
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* 3. Top món bán chạy (Horizontal Bar Chart) */}
        <div className="lg:col-span-7 flex flex-col rounded-2xl border border-border bg-surface p-5 shadow-2xs">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Star size={18} className="text-foreground" />
              <h2 className="text-sm font-bold text-foreground">Top món bán chạy</h2>
            </div>
            {topProducts.length > 0 && !isLoading && (
              <span className="text-xs text-muted">Top {topProducts.length} món</span>
            )}
          </div>

          <div className="h-64 w-full">
            {isLoading ? (
              <div className="h-full flex items-center justify-center">
                <Loader2 size={24} className="animate-spin text-muted" />
              </div>
            ) : barChartData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  layout="vertical"
                  data={barChartData}
                  margin={{ top: 10, right: 25, left: 45, bottom: 20 }}
                >
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#E2D2AA" opacity={0.6} />
                  <XAxis
                    type="number"
                    allowDecimals={false}
                    tick={{ fontSize: 10, fill: '#5A4527' }}
                    tickLine={false}
                    label={{ value: 'Số lượng bán (ly)', position: 'insideBottom', dy: 15, fontSize: 11, fill: '#3A3323', fontWeight: 600 }}
                  />
                  <YAxis
                    type="category"
                    dataKey="name"
                    tick={{ fontSize: 10.5, fill: '#0B3B2C', fontWeight: 600 }}
                    tickLine={false}
                    axisLine={false}
                    width={110}
                  />
                  <RechartsTooltip
                    formatter={(val: unknown, _name: unknown, item: unknown) => {
                      const payload = (item as TooltipPayloadItem)?.payload;
                      return [
                        `${val} ly (${formatCurrency(Number(payload?.revenue || 0))} đ)`,
                        'Đã bán',
                      ];
                    }}
                    contentStyle={{
                      backgroundColor: '#FCF9F2',
                      borderColor: '#E2D2AA',
                      borderRadius: '0.75rem',
                      fontSize: '11px',
                      color: '#0B3B2C',
                    }}
                  />
                  <Bar
                    dataKey="sales"
                    fill="#D8B56A"
                    radius={[0, 4, 4, 0]}
                    barSize={12}
                  />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-muted text-xs">
                <span>Chưa có dữ liệu món bán chạy trong khoảng thời gian này.</span>
              </div>
            )}
          </div>
        </div>

        {/* 4. Hiệu suất nhân viên (Table) */}
        <div className="lg:col-span-5 flex flex-col rounded-2xl border border-border bg-surface p-5 shadow-2xs">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Users size={18} className="text-foreground" />
              <h2 className="text-sm font-bold text-foreground">Hiệu suất nhân viên</h2>
            </div>
            {staffPerformance.length > 0 && !isLoading && (
              <span className="text-xs text-muted">{staffPerformance.length} nhân viên</span>
            )}
          </div>

          <div className="overflow-hidden rounded-xl border border-border/80">
            {isLoading ? (
              <div className="p-8 flex items-center justify-center">
                <Loader2 size={24} className="animate-spin text-muted" />
              </div>
            ) : staffPerformance.length > 0 ? (
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="bg-cream-100/90 text-foreground font-semibold border-b border-border">
                    <th className="py-3 px-4">Nhân viên</th>
                    <th className="py-3 px-4 text-center">Số đơn</th>
                    <th className="py-3 px-4 text-right">Doanh thu</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/50 text-foreground">
                  {staffPerformance.map((staff) => (
                    <tr key={staff.userId} className="hover:bg-cream-50/50 transition-colors">
                      <td className="py-3.5 px-4 font-semibold text-foreground">
                        <div>{staff.staffName}</div>
                        {staff.fullName && staff.username !== staff.fullName && (
                          <div className="text-[10px] text-muted font-normal">@{staff.username}</div>
                        )}
                      </td>
                      <td className="py-3.5 px-4 text-center font-medium text-foreground/80">
                        {staff.orderCount}
                      </td>
                      <td className="py-3.5 px-4 text-right font-bold text-foreground">
                        {formatCurrency(Number(staff.totalRevenue))} đ
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="p-8 text-center text-muted text-xs">
                Chưa có dữ liệu hiệu suất nhân viên trong khoảng thời gian này.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
