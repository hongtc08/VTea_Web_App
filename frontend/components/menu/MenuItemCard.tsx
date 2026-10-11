import React from 'react';
import { Pencil, Trash2, Image as ImageIcon } from 'lucide-react';

export interface MenuItem {
  id: number;
  name: string;
  category: string;
  price: number;
  image: string;
}

interface MenuItemCardProps {
  item: MenuItem;
  showActions?: boolean;
  onEdit?: (item: MenuItem) => void;
  onDelete?: (item: MenuItem) => void;
  onClick?: (item: MenuItem) => void;
}

export default function MenuItemCard({
  item,
  showActions = true,
  onEdit,
  onDelete,
  onClick
}: MenuItemCardProps) {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN').format(price) + 'đ';
  };

  return (
    <div
      className={`bg-surface rounded-[var(--radius-card)] p-4 shadow-soft hover:shadow-elevated transition-all duration-300 group relative flex flex-col ${onClick ? 'cursor-pointer' : ''}`}
      onClick={() => onClick && onClick(item)}
    >
      <div className="bg-cream-100 rounded-[var(--radius-control)] mb-4 aspect-square flex items-center justify-center overflow-hidden p-6 relative text-muted transition-colors group-hover:bg-cream-200">
        {item.image ? (
          <img
            src={item.image}
            alt={item.name}
            className="w-full h-full object-contain mix-blend-multiply drop-shadow-md group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <ImageIcon size={48} className="opacity-40 group-hover:scale-110 group-hover:opacity-60 transition-all duration-300" />
        )}
      </div>
      <div className="flex-1 flex flex-col">
        <h3 className="font-bold text-foreground text-lg mb-1 leading-tight">{item.name}</h3>
        <p className="text-sm text-muted mb-3">{item.category}</p>
        <div className="mt-auto flex items-center justify-between">
          <span className="font-extrabold text-warning text-xl">{formatPrice(item.price)}</span>

          {showActions && (
            <div className="flex gap-1.5" onClick={(e) => e.stopPropagation()}>
              <button
                onClick={() => onEdit && onEdit(item)}
                className="p-2 text-muted hover:text-primary hover:bg-cream-50 rounded-[var(--radius-control)] transition-colors"
                title="Chỉnh sửa"
              >
                <Pencil size={18} />
              </button>
              <button
                onClick={() => onDelete && onDelete(item)}
                className="p-2 text-muted hover:text-danger hover:bg-red-50 rounded-[var(--radius-control)] transition-colors"
                title="Xóa"
              >
                <Trash2 size={18} />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
