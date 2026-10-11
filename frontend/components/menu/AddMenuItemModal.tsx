"use client";

import React, { useState, useEffect } from "react";
import { X, Image as ImageIcon, ChevronDown } from "lucide-react";

interface AddMenuItemModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (item: any) => void;
  mode?: 'menu' | 'topping';
  categories?: string[];
  itemToEdit?: any | null;
}

export default function AddMenuItemModal({
  isOpen,
  onClose,
  onSave,
  mode = 'menu',
  categories = [],
  itemToEdit = null
}: AddMenuItemModalProps) {
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("");

  // Reset or populate form when opened/closed, mode changes, or itemToEdit changes
  useEffect(() => {
    if (isOpen) {
      if (itemToEdit) {
        setName(itemToEdit.name);
        setPrice(itemToEdit.price.toString());
        setCategory(itemToEdit.category);
      } else {
        setName("");
        setPrice("");
        setCategory(categories.length > 0 ? categories[0] : "");
      }
    }
  }, [isOpen, mode, itemToEdit, categories]);

  if (!isOpen) return null;

  const isTopping = mode === 'topping';
  const isEdit = !!itemToEdit;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !price) return;

    onSave({
      id: isEdit ? itemToEdit.id : Date.now(),
      name,
      category: isTopping ? "Topping" : category || "Khác",
      price: parseInt(price.replace(/[^0-9]/g, "") || "0", 10),
      image: isEdit ? itemToEdit.image : "",
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-surface rounded-[var(--radius-card)] shadow-elevated w-full max-w-lg mx-4 overflow-hidden animate-in fade-in zoom-in duration-200">
        <div className="flex items-center justify-between p-6 pb-4 border-b border-border">
          <h2 className="text-2xl font-bold text-foreground">
            {isEdit
              ? (isTopping ? "Chỉnh sửa topping" : "Chỉnh sửa món ăn")
              : (isTopping ? "Thêm topping mới" : "Thêm món mới")}
          </h2>
          <button
            onClick={onClose}
            className="p-2 text-muted hover:bg-cream-50 hover:text-primary rounded-full transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="space-y-2">
            <label className="block text-base font-bold text-foreground">
              {isTopping ? "Tên topping" : "Tên món"}
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={isTopping ? "Ví dụ: Trân châu hoàng kim" : "Ví dụ: Trà sữa trân châu hoàng kim"}
              className="w-full px-4 py-3 rounded-[var(--radius-control)] border border-border focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-foreground bg-surface placeholder:text-muted"
            />
          </div>

          {!isTopping && (
            <div className="space-y-2">
              <label className="block text-base font-bold text-foreground">Danh mục</label>
              <div className="relative">
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-4 py-3 rounded-[var(--radius-control)] border border-border focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-foreground bg-surface appearance-none cursor-pointer"
                >
                  <option value="" disabled>-- Chọn danh mục --</option>
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center px-4 pointer-events-none text-muted">
                  <ChevronDown size={20} />
                </div>
              </div>
            </div>
          )}

          <div className="space-y-2">
            <label className="block text-base font-bold text-foreground">Giá bán (VNĐ)</label>
            <input
              type="text"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder="50.000"
              className="w-full px-4 py-3 rounded-[var(--radius-control)] border border-border focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-foreground bg-surface placeholder:text-muted"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-base font-bold text-foreground">
              {isTopping ? "Hình ảnh topping" : "Hình ảnh món"}
            </label>
            <div className="border-2 border-dashed border-border rounded-[var(--radius-card)] p-10 flex flex-col items-center justify-center text-center hover:bg-cream-50 transition-colors cursor-pointer group">
              <div className="mb-4 text-muted group-hover:text-primary transition-colors">
                <ImageIcon size={32} />
              </div>
              <p className="font-bold text-primary text-lg mb-1">Nhấn để tải ảnh lên</p>
              <p className="text-sm text-muted">Hỗ trợ: JPG, PNG (Tối đa 2MB)</p>
            </div>
          </div>

          <div className="flex gap-4 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 px-4 bg-cream-100 text-foreground text-base font-bold rounded-[var(--radius-control)] hover:bg-cream-200 transition-colors"
            >
              Hủy bỏ
            </button>
            <button
              type="submit"
              className="flex-1 py-3 px-4 bg-primary text-accent text-base font-bold rounded-[var(--radius-control)] hover:bg-primary-hover transition-colors shadow-soft"
            >
              {isEdit ? "Lưu thay đổi" : "Xác nhận thêm"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
