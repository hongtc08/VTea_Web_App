"use client";

import { X } from 'lucide-react';
import { CartItem } from '@/types/pos';

interface BillPreviewModalProps {
  isOpen: boolean;
  items: CartItem[];
  subtotal: number;
  vat: number;
  total: number;
  paymentMethod: string;
  createdAt: Date | null;
  onClose: () => void;
}

function formatMoney(value: number): string {
  return new Intl.NumberFormat('vi-VN').format(value);
}

function getItemUnitPrice(item: CartItem): number {
  const toppingsTotal = item.toppings.reduce(
    (sum, topping) => sum + topping.price * topping.quantity,
    0
  );
  return item.product.price + toppingsTotal;
}

export default function BillPreviewModal({
  isOpen,
  items,
  subtotal,
  vat,
  total,
  paymentMethod,
  createdAt,
  onClose,
}: BillPreviewModalProps) {
  if (!isOpen) return null;

  const displayDate = createdAt
    ? new Intl.DateTimeFormat('vi-VN', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      }).format(createdAt)
    : '';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 p-4 backdrop-blur-xs">
      <div className="flex max-h-[92vh] w-full max-w-4xl flex-col overflow-hidden rounded-2xl border border-border bg-cream-100 shadow-elevated">
        <div className="flex items-center justify-between border-b border-border bg-surface px-5 py-3">
          <div>
            <h2 className="text-lg font-semibold text-foreground">Xem trước hóa đơn</h2>
            <p className="text-xs font-medium text-warning">
              Demo UI - chưa xuất PDF, chưa lưu hóa đơn thật.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex h-9 w-9 items-center justify-center rounded-full text-muted transition-colors hover:bg-cream-100 hover:text-foreground"
            aria-label="Đóng"
          >
            <X size={22} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          <div className="mx-auto min-h-[760px] max-w-3xl rounded-lg border border-border bg-white px-12 py-10 font-mono text-[17px] leading-7 text-slate-900 shadow-sm">
            <pre className="whitespace-pre-wrap text-center font-mono text-[17px] font-bold leading-7">
{`========================================
VTEA COFFEE
HÓA ĐƠN THANH TOÁN
========================================`}
            </pre>

            <div className="mt-4 grid grid-cols-[1fr_auto] gap-x-6">
              <span>Mã HĐ: DEMO</span>
              <span>{displayDate}</span>
              <span>Nhân viên: Demo POS</span>
              <span />
              <span>Khách hàng: Khách vãng lai</span>
              <span />
              <span>Thanh toán: {paymentMethod}</span>
              <span />
            </div>

            <div className="my-3 border-t border-dashed border-slate-700" />
            <div className="grid grid-cols-[1fr_56px_96px_112px] gap-3 font-bold">
              <span>TÊN MÓN</span>
              <span className="text-right">SL</span>
              <span className="text-right">GIÁ</span>
              <span className="text-right">TIỀN</span>
            </div>
            <div className="my-3 border-t border-dashed border-slate-700" />

            <div className="space-y-3">
              {items.map((item) => {
                const unitPrice = getItemUnitPrice(item);
                const lineTotal = unitPrice * item.quantity;

                return (
                  <div key={item.id}>
                    <div className="grid grid-cols-[1fr_56px_96px_112px] gap-3">
                      <span>{item.product.name}</span>
                      <span className="text-right">{item.quantity}</span>
                      <span className="text-right">{formatMoney(item.product.price)}</span>
                      <span className="text-right">{formatMoney(lineTotal)}</span>
                    </div>
                    {item.toppings.map((topping) => (
                      <div
                        key={topping.id}
                        className="grid grid-cols-[1fr_56px_96px_112px] gap-3 pl-5 text-[15px] text-slate-600"
                      >
                        <span>+ {topping.name}</span>
                        <span className="text-right">{topping.quantity}</span>
                        <span className="text-right">{formatMoney(topping.price)}</span>
                        <span className="text-right">
                          {formatMoney(topping.price * topping.quantity * item.quantity)}
                        </span>
                      </div>
                    ))}
                  </div>
                );
              })}
            </div>

            <div className="my-4 border-t border-dashed border-slate-700" />
            <div className="ml-auto max-w-sm space-y-1">
              <div className="flex justify-between">
                <span>Tạm tính:</span>
                <span>{formatMoney(subtotal)} đ</span>
              </div>
              <div className="flex justify-between">
                <span>VAT 10%:</span>
                <span>{formatMoney(vat)} đ</span>
              </div>
            </div>
            <div className="my-3 border-t border-slate-900" />
            <div className="flex justify-between text-xl font-bold">
              <span>TỔNG CỘNG:</span>
              <span>{formatMoney(total)} VND</span>
            </div>
            <div className="my-3 border-t border-slate-900" />

            <div className="mt-6 text-center">
              <p>Cảm ơn quý khách!</p>
              <p>Hẹn gặp lại</p>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-4 border-t border-border bg-cream-100 px-8 py-5">
          <button
            type="button"
            disabled
            className="rounded-xl bg-slate-900 px-8 py-3 text-base font-bold text-white opacity-50"
          >
            Xuất PDF
          </button>
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl bg-surface px-8 py-3 text-base font-semibold text-foreground shadow-soft transition-colors hover:bg-cream-50"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
}
