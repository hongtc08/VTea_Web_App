"use client";

import React, { useState } from 'react';
import { Search, ChevronRight, ChevronDown, Calendar } from 'lucide-react';
import { MOCK_MONTHLY_INVOICES } from '@/data/mockInvoices';
import { InvoiceHistory, MonthlyInvoices } from '@/types/invoice';
import BillPreviewModal, { BillDetailData } from '@/components/pos/BillPreviewModal';

export default function InvoicesPage() {
  const [monthlyData] = useState<MonthlyInvoices[]>(MOCK_MONTHLY_INVOICES);
  const [searchQuery, setSearchQuery] = useState('');
  // Mặc định mở Tháng 04/2026 như trong ảnh mẫu
  const [expandedMonths, setExpandedMonths] = useState<Record<string, boolean>>({
    'Tháng 04/2026': true,
  });

  // Quản lý modal xem chi tiết hóa đơn
  const [selectedBill, setSelectedBill] = useState<BillDetailData | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const toggleMonth = (monthYear: string) => {
    setExpandedMonths((prev) => ({
      ...prev,
      [monthYear]: !prev[monthYear],
    }));
  };

  // Mở modal chi tiết khi bấm nút "Chi tiết"
  const handleOpenDetail = (invoice: InvoiceHistory) => {
    // Chuyển đổi dữ liệu invoice thành format của BillPreviewModal
    const formattedBillData: BillDetailData = {
      invoiceCode: invoice.code,
      staffName: invoice.staffName,
      customerName: invoice.customerName + (invoice.customerPhone ? ` (${invoice.customerPhone})` : ''),
      paymentMethod: invoice.paymentMethod === 'CASH' ? 'Tiền mặt' : invoice.paymentMethod === 'TRANSFER' ? 'Chuyển khoản' : 'Thẻ',
      createdAt: invoice.createdAt,
      subtotal: invoice.subtotal,
      vat: invoice.vat,
      total: invoice.totalAmount,
      items: invoice.items.map((item) => ({
        id: item.id,
        quantity: item.quantity,
        product: {
          id: item.id,
          name: item.name,
          price: item.price,
          category: 'Món',
        },
        toppings: item.toppings.map((t) => ({
          id: t.id,
          name: t.name,
          price: t.price,
          quantity: t.quantity,
        })),
      })),
    };

    setSelectedBill(formattedBillData);
    setIsModalOpen(true);
  };

  const formatMoney = (val: number) => {
    return new Intl.NumberFormat('vi-VN').format(val) + 'đ';
  };

  // Lọc theo từ khóa tìm kiếm (Mã HĐ, nhân viên, khách hàng)
  const query = searchQuery.toLowerCase().trim();

  return (
    <div className="flex flex-col h-full w-full">
      {/* Tiêu đề trang */}
      <h1 className="text-2xl font-bold text-foreground mb-4">
        Lịch sử hóa đơn
      </h1>

      {/* Thanh tìm kiếm */}
      <div className="relative mb-6">
        <Search
          size={18}
          className="absolute left-4 top-1/2 -translate-y-1/2 text-muted"
        />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Tìm kiếm theo mã HĐ, nhân viên, khách hàng..."
          className="w-full rounded-2xl border border-border bg-surface pl-11 pr-4 py-3 text-sm text-foreground placeholder:text-muted/70 shadow-2xs focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none transition-all"
        />
      </div>

      {/* Danh sách các khối tháng (Collapsible Month Groups) */}
      <div className="space-y-4 pb-8">
        {monthlyData.map((group) => {
          const isExpanded = !!expandedMonths[group.monthYear];

          // Lọc các hóa đơn trong tháng theo từ khóa
          const filteredInvoices = group.invoices.filter((inv) => {
            if (!query) return true;
            return (
              inv.code.toLowerCase().includes(query) ||
              inv.staffName.toLowerCase().includes(query) ||
              inv.customerName.toLowerCase().includes(query) ||
              (inv.customerPhone && inv.customerPhone.includes(query))
            );
          });

          // Nếu có search query mà tháng này không có kết quả thì ẩn tháng
          if (query && filteredInvoices.length === 0) {
            return null;
          }

          return (
            <div
              key={group.monthYear}
              className="rounded-2xl border border-border bg-surface shadow-2xs overflow-hidden transition-all"
            >
              {/* Header của từng tháng */}
              <button
                type="button"
                onClick={() => toggleMonth(group.monthYear)}
                className="w-full flex items-center justify-between px-6 py-4.5 hover:bg-cream-50/60 transition-colors cursor-pointer text-left select-none"
              >
                <div className="flex items-center gap-3.5">
                  <div className="text-muted">
                    {isExpanded ? (
                      <ChevronDown size={20} />
                    ) : (
                      <ChevronRight size={20} />
                    )}
                  </div>
                  <div className="flex items-center gap-2.5">
                    <Calendar size={18} className="text-foreground/70" />
                    <div>
                      <h3 className="text-base font-bold text-foreground">
                        {group.monthYear}
                      </h3>
                      <p className="text-xs text-muted">Danh sách hóa đơn</p>
                    </div>
                  </div>
                </div>

                <div className="text-xs text-muted font-medium">
                  {group.totalCount} hóa đơn
                </div>
              </button>

              {/* Bảng danh sách hóa đơn bên trong khi mở rộng */}
              {isExpanded && (
                <div className="border-t border-border/80 overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-border/60 text-muted font-medium">
                        <th className="py-3.5 px-6 font-semibold">Mã HĐ</th>
                        <th className="py-3.5 px-6 font-semibold">Thời gian</th>
                        <th className="py-3.5 px-6 font-semibold">Nhân viên</th>
                        <th className="py-3.5 px-6 font-semibold">Khách hàng</th>
                        <th className="py-3.5 px-6 font-semibold">Thanh toán</th>
                        <th className="py-3.5 px-6 font-semibold text-right">Tổng tiền</th>
                        <th className="py-3.5 px-6 font-semibold text-right">Hành động</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border/50 text-foreground">
                      {filteredInvoices.map((inv) => (
                        <tr
                          key={inv.id}
                          className="hover:bg-cream-50/40 transition-colors"
                        >
                          {/* Mã HĐ */}
                          <td className="py-4 px-6 font-semibold text-foreground">
                            {inv.code}
                          </td>

                          {/* Thời gian */}
                          <td className="py-4 px-6 text-foreground/80">
                            {inv.createdAt}
                          </td>

                          {/* Nhân viên */}
                          <td className="py-4 px-6 font-medium text-foreground">
                            {inv.staffName}
                          </td>

                          {/* Khách hàng */}
                          <td className="py-4 px-6">
                            <div className="flex flex-col">
                              <span className="font-medium text-foreground">
                                {inv.customerName}
                              </span>
                              {inv.customerPhone && (
                                <span className="text-[11px] text-muted">
                                  {inv.customerPhone}
                                </span>
                              )}
                            </div>
                          </td>

                          {/* Phương thức thanh toán (Badge) */}
                          <td className="py-4 px-6">
                            {inv.paymentMethod === 'CASH' ? (
                              <span className="inline-flex items-center px-2.5 py-1 rounded-md text-[11px] font-bold bg-[#E6F4EA] text-[#137333] uppercase">
                                CASH
                              </span>
                            ) : (
                              <span className="inline-flex items-center px-2.5 py-1 rounded-md text-[11px] font-bold bg-[#E8F0FE] text-[#1A73E8]">
                                Chuyển khoản
                              </span>
                            )}
                          </td>

                          {/* Tổng tiền */}
                          <td className="py-4 px-6 font-bold text-right text-foreground">
                            {formatMoney(inv.totalAmount)}
                          </td>

                          {/* Nút Chi tiết */}
                          <td className="py-4 px-6 text-right">
                            <button
                              type="button"
                              onClick={() => handleOpenDetail(inv)}
                              className="font-semibold text-[#0B3B2C] hover:text-[#D8B56A] transition-colors cursor-pointer"
                            >
                              Chi tiết
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Modal chi tiết hóa đơn (Tái sử dụng BillPreviewModal với kích thước thu gọn vừa vặn) */}
      <BillPreviewModal
        isOpen={isModalOpen}
        billData={selectedBill}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedBill(null);
        }}
      />
    </div>
  );
}
