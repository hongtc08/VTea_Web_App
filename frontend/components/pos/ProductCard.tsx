"use client";

import React from 'react';
import Image from 'next/image';
import { Product } from '@/types/pos';
import { Plus } from 'lucide-react';

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product) => void;
}

export default function ProductCard({ product, onAddToCart }: ProductCardProps) {
  const formattedPrice = new Intl.NumberFormat('vi-VN').format(product.price) + 'đ';

  return (
    <div
      onClick={() => onAddToCart(product)}
      className="group relative flex flex-col justify-between rounded-2xl bg-surface border border-border/70 p-3.5 shadow-sm hover:shadow-md hover:border-accent transition-all duration-200 cursor-pointer select-none active:scale-[0.98]"
    >
      {/* Vùng hình ảnh sản phẩm với nền mềm nhẹ nhàng */}
      <div className="relative aspect-square w-full rounded-xl bg-[#F7F0E1]/50 overflow-hidden flex items-center justify-center mb-3">
        {product.imageUrl ? (
          <Image
            src={product.imageUrl}
            alt={product.name}
            fill
            className="object-contain p-2 group-hover:scale-105 transition-transform duration-300"
            sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
          />
        ) : (
          <div className="text-3xl text-primary/40 font-bold">VTea</div>
        )}

        {/* Nút cộng nổi khi hover */}
        <div className="absolute right-2 bottom-2 h-7 w-7 rounded-full bg-primary text-accent opacity-0 group-hover:opacity-100 flex items-center justify-center shadow-md transition-opacity duration-200">
          <Plus size={16} strokeWidth={2.5} />
        </div>
      </div>

      {/* Thông tin tên, danh mục và giá */}
      <div className="flex flex-col">
        <h3 className="text-sm font-semibold text-foreground line-clamp-1 group-hover:text-primary transition-colors">
          {product.name}
        </h3>
        <span className="text-xs text-muted mt-0.5">{product.category}</span>
        <span className="text-sm font-bold text-[#C98A2B] mt-1.5">
          {formattedPrice}
        </span>
      </div>
    </div>
  );
}

