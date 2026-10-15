"use client";

import { Check, Info, X, FileText } from 'lucide-react';

interface PaymentSuccessModalProps {
  isOpen: boolean;
  total: number;
  paymentMethod: string;
  onClose: () => void;
  onExportBill: () => void;
}

export default function PaymentSuccessModal({
  isOpen,
  total,
  paymentMethod,
  onClose,
  onExportBill,
}: PaymentSuccessModalProps) {
  if (!isOpen) return null;

  const formattedTotal = `${new Intl.NumberFormat('vi-VN').format(total)}đ`;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 p-4 backdrop-blur-xs animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md rounded-3xl border border-border bg-surface p-6 shadow-elevated"
        onClick={(event) => event.stopPropagation()}
      >
        {/* Header với icon & nút đóng */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3.5">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-cream-100 text-primary">
              <Check size={24} strokeWidth={2.8} className="text-primary" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-foreground">
                Thanh toán thành công!
              </h2>
              <p className="mt-0.5 text-xs text-muted">
                Đơn hàng đã được ghi nhận.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-full border border-border text-muted transition-colors hover:bg-cream-100 hover:text-foreground cursor-pointer"
            aria-label="Đóng"
          >
            <X size={16} />
          </button>
        </div>

        {/* Thông tin thanh toán */}
        <div className="mt-5 rounded-2xl bg-cream-50/60 p-4 border border-border/70 space-y-2 text-xs">
          <div className="flex items-center justify-between">
            <span className="text-muted">Tổng tiền:</span>
            <span className="text-base font-bold text-[#C98A2B]">
              {formattedTotal}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-muted">Phương thức:</span>
            <span className="font-semibold text-foreground">
              {paymentMethod}
            </span>
          </div>
        </div>

        {/* Nút hành động */}
        <div className="mt-6 flex justify-end gap-2.5">
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl border border-border bg-surface px-5 py-2.5 text-xs font-semibold text-foreground shadow-2xs transition-colors hover:bg-cream-100 cursor-pointer"
          >
            Đóng
          </button>
          <button
            type="button"
            onClick={onExportBill}
            className="flex items-center gap-1.5 rounded-xl bg-primary px-5 py-2.5 text-xs font-bold text-accent shadow-soft transition-all hover:bg-primary-hover active:scale-[0.98] cursor-pointer"
          >
            <FileText size={14} />
            <span>Xuất bill</span>
          </button>
        </div>
      </div>
    </div>
  );
}
