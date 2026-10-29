"use client";

import React, { useState, useEffect, useMemo } from 'react';
import { Search, ChevronRight, ChevronDown, Calendar, Loader2, AlertCircle, RefreshCw } from 'lucide-react';
import { invoiceService } from '@/services/invoiceService';
import { InvoiceResponse } from '@/types/invoiceApi';
import BillPreviewModal, { BillDetailData } from '@/components/pos/BillPreviewModal';

interface GroupedMonth {
  monthYear: string; // e.g. "Tháng 04/2026"
  sortKey: string;   // e.g. "2026-04" for accurate chronological sorting
  totalCount: number;
  invoices: InvoiceResponse[];
}

export default function InvoicesPage() {
  const [invoices, setInvoices] = useState<InvoiceResponse[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const [searchQuery, setSearchQuery] = useState('');
  const [expandedMonths, setExpandedMonths] = useState<Record<string, boolean>>({});

  // Quản lý modal xem chi tiết hóa đơn
  const [selectedBill, setSelectedBill] = useState<BillDetailData | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Fetch danh sách hóa đơn từ API
  const fetchInvoices = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await invoiceService.getInvoices();
      setInvoices(data);

      // Tự động mở rộng tháng đầu tiên (mới nhất) nếu có
      if (data.length > 0) {
        const firstDate = new Date(data[0].createdAt);
        if (!isNaN(firstDate.getTime())) {
          const monthStr = String(firstDate.getMonth() + 1).padStart(2, '0');
          const monthKey = `Tháng ${monthStr}/${firstDate.getFullYear()}`;
          setExpandedMonths({ [monthKey]: true });
        }
      }
    } catch (err: any) {
      console.error('Lỗi tải danh sách hóa đơn:', err);
      setError(err?.message || 'Không thể tải danh sách hóa đơn. Vui lòng thử lại!');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchInvoices();
  }, []);

  const toggleMonth = (monthYear: string) => {
    setExpandedMonths((prev) => ({
      ...prev,
      [monthYear]: !prev[monthYear],
    }));
  };

  // Format ngày giờ: YYYY-MM-DD HH:mm:ss
  const formatDateTime = (dateStr: string) => {
    try {
      const d = new Date(dateStr);
      if (isNaN(d.getTime())) return dateStr;
      const year = d.getFullYear();
      const month = String(d.getMonth() + 1).padStart(2, '0');
      const day = String(d.getDate()).padStart(2, '0');
      const hours = String(d.getHours()).padStart(2, '0');
      const minutes = String(d.getMinutes()).padStart(2, '0');
      const seconds = String(d.getSeconds()).padStart(2, '0');
      return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
    } catch {
      return dateStr;
    }
  };

  // Mở modal chi tiết khi bấm nút "Chi tiết"
  const handleOpenDetail = (invoice: InvoiceResponse) => {
    const formattedCode = `HD${String(invoice.invoiceId).padStart(6, '0')}`;
    const totalAmount = Number(invoice.totalAmount) || 0;
    const subtotal = Math.round(totalAmount / 1.1);
    const vat = totalAmount - subtotal;

    const formattedBillData: BillDetailData = {
      invoiceCode: formattedCode,
      staffName: invoice.staffName || `Nhân viên #${invoice.userId}`,
      customerName: 'Khách lẻ',
      paymentMethod: invoice.paymentMethod === 'CASH' ? 'Tiền mặt' : 'Chuyển khoản',
      createdAt: invoice.createdAt,
      subtotal,
      vat,
      total: totalAmount,
      items: (invoice.items || []).map((item, index) => ({
        id: `inv-item-${invoice.invoiceId}-${item.productId}-${index}`,
        quantity: item.quantity,
        product: {
          id: item.productId,
          name: item.productName,
          price: item.unitPrice,
          category: 'Món',
        },
        toppings: (item.toppings || []).map((t) => ({
          id: String(t.toppingId),
          name: t.toppingName,
          price: t.unitPrice,
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

  // Gom nhóm danh sách hóa đơn theo tháng dựa vào createdAt
  const groupedMonthlyData = useMemo<GroupedMonth[]>(() => {
    const groups: Record<string, { sortKey: string; invoices: InvoiceResponse[] }> = {};

    invoices.forEach((inv) => {
      const d = new Date(inv.createdAt);
      let monthYear = 'Khác';
      let sortKey = '0000-00';
      if (!isNaN(d.getTime())) {
        const month = String(d.getMonth() + 1).padStart(2, '0');
        const year = d.getFullYear();
        monthYear = `Tháng ${month}/${year}`;
        sortKey = `${year}-${month}`;
      }

      if (!groups[monthYear]) {
        groups[monthYear] = {
          sortKey,
          invoices: [],
        };
      }
      groups[monthYear].invoices.push(inv);
    });

    // Sắp xếp các tháng theo thứ tự mới nhất -> cũ hơn
    return Object.keys(groups)
      .map((key) => ({
        monthYear: key,
        sortKey: groups[key].sortKey,
        totalCount: groups[key].invoices.length,
        invoices: groups[key].invoices,
      }))
      .sort((a, b) => b.sortKey.localeCompare(a.sortKey));
  }, [invoices]);

  const query = searchQuery.toLowerCase().trim();

  return (
    <div className="flex flex-col h-full w-full">
      {/* Tiêu đề trang & Nút tải lại */}
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold text-foreground">
          Lịch sử hóa đơn
        </h1>
        <button
          type="button"
          onClick={fetchInvoices}
          disabled={isLoading}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-border bg-surface text-xs font-semibold text-foreground hover:bg-cream-50/60 transition-colors cursor-pointer disabled:opacity-50"
          title="Tải lại dữ liệu"
        >
          <RefreshCw size={14} className={isLoading ? 'animate-spin' : ''} />
          Làm mới
        </button>
      </div>

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
          placeholder="Tìm kiếm theo mã HĐ (HD000001), nhân viên, phương thức..."
          className="w-full rounded-2xl border border-border bg-surface pl-11 pr-4 py-3 text-sm text-foreground placeholder:text-muted/70 shadow-2xs focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none transition-all"
        />
      </div>

      {/* Trạng thái Đang tải */}
      {isLoading && (
        <div className="flex flex-col items-center justify-center py-20 text-muted">
          <Loader2 size={32} className="animate-spin text-primary mb-3" />
          <p className="text-sm font-medium">Đang tải danh sách hóa đơn từ hệ thống...</p>
        </div>
      )}

      {/* Trạng thái Lỗi */}
      {!isLoading && error && (
        <div className="flex flex-col items-center justify-center p-8 bg-red-50/50 rounded-2xl border border-red-200 text-red-600 mb-6">
          <AlertCircle size={32} className="mb-2" />
          <p className="text-sm font-medium">{error}</p>
          <button
            type="button"
            onClick={fetchInvoices}
            className="mt-3 px-4 py-1.5 text-xs font-semibold bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            Thử lại
          </button>
        </div>
      )}

      {/* Trạng thái Trống (Chưa có hóa đơn nào) */}
      {!isLoading && !error && invoices.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 text-muted border border-dashed border-border rounded-2xl bg-surface/40">
          <Calendar size={40} className="mb-2 opacity-50" />
          <p className="text-base font-semibold text-foreground">Chưa có hóa đơn nào</p>
          <p className="text-xs text-muted mt-1">Các hóa đơn sau khi thanh toán tại màn hình POS sẽ xuất hiện ở đây.</p>
        </div>
      )}

      {/* Danh sách các khối tháng (Collapsible Month Groups) */}
      {!isLoading && !error && invoices.length > 0 && (
        <div className="space-y-4 pb-8">
          {groupedMonthlyData.map((group) => {
            const isExpanded = !!expandedMonths[group.monthYear];

            // Lọc các hóa đơn trong tháng theo từ khóa
            const filteredInvoices = group.invoices.filter((inv) => {
              if (!query) return true;
              const codeStr = `hd${String(inv.invoiceId).padStart(6, '0')}`;
              const staffStr = (inv.staffName || '').toLowerCase();
              const paymentStr = inv.paymentMethod.toLowerCase();
              const idStr = String(inv.invoiceId);

              return (
                codeStr.includes(query) ||
                idStr.includes(query) ||
                staffStr.includes(query) ||
                paymentStr.includes(query) ||
                (inv.paymentMethod === 'CASH' && 'tiền mặt'.includes(query)) ||
                (inv.paymentMethod === 'TRANSFER' && 'chuyển khoản'.includes(query))
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
                        {filteredInvoices.map((inv) => {
                          const formattedCode = `HD${String(inv.invoiceId).padStart(6, '0')}`;
                          return (
                            <tr
                              key={inv.invoiceId}
                              className="hover:bg-cream-50/40 transition-colors"
                            >
                              {/* Mã HĐ */}
                              <td className="py-4 px-6 font-semibold text-foreground">
                                {formattedCode}
                              </td>

                              {/* Thời gian */}
                              <td className="py-4 px-6 text-foreground/80">
                                {formatDateTime(inv.createdAt)}
                              </td>

                              {/* Nhân viên */}
                              <td className="py-4 px-6 font-medium text-foreground">
                                {inv.staffName || `Nhân viên #${inv.userId}`}
                              </td>

                              {/* Khách hàng */}
                              <td className="py-4 px-6">
                                <span className="font-medium text-foreground">
                                  Khách lẻ
                                </span>
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
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Modal chi tiết hóa đơn (Tái sử dụng BillPreviewModal) */}
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

