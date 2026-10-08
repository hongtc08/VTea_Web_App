"use client";

import React, { useRef, useEffect } from 'react';
import { Search } from 'lucide-react';
import { Product } from '@/types/pos';
import ProductCard from './ProductCard';

interface ProductListProps {
  products: Product[];
  categories: string[];
  selectedCategory: string;
  onSelectCategory: (cat: string) => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  onAddToCart: (product: Product) => void;
  searchInputRef?: React.RefObject<HTMLInputElement | null>;
}

export default function ProductList({
  products,
  categories,
  selectedCategory,
  onSelectCategory,
  searchQuery,
  onSearchChange,
  onAddToCart,
  searchInputRef,
}: ProductListProps) {
  return (
    <div className="flex flex-col h-full overflow-hidden pr-2">
      {/* Tiêu đề & Thanh tìm kiếm */}
      <div className="mb-4">
        <h1 className="text-2xl font-bold text-foreground tracking-tight">
          Bán hàng (POS)
        </h1>

        <div className="relative mt-3">
          <Search
            size={18}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-muted"
          />
          <input
            ref={searchInputRef}
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Tìm kiếm sản phẩm..."
            className="w-full rounded-2xl border border-border bg-surface pl-11 pr-4 py-2.5 text-sm text-foreground placeholder:text-muted/70 shadow-sm focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none transition-all"
          />
        </div>
      </div>

      {/* Bộ lọc Category Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-3 pt-1 scrollbar-none">
        {categories.map((cat) => {
          const isSelected = selectedCategory === cat;
          return (
            <button
              key={cat}
              onClick={() => onSelectCategory(cat)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all duration-150 cursor-pointer ${
                isSelected
                  ? 'bg-primary text-accent shadow-sm'
                  : 'bg-surface text-foreground border border-border/80 hover:bg-cream-100'
              }`}
            >
              {cat}
            </button>
          );
        })}
      </div>

      {/* Lưới sản phẩm */}
      <div className="flex-1 overflow-y-auto pr-1 pt-1 pb-4">
        {products.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 text-muted text-sm">
            <p>Không tìm thấy sản phẩm nào phù hợp</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-4 gap-3.5">
            {products.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onAddToCart={onAddToCart}
              />
            ))}
          </div>
        )}
      </div>

      {/* Thanh phím tắt Footer */}
      <div className="border-t border-border/60 pt-3 flex items-center gap-4 text-xs text-muted">
        <span className="font-medium text-foreground/80">Phím tắt:</span>
        <div className="flex items-center gap-1.5">
          <kbd className="px-2 py-0.5 rounded bg-surface border border-border text-[11px] font-semibold text-foreground shadow-2xs">
            F1
          </kbd>
          <span>Bật Bán hàng</span>
        </div>
        <div className="flex items-center gap-1.5">
          <kbd className="px-2 py-0.5 rounded bg-surface border border-border text-[11px] font-semibold text-foreground shadow-2xs">
            F12
          </kbd>
          <span>Thanh toán</span>
        </div>
        <div className="flex items-center gap-1.5">
          <kbd className="px-2 py-0.5 rounded bg-surface border border-border text-[11px] font-semibold text-foreground shadow-2xs">
            Esc
          </kbd>
          <span>Hủy / Xóa giỏ</span>
        </div>
      </div>
    </div>
  );
}

