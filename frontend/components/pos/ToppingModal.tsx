"use client";

import React, { useState } from 'react';
import Image from 'next/image';
import { X, Plus, Minus, Check } from 'lucide-react';
import { Product, SelectedTopping } from '@/types/pos';
import { AVAILABLE_TOPPINGS } from '@/data/mockProducts';

interface ToppingModalProps {
  isOpen: boolean;
  product: Product | null;
  onClose: () => void;
  onConfirm: (product: Product, selectedToppings: SelectedTopping[]) => void;
}

export default function ToppingModal({
  isOpen,
  product,
  onClose,
  onConfirm,
}: ToppingModalProps) {
  // Lưu danh sách topping được chọn theo { [toppingId]: quantity }
  const [selectedToppings, setSelectedToppings] = useState<Record<string, number>>({});
  const [searchQuery, setSearchQuery] = useState('');

  if (!isOpen || !product) return null;

  // Click vào card topping: nếu chưa chọn thì chọn 1, nếu đã chọn thì không đóng modal mà giữ nguyên để người dùng chọn tiếp hoặc bấm bỏ
  const handleToggleTopping = (toppingId: string) => {
    setSelectedToppings((prev) => {
      const current = prev[toppingId] || 0;
      if (current > 0) {
        const copy = { ...prev };
        delete copy[toppingId];
        return copy;
      }
      return { ...prev, [toppingId]: 1 };
    });
  };

  // Tăng / giảm số lượng của topping
  const handleUpdateQty = (toppingId: string, delta: number, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedToppings((prev) => {
      const current = prev[toppingId] || 0;
      const next = current + delta;
      if (next <= 0) {
        const copy = { ...prev };
        delete copy[toppingId];
        return copy;
      }
      return { ...prev, [toppingId]: next };
    });
  };

  // Tính tiền topping phụ
  const toppingsExtraPrice = AVAILABLE_TOPPINGS.reduce((sum, top) => {
    const qty = selectedToppings[top.id] || 0;
    return sum + top.price * qty;
  }, 0);

  const totalItemPrice = product.price + toppingsExtraPrice;

  const handleClose = () => {
    setSelectedToppings({});
    setSearchQuery('');
    onClose();
  };

  // Chỉ đóng modal và gửi danh sách topping khi bấm nút "Thêm vào giỏ hàng"
  const handleConfirm = () => {
    const toppingsList: SelectedTopping[] = AVAILABLE_TOPPINGS.filter(
      (top) => (selectedToppings[top.id] || 0) > 0
    ).map((top) => ({
      id: top.id,
      name: top.name,
      price: top.price,
      quantity: selectedToppings[top.id] || 1,
    }));

    onConfirm(product, toppingsList);
    handleClose();
  };

  const filteredToppings = AVAILABLE_TOPPINGS.filter((t) =>
    t.name.toLowerCase().includes(searchQuery.toLowerCase().trim())
  );

  const totalSelectedCount = Object.values(selectedToppings).reduce(
    (a, b) => a + b,
    0
  );

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200"
      onClick={handleClose}
    >
      <div
        className="relative w-full max-w-2xl bg-surface rounded-3xl border border-border shadow-elevated overflow-hidden flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Modal */}
        <div className="flex items-center justify-between px-6 py-4.5 border-b border-border bg-cream-50/50">
          <div>
            <h2 className="text-xl font-bold text-foreground">Thêm topping</h2>
            <p className="text-xs text-muted mt-0.5">
              Chọn topping cho món:{' '}
              <span className="font-semibold text-primary">{product.name}</span>
              {totalSelectedCount > 0 && (
                <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-bold bg-accent/20 text-foreground">
                  Đã chọn {totalSelectedCount} topping
                </span>
              )}
            </p>
          </div>
          <button
            type="button"
            onClick={handleClose}
            className="h-8 w-8 rounded-full border border-border flex items-center justify-center text-muted hover:text-foreground hover:bg-cream-200 transition-colors cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        {/* Thanh tìm kiếm topping */}
        <div className="px-6 pt-3 pb-1">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Tìm kiếm topping..."
            className="w-full rounded-xl border border-border bg-surface px-3.5 py-2 text-xs text-foreground placeholder:text-muted/60 focus:border-primary outline-none"
          />
        </div>

        {/* Lưới danh sách Topping: Click chọn thoải mái nhiều loại không bị đóng */}
        <div className="flex-1 overflow-y-auto p-6 pt-3">
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3.5">
            {filteredToppings.map((topping) => {
              const qty = selectedToppings[topping.id] || 0;
              const isSelected = qty > 0;

              return (
                <div
                  key={topping.id}
                  onClick={() => handleToggleTopping(topping.id)}
                  className={`group relative flex flex-col justify-between rounded-2xl p-3 border transition-all cursor-pointer select-none ${
                    isSelected
                      ? 'border-primary bg-primary/5 ring-2 ring-primary/20 shadow-sm'
                      : 'border-border bg-surface hover:border-accent hover:shadow-xs'
                  }`}
                >
                  {/* Badge tích chọn */}
                  {isSelected && (
                    <div className="absolute top-2 right-2 z-10 h-5 w-5 rounded-full bg-primary text-accent flex items-center justify-center shadow-xs">
                      <Check size={12} strokeWidth={3} />
                    </div>
                  )}

                  {/* Ảnh topping */}
                  <div className="relative aspect-square w-full rounded-xl bg-cream-100 overflow-hidden flex items-center justify-center mb-2.5">
                    {topping.imageUrl ? (
                      <Image
                        src={topping.imageUrl}
                        alt={topping.name}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                        sizes="(max-width: 640px) 50vw, 33vw"
                      />
                    ) : (
                      <span className="text-xs font-bold text-primary/50">VTea</span>
                    )}
                  </div>

                  {/* Tên & giá & điều chỉnh số lượng */}
                  <div>
                    <h4 className="text-xs font-bold text-foreground line-clamp-1">
                      {topping.name}
                    </h4>
                    <span className="text-[11px] text-muted block mt-0.5">
                      {topping.category || 'Topping'}
                    </span>
                    <div className="flex items-center justify-between mt-1.5">
                      <span className="text-xs font-bold text-[#C98A2B]">
                        {new Intl.NumberFormat('vi-VN').format(topping.price)}đ
                      </span>

                      {/* Bộ nút tăng / giảm số lượng */}
                      {isSelected && (
                        <div
                          className="flex items-center rounded-lg border border-border bg-surface overflow-hidden"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <button
                            type="button"
                            onClick={(e) => handleUpdateQty(topping.id, -1, e)}
                            className="h-5 w-5 flex items-center justify-center text-muted hover:text-foreground hover:bg-cream-100 transition-colors cursor-pointer"
                          >
                            <Minus size={10} />
                          </button>
                          <span className="w-5 text-center text-[11px] font-bold text-foreground">
                            {qty}
                          </span>
                          <button
                            type="button"
                            onClick={(e) => handleUpdateQty(topping.id, 1, e)}
                            className="h-5 w-5 flex items-center justify-center text-muted hover:text-foreground hover:bg-cream-100 transition-colors cursor-pointer"
                          >
                            <Plus size={10} />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer Modal: Tổng cộng & Nút xác nhận */}
        <div className="px-6 py-4 border-t border-border bg-cream-50/50 flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-xs text-muted">Tổng cộng món này:</span>
            <span className="text-base font-bold text-[#C98A2B]">
              {new Intl.NumberFormat('vi-VN').format(totalItemPrice)}đ
            </span>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => {
                onConfirm(product, []);
                handleClose();
              }}
              className="px-4 py-2.5 rounded-xl border border-border bg-surface hover:bg-cream-100 text-xs font-semibold text-foreground transition-colors cursor-pointer"
            >
              Không lấy topping
            </button>
            <button
              type="button"
              onClick={handleConfirm}
              className="px-5 py-2.5 rounded-xl bg-primary hover:bg-primary-hover text-accent text-xs font-bold shadow-soft transition-all cursor-pointer active:scale-[0.98]"
            >
              Thêm vào giỏ hàng
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
