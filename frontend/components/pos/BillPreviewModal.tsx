"use client";

import { X, Printer } from 'lucide-react';
import { CartItem } from '@/types/pos';

export interface BillDetailData {
  invoiceCode?: string;
  staffName?: string;
  customerName?: string;
  paymentMethod: string;
  createdAt: Date | string | null;
  items: CartItem[];
  subtotal: number;
  vat: number;
  total: number;
}

interface BillPreviewModalProps {
  isOpen: boolean;
  items?: CartItem[];
  subtotal?: number;
  vat?: number;
  total?: number;
  paymentMethod?: string;
  createdAt?: Date | string | null;
  invoiceCode?: string;
  staffName?: string;
  billData?: BillDetailData | null;
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
  items: propsItems,
  subtotal: propsSubtotal,
  vat: propsVat,
  total: propsTotal,
  paymentMethod: propsPaymentMethod,
  createdAt: propsCreatedAt,
  invoiceCode: propsInvoiceCode,
  staffName: propsStaffName,
  billData,
  onClose,
}: BillPreviewModalProps) {
  if (!isOpen) return null;

  const items = billData ? billData.items : (propsItems ?? []);
  const subtotal = billData ? billData.subtotal : (propsSubtotal ?? 0);
  const vat = billData ? billData.vat : (propsVat ?? 0);
  const total = billData ? billData.total : (propsTotal ?? 0);
  const paymentMethod = billData ? billData.paymentMethod : (propsPaymentMethod ?? 'Tiền mặt');
  const createdAt = billData ? billData.createdAt : (propsCreatedAt ?? null);
  const invoiceCode = billData?.invoiceCode ?? propsInvoiceCode ?? 'DEMO';
  const staffName = billData?.staffName ?? propsStaffName ?? 'Demo POS';

  let displayDate = '';
  if (createdAt) {
    const dateObj = typeof createdAt === 'string' ? new Date(createdAt) : createdAt;
    displayDate = !isNaN(dateObj.getTime())
      ? new Intl.DateTimeFormat('vi-VN', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
        }).format(dateObj)
      : String(createdAt);
  }

  // Hàm xử lý xuất PDF / In hóa đơn
  const handlePrint = () => {
    const itemsHtml = items.map((item) => {
      const unitPrice = getItemUnitPrice(item);
      const lineTotal = unitPrice * item.quantity;
      const toppingsHtml = item.toppings.map((t) => `
        <tr class="topping-row">
          <td colspan="4">+ ${t.name} (x${t.quantity}) - ${formatMoney(t.price * t.quantity * item.quantity)}đ</td>
        </tr>
      `).join('');

      return `
        <tr>
          <td><strong>${item.product.name}</strong></td>
          <td class="text-center">${item.quantity}</td>
          <td class="text-right">${formatMoney(item.product.price)}</td>
          <td class="text-right">${formatMoney(lineTotal)}</td>
        </tr>
        ${toppingsHtml}
      `;
    }).join('');

    const printContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8" />
          <title>Hóa đơn ${invoiceCode}</title>
          <style>
            @page {
              size: 80mm auto;
              margin: 0;
            }
            * {
              box-sizing: border-box;
            }
            body {
              font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
              font-size: 11px;
              line-height: 1.35;
              color: #111;
              margin: 0;
              padding: 0;
              background: #fff;
              display: flex;
              justify-content: center;
            }
            .bill-wrapper {
              width: 76mm;
              padding: 6mm 2mm 8mm 2mm;
              margin: 0 auto;
            }
            .text-center { text-align: center; }
            .text-right { text-align: right; }
            .header { margin-bottom: 6px; }
            .header h2 {
              margin: 0;
              font-size: 15px;
              font-weight: 800;
              letter-spacing: 0.5px;
            }
            .header p {
              margin: 2px 0 0 0;
              font-size: 11px;
              font-weight: 700;
              text-transform: uppercase;
              letter-spacing: 0.3px;
            }
            .dashed-line {
              border-top: 1px dashed #444;
              margin: 6px 0;
            }
            .solid-line {
              border-top: 1.5px solid #111;
              margin: 6px 0;
            }
            .info-grid {
              width: 100%;
              margin-bottom: 4px;
              font-size: 10.5px;
              border-collapse: collapse;
            }
            .info-grid td {
              padding: 1.5px 0;
              vertical-align: top;
            }
            table.items-table {
              width: 100%;
              border-collapse: collapse;
              font-size: 10.5px;
            }
            table.items-table th {
              border-bottom: 1px dashed #444;
              padding: 4px 0;
              font-size: 10px;
              font-weight: 700;
              text-align: left;
            }
            table.items-table td {
              padding: 3.5px 0 2px 0;
              vertical-align: top;
            }
            .item-name {
              font-weight: 600;
              word-break: break-word;
            }
            .topping-row td {
              padding: 1px 0 2px 6px;
              font-size: 9.5px;
              color: #555;
            }
            .summary-table {
              width: 100%;
              border-collapse: collapse;
              font-size: 10.5px;
              margin-top: 4px;
            }
            .summary-table td {
              padding: 2px 0;
            }
            .total-row {
              font-size: 12.5px;
              font-weight: 800;
            }
            .footer {
              margin-top: 12px;
              text-align: center;
              font-size: 10px;
              color: #444;
            }
            .footer p {
              margin: 2px 0;
            }
          </style>
        </head>
        <body>
          <div class="bill-wrapper">
            <div class="header text-center">
              <h2>VTEA COFFEE</h2>
              <p>HÓA ĐƠN THANH TOÁN</p>
            </div>
            <div class="dashed-line"></div>
            <table class="info-grid">
              <tr>
                <td>Mã HĐ: <strong>${invoiceCode}</strong></td>
                <td class="text-right">${displayDate}</td>
              </tr>
              <tr>
                <td>Thu ngân: ${staffName}</td>
                <td class="text-right">TT: ${paymentMethod}</td>
              </tr>
            </table>
            <div class="dashed-line"></div>
            <table class="items-table">
              <thead>
                <tr>
                  <th style="width: 46%;">TÊN MÓN</th>
                  <th class="text-center" style="width: 12%;">SL</th>
                  <th class="text-right" style="width: 20%;">GIÁ</th>
                  <th class="text-right" style="width: 22%;">TIỀN</th>
                </tr>
              </thead>
              <tbody>
                ${itemsHtml}
              </tbody>
            </table>
            <div class="dashed-line"></div>
            <table class="summary-table">
              <tr>
                <td>Tạm tính:</td>
                <td class="text-right">${formatMoney(subtotal)} đ</td>
              </tr>
              <tr>
                <td>VAT (10%):</td>
                <td class="text-right">${formatMoney(vat)} đ</td>
              </tr>
            </table>
            <div class="solid-line"></div>
            <table class="summary-table total-row">
              <tr>
                <td>TỔNG CỘNG:</td>
                <td class="text-right">${formatMoney(total)} VND</td>
              </tr>
            </table>
            <div class="solid-line"></div>
            <div class="footer">
              <p>Cảm ơn quý khách!</p>
              <p>Hẹn gặp lại quý khách lần sau</p>
            </div>
          </div>
          <script>
            window.onload = function() {
              window.focus();
              window.print();
            };
          </script>
        </body>
      </html>
    `;

    // Tạo iframe ẩn để in riêng hóa đơn mà không ảnh hưởng toàn bộ giao diện app
    const iframe = document.createElement('iframe');
    iframe.style.position = 'fixed';
    iframe.style.right = '0';
    iframe.style.bottom = '0';
    iframe.style.width = '0';
    iframe.style.height = '0';
    iframe.style.border = '0';

    document.body.appendChild(iframe);
    const doc = iframe.contentWindow?.document;
    if (doc) {
      doc.open();
      doc.write(printContent);
      doc.close();
      // Xóa iframe sau khi in xong
      setTimeout(() => {
        document.body.removeChild(iframe);
      }, 2000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 p-4 backdrop-blur-xs">
      <div className="flex max-h-[90vh] w-full max-w-lg flex-col overflow-hidden rounded-2xl border border-border bg-cream-100 shadow-elevated">
        {/* Header Modal */}
        <div className="flex items-center justify-between border-b border-border bg-surface px-5 py-3">
          <div>
            <h2 className="text-base font-semibold text-foreground">Chi tiết hóa đơn</h2>
            <p className="text-xs text-muted">
              Mã hóa đơn: <span className="font-bold text-foreground">{invoiceCode}</span>
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-full text-muted transition-colors hover:bg-cream-100 hover:text-foreground cursor-pointer"
            aria-label="Đóng"
          >
            <X size={20} />
          </button>
        </div>

        {/* Thân hóa đơn cuộn nếu nội dung dài */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5">
          <div className="mx-auto rounded-lg border border-border bg-white px-6 py-6 font-mono text-xs leading-5 text-slate-800 shadow-sm">
            <pre className="whitespace-pre-wrap text-center font-mono text-xs font-bold leading-5">
{`========================================
VTEA COFFEE
HÓA ĐƠN THANH TOÁN
========================================`}
            </pre>

            <div className="mt-3.5 grid grid-cols-[1fr_auto] gap-x-4 gap-y-1 text-slate-700">
              <span>Mã HĐ: {invoiceCode}</span>
              <span className="text-right">{displayDate}</span>
              <span>Nhân viên: {staffName}</span>
              <span />
              <span>Thanh toán: {paymentMethod}</span>
              <span />
            </div>

            <div className="my-2.5 border-t border-dashed border-slate-400" />
            <div className="grid grid-cols-[1fr_40px_70px_80px] gap-2 font-bold text-slate-900">
              <span>TÊN MÓN</span>
              <span className="text-right">SL</span>
              <span className="text-right">GIÁ</span>
              <span className="text-right">TIỀN</span>
            </div>
            <div className="my-2.5 border-t border-dashed border-slate-400" />

            <div className="space-y-2">
              {items.map((item) => {
                const unitPrice = getItemUnitPrice(item);
                const lineTotal = unitPrice * item.quantity;

                return (
                  <div key={item.id} className="space-y-0.5">
                    <div className="grid grid-cols-[1fr_40px_70px_80px] gap-2">
                      <span className="font-semibold text-slate-800 line-clamp-1">{item.product.name}</span>
                      <span className="text-right">{item.quantity}</span>
                      <span className="text-right">{formatMoney(item.product.price)}</span>
                      <span className="text-right">{formatMoney(lineTotal)}</span>
                    </div>
                    {item.toppings.map((topping) => (
                      <div
                        key={topping.id}
                        className="grid grid-cols-[1fr_40px_70px_80px] gap-2 pl-3 text-[11px] text-slate-500"
                      >
                        <span className="line-clamp-1">+ {topping.name}</span>
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

            <div className="my-3 border-t border-dashed border-slate-400" />
            <div className="ml-auto max-w-[220px] space-y-1 text-slate-700">
              <div className="flex justify-between">
                <span>Tạm tính:</span>
                <span>{formatMoney(subtotal)} đ</span>
              </div>
              <div className="flex justify-between">
                <span>VAT 10%:</span>
                <span>{formatMoney(vat)} đ</span>
              </div>
            </div>
            <div className="my-2 border-t border-slate-900" />
            <div className="flex justify-between text-sm font-bold text-slate-900">
              <span>TỔNG CỘNG:</span>
              <span>{formatMoney(total)} VND</span>
            </div>
            <div className="my-2 border-t border-slate-900" />

            <div className="mt-4 text-center text-slate-600 text-[11px]">
              <p>Cảm ơn quý khách!</p>
              <p>Hẹn gặp lại</p>
            </div>
          </div>
        </div>

        {/* Footer Modal */}
        <div className="flex justify-end gap-3 border-t border-border bg-cream-50/80 px-5 py-3">
          <button
            type="button"
            onClick={handlePrint}
            className="inline-flex items-center gap-1.5 rounded-xl bg-primary px-5 py-2 text-xs font-bold text-accent shadow-xs transition-colors hover:bg-primary-hover cursor-pointer"
          >
            <Printer size={15} />
            Xuất PDF / In
          </button>
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl border border-border bg-surface px-5 py-2 text-xs font-semibold text-foreground shadow-xs transition-colors hover:bg-cream-100 cursor-pointer"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
}
