"use client";

import React from 'react';
import { ShoppingCart, ChevronDown, CreditCard } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';
import { CartItem } from '@/types/pos';
import CartItemRow from './CartItemRow';

interface CartProps {
  onOpenToppingModalForCartItem?: (item: CartItem) => void;
}

export default function Cart({ onOpenToppingModalForCartItem }: CartProps) {
  const {
    cartItems,
    paymentMethod,
    setPaymentMethod,
    updateQuantity,
    removeItem,
    clearCart,
    updateToppingInCart,
    removeToppingFromCart,
    subtotal,
    vat,
    total,
    checkout,
  } = useCart();

  const formattedSubtotal =
    new Intl.NumberFormat('vi-VN').format(subtotal) + 'đ';
  const formattedVat = new Intl.NumberFormat('vi-VN').format(vat) + 'đ';
  const formattedTotal = new Intl.NumberFormat('vi-VN').format(total) + 'đ';

  return (
    <div className="flex flex-col h-full bg-surface rounded-3xl border border-border/80 shadow-soft overflow-hidden">
      {/* Header Giỏ hàng */}
      <div className="flex items-center justify-between px-6 py-4.5 border-b border-border/60">
        <h2 className="text-base font-bold text-foreground">Đơn hàng</h2>
        <button
          type="button"
          onClick={clearCart}
          disabled={cartItems.length === 0}
          className="text-xs font-semibold text-danger hover:underline disabled:opacity-40 disabled:no-underline cursor-pointer transition-colors"
        >
          Xóa tất cả
        </button>
      </div>

      {/* Danh sách các món trong giỏ */}
      <div className="flex-1 overflow-y-auto px-6 divide-y divide-border/60">
        {cartItems.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full min-h-[220px] text-muted py-12">
            <ShoppingCart size={36} className="stroke-[1.3] text-muted/50 mb-3" />
            <span className="text-xs font-medium text-muted">
              Chưa có món nào
            </span>
          </div>
        ) : (
          cartItems.map((item) => (
            <CartItemRow
              key={item.id}
              item={item}
              onUpdateQuantity={updateQuantity}
              onRemoveItem={removeItem}
              onOpenToppingModal={(cartItem) => {
                if (onOpenToppingModalForCartItem) {
                  onOpenToppingModalForCartItem(cartItem);
                }
              }}
              onUpdateTopping={updateToppingInCart}
              onRemoveTopping={removeToppingFromCart}
            />
          ))
        )}
      </div>

      {/* Footer Tổng kết thanh toán */}
      <div className="px-6 py-4.5 border-t border-border/60 bg-cream-50/40">
        {/* Tạm tính & VAT */}
        <div className="space-y-1.5 text-xs">
          <div className="flex items-center justify-between text-muted">
            <span>Tạm tính:</span>
            <span className="font-medium text-foreground">{formattedSubtotal}</span>
          </div>
          <div className="flex items-center justify-between text-muted">
            <span>VAT (10%):</span>
            <span className="font-medium text-foreground">{formattedVat}</span>
          </div>
        </div>

        {/* Tổng cộng */}
        <div className="flex items-center justify-between pt-3 mt-3 border-t border-border/60">
          <span className="text-sm font-bold text-foreground">Tổng cộng:</span>
          <span className="text-lg font-bold text-[#C98A2B]">
            {formattedTotal}
          </span>
        </div>

        {/* Phương thức thanh toán */}
        <div className="mt-4">
          <label className="block text-xs text-muted mb-1.5">
            Phương thức thanh toán:
          </label>
          <div className="relative">
            <select
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value)}
              className="w-full appearance-none rounded-xl border border-border bg-surface px-4 py-2.5 text-xs font-medium text-foreground outline-none focus:border-primary cursor-pointer pr-10"
            >
              <option value="Tiền mặt">Tiền mặt</option>
              <option value="Chuyển khoản (QR Code)">Chuyển khoản (QR Code)</option>
              <option value="Thẻ ngân hàng">Thẻ ngân hàng</option>
              <option value="Ví điện tử">Ví điện tử</option>
            </select>
            <ChevronDown
              size={15}
              className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-muted"
            />
          </div>
        </div>

        {/* Nút bấm Thanh toán */}
        <div className="mt-4">
          <button
            type="button"
            onClick={checkout}
            disabled={cartItems.length === 0}
            className="w-full rounded-xl bg-primary py-3 px-4 text-sm font-bold text-accent shadow-soft hover:bg-primary-hover active:scale-[0.99] disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer transition-all flex items-center justify-center gap-2"
          >
            <CreditCard size={17} />
            <span>Thanh toán</span>
          </button>
        </div>
      </div>
    </div>
  );
}
