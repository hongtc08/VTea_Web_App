"use client";

import { Check, Info, X } from 'lucide-react';

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
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 p-4 backdrop-blur-xs"
      onClick={onClose}
    >
      <div
        className="w-full max-w-3xl rounded-[28px] border border-border bg-surface p-8 shadow-elevated"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-5">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-cream-100 text-primary">
              <Info size={34} strokeWidth={1.7} />
            </div>
            <div>
              <div className="flex items-center gap-3">
                <Check size={30} strokeWidth={3} className="text-primary" />
                <h2 className="text-3xl font-bold text-foreground">
                  Thanh toán thành công!
                </h2>
              </div>
              <p className="mt-2 text-sm font-medium text-warning">
                Demo UI - chưa lưu hóa đơn thật, chưa gọi API thanh toán.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="flex h-9 w-9 items-center justify-center rounded-full border border-border text-muted transition-colors hover:bg-cream-100 hover:text-foreground"
            aria-label="Đóng"
          >
            <X size={18} />
          </button>
        </div>

        <div className="mt-8 space-y-3 text-xl text-muted">
          <p>
            Tổng tiền:{' '}
            <span className="font-semibold text-foreground">{formattedTotal}</span>
          </p>
          <p>Khách hàng: Khách vãng lai</p>
          <p>Phương thức: {paymentMethod}</p>
          <p>Điểm đã dùng: 0</p>
          <p>Điểm cộng: 0</p>
        </div>

        <div className="mt-9 flex justify-end gap-4">
          <button
            type="button"
            onClick={onClose}
            className="min-w-44 rounded-2xl bg-primary px-8 py-4 text-lg font-bold text-primary-foreground shadow-soft transition-colors hover:bg-primary-hover"
          >
            Đóng
          </button>
          <button
            type="button"
            onClick={onExportBill}
            className="min-w-52 rounded-2xl bg-blue-500 px-8 py-4 text-lg font-bold text-white shadow-soft transition-colors hover:bg-blue-600"
          >
            Xuất bill
          </button>
        </div>
      </div>
    </div>
  );
}
