"use client";

import React, { useState } from 'react';
import {
  TrendingUp,
  PieChart as PieChartIcon,
  Star,
  Users,
  Calendar,
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

// Dữ liệu mẫu Xu hướng doanh thu (Line chart)
const REVENUE_TREND_DATA = [
  { date: '2026-06-02', revenue: 1380000 },
  { date: '2026-06-03', revenue: 450000 },
  { date: '2026-06-05', revenue: 95000 },
  { date: '2026-06-07', revenue: 90000 },
  { date: '2026-06-09', revenue: 75000 },
  { date: '2026-06-10', revenue: 240000 },
  { date: '2026-06-12', revenue: 50000 },
  { date: '2026-06-13', revenue: 65000 },
  { date: '2026-06-15', revenue: 50000 },
];

// Dữ liệu mẫu Tỷ trọng danh mục (Pie chart)
const CATEGORY_PROPORTION_DATA = [
  { name: 'Cà phê', value: 72, color: '#0B3B2C' },       // Xanh trà đậm chủ đạo
  { name: 'Trà', value: 18, color: '#9C7A3B' },          // Nâu vàng trà
  { name: 'Nước Ép', value: 6, color: '#D8B56A' },       // Vàng champagne
  { name: 'Sinh tố', value: 4, color: '#BDA66F' },       // Kem mật ong
];

// Dữ liệu mẫu Top món bán chạy (Horizontal Bar chart)
const TOP_SELLING_PRODUCTS = [
  { name: 'Cà phê Sữa đá', sales: 15 },
  { name: 'Cà phê Đen đá', sales: 14 },
  { name: 'Bạc xỉu', sales: 13 },
  { name: 'Cà phê muối', sales: 6 },
  { name: 'Trà Lài Macchiato', sales: 4 },
];

// Dữ liệu mẫu Hiệu suất nhân viên (Table)
const STAFF_PERFORMANCE = [
  { id: 1, name: 'Nguyễn Văn A', orders: 34, revenue: 2329250 },
];

const formatCurrency = (val: number) => {
  return new Intl.NumberFormat('vi-VN').format(val);
};

export default function StatisticsPage() {
  const [startDate, setStartDate] = useState('2026-06-01');
  const [endDate, setEndDate] = useState('2026-06-16');

  const handleApplyFilter = () => {
    // Logic khi nhấn Áp dụng bộ lọc thời gian
  };

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
            className="rounded-xl bg-primary px-5 py-2 text-xs font-bold text-accent shadow-xs hover:bg-primary-hover transition-colors cursor-pointer"
          >
            Áp dụng
          </button>
        </div>
      </div>

      {/* Grid 4 Khối biểu đồ & Thống kê */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* 1. Biểu đồ Xu hướng doanh thu (Line Chart) - Chiếm 7 cột */}
        <div className="lg:col-span-7 flex flex-col rounded-2xl border border-border bg-surface p-5 shadow-2xs">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp size={18} className="text-foreground" />
            <h2 className="text-sm font-bold text-foreground">Xu hướng doanh thu</h2>
          </div>

          <div className="h-64 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={REVENUE_TREND_DATA}
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
                  formatter={(value: any) => [`${formatCurrency(Number(value))} đ`, 'Doanh thu']}
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
          </div>
        </div>

        {/* 2. Biểu đồ Tỷ trọng danh mục (Pie Chart) - Chiếm 5 cột */}
        <div className="lg:col-span-5 flex flex-col rounded-2xl border border-border bg-surface p-5 shadow-2xs">
          <div className="flex items-center gap-2 mb-2">
            <PieChartIcon size={18} className="text-foreground" />
            <h2 className="text-sm font-bold text-foreground">Tỷ trọng danh mục</h2>
          </div>

          <div className="h-56 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={CATEGORY_PROPORTION_DATA}
                  cx="50%"
                  cy="50%"
                  outerRadius={75}
                  dataKey="value"
                  label={({ name }) => name}
                  labelLine={{ stroke: '#9C7A3B', strokeWidth: 1 }}
                >
                  {CATEGORY_PROPORTION_DATA.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} stroke="#FCF9F2" strokeWidth={2} />
                  ))}
                </Pie>
                <RechartsTooltip
                  formatter={(val: any) => [`${val}%`, 'Tỷ trọng']}
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
          </div>

          {/* Chú thích Legend bên dưới */}
          <div className="flex flex-wrap items-center justify-center gap-3 mt-1 text-xs text-foreground">
            {CATEGORY_PROPORTION_DATA.map((item) => (
              <div key={item.name} className="flex items-center gap-1.5">
                <span
                  className="h-2.5 w-2.5 rounded-full inline-block"
                  style={{ backgroundColor: item.color }}
                />
                <span className="font-medium text-[11px]">{item.name}</span>
              </div>
            ))}
          </div>
        </div>

        {/* 3. Top món bán chạy (Horizontal Bar Chart) - Chiếm 7 cột */}
        <div className="lg:col-span-7 flex flex-col rounded-2xl border border-border bg-surface p-5 shadow-2xs">
          <div className="flex items-center gap-2 mb-4">
            <Star size={18} className="text-foreground" />
            <h2 className="text-sm font-bold text-foreground">Top món bán chạy</h2>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                layout="vertical"
                data={TOP_SELLING_PRODUCTS}
                margin={{ top: 10, right: 25, left: 45, bottom: 20 }}
              >
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#E2D2AA" opacity={0.6} />
                <XAxis
                  type="number"
                  domain={[0, 16]}
                  ticks={[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16]}
                  tick={{ fontSize: 10, fill: '#5A4527' }}
                  tickLine={false}
                  label={{ value: 'Số lượng bán', position: 'insideBottom', dy: 15, fontSize: 11, fill: '#3A3323', fontWeight: 600 }}
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
                  formatter={(val: any) => [`${val} ly`, 'Đã bán']}
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
          </div>
        </div>

        {/* 4. Hiệu suất nhân viên (Table) - Chiếm 5 cột */}
        <div className="lg:col-span-5 flex flex-col rounded-2xl border border-border bg-surface p-5 shadow-2xs">
          <div className="flex items-center gap-2 mb-4">
            <Users size={18} className="text-foreground" />
            <h2 className="text-sm font-bold text-foreground">Hiệu suất nhân viên</h2>
          </div>

          <div className="overflow-hidden rounded-xl border border-border/80">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="bg-cream-100/90 text-foreground font-semibold border-b border-border">
                  <th className="py-3 px-4">Nhân viên</th>
                  <th className="py-3 px-4 text-center">Số đơn</th>
                  <th className="py-3 px-4 text-right">Doanh thu</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/50 text-foreground">
                {STAFF_PERFORMANCE.map((staff) => (
                  <tr key={staff.id} className="hover:bg-cream-50/50 transition-colors">
                    <td className="py-3.5 px-4 font-semibold text-foreground">
                      {staff.name}
                    </td>
                    <td className="py-3.5 px-4 text-center font-medium text-foreground/80">
                      {staff.orders}
                    </td>
                    <td className="py-3.5 px-4 text-right font-bold text-foreground">
                      {formatCurrency(staff.revenue)} đ
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
