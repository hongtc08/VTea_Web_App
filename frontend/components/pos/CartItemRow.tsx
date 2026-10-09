"use client";

import React from 'react';
import { Minus, Plus, Trash2, X } from 'lucide-react';
import { CartItem, Topping } from '@/types/pos';

interface CartItemRowProps {
  item: CartItem;
  onUpdateQuantity: (id: string, delta: number) => void;
  onRemoveItem: (id: string) => void;
  onOpenToppingModal: (item: CartItem) => void;
  onUpdateTopping: (cartItemId: string, topping: Topping, delta: number) => void;
  onRemoveTopping: (cartItemId: string, toppingId: string) => void;
}

export default function CartItemRow({
  item,
  onUpdateQuantity,
  onRemoveItem,
  onOpenToppingModal,
  onUpdateTopping,
  onRemoveTopping,
}: CartItemRowProps) {
  // Tính tổng tiền của món bao gồm các topping
  const toppingsTotal = item.toppings.reduce(
    (sum, t) => sum + t.price * t.quantity,
    0
  );
  const singleItemTotal = item.product.price + toppingsTotal;
  const lineTotal = singleItemTotal * item.quantity;

  const formattedLineTotal =
    new Intl.NumberFormat('vi-VN').format(lineTotal) + 'đ';
  const formattedProductPrice =
    new Intl.NumberFormat('vi-VN').format(item.product.price) + 'đ';

  return (
    <div className="flex flex-col py-3.5 border-b border-border/60 last:border-b-0">
      {/* Tên món và giá gốc */}
      <div className="flex items-start justify-between">
        <div className="flex flex-col">
          <span className="text-sm font-semibold text-foreground">
            {item.product.name}
          </span>
          <span className="text-xs font-semibold text-[#C98A2B] mt-0.5">
            {formattedProductPrice}
          </span>
        </div>
      </div>

      {/* Danh sách các Topping đã chọn */}
      {item.toppings.length > 0 && (
        <div className="mt-2 flex flex-col gap-1.5">
          {item.toppings.map((t) => (
            <div
              key={t.id}
              className="flex items-center justify-between text-xs text-foreground/80 pl-1"
            >
              <div className="flex items-center gap-1.5">
                <span className="text-foreground/90 font-medium">
                  {t.name}
                </span>
                <span className="text-muted text-[11px]">(x{t.quantity})</span>
              </div>

              <div className="flex items-center gap-1">
                {/* Nút giảm topping */}
                <button
                  type="button"
                  onClick={() =>
                    onUpdateTopping(
                      item.id,
                      { id: t.id, name: t.name, price: t.price },
                      -1
                    )
                  }
                  className="h-5 w-5 rounded border border-border flex items-center justify-center hover:bg-cream-100 cursor-pointer"
                >
                  <Minus size={11} />
                </button>

                {/* Nút tăng topping */}
                <button
                  type="button"
                  onClick={() =>
                    onUpdateTopping(
                      item.id,
                      { id: t.id, name: t.name, price: t.price },
                      1
                    )
                  }
                  className="h-5 w-5 rounded border border-border flex items-center justify-center hover:bg-cream-100 cursor-pointer"
                >
                  <Plus size={11} />
                </button>

                {/* Nút xóa hẳn topping */}
                <button
                  type="button"
                  onClick={() => onRemoveTopping(item.id, t.id)}
                  className="h-5 w-5 rounded border border-border flex items-center justify-center hover:bg-red-50 text-muted hover:text-danger cursor-pointer ml-0.5"
                >
                  <X size={11} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Nút Thêm Topping: Mở Modal Topping (không dùng toggle) */}
      <div className="mt-2.5">
        <button
          type="button"
          onClick={() => onOpenToppingModal(item)}
          className="text-[11px] font-semibold px-2.5 py-1 rounded-md bg-[#F2A900] text-white hover:bg-[#d89600] shadow-2xs transition-colors cursor-pointer"
        >
          + Thêm topping
        </button>
      </div>

      {/* Dòng điều khiển số lượng món & Tổng tiền & Nút thùng rác */}
      <div className="mt-3 flex items-center justify-between">
        {/* Bộ nút tăng giảm số lượng món */}
        <div className="flex items-center rounded-lg border border-border bg-surface overflow-hidden">
          <button
            type="button"
            onClick={() => onUpdateQuantity(item.id, -1)}
            className="h-7 w-7 flex items-center justify-center text-muted hover:text-foreground hover:bg-cream-100 transition-colors cursor-pointer"
          >
            <Minus size={13} />
          </button>
          <span className="w-8 text-center text-xs font-semibold text-foreground select-none">
            {item.quantity}
          </span>
          <button
            type="button"
            onClick={() => onUpdateQuantity(item.id, 1)}
            className="h-7 w-7 flex items-center justify-center text-muted hover:text-foreground hover:bg-cream-100 transition-colors cursor-pointer"
          >
            <Plus size={13} />
          </button>
        </div>

        {/* Tổng tiền và Nút xóa */}
        <div className="flex items-center gap-3">
          <span className="text-sm font-bold text-[#C98A2B]">
            {formattedLineTotal}
          </span>
          <button
            type="button"
            onClick={() => onRemoveItem(item.id)}
            className="p-1.5 rounded-md text-muted hover:text-danger hover:bg-red-50 transition-colors cursor-pointer"
            title="Xóa món"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
