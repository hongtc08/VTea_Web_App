"use client";

import React, { useState } from "react";
import {
  X,
  Pencil,
  Trash2,
  Plus,
  Folder,
  RotateCcw,
  Loader2,
} from "lucide-react";
import { Category } from "@/types/menu";
import { toast } from "sonner";

export type { Category };

interface CategoryManagerModalProps {
  isOpen: boolean;
  onClose: () => void;
  categories: Category[];
  onAdd: (name: string) => Promise<void> | void;
  onUpdate: (id: number, name: string) => Promise<void> | void;
  onDelete: (id: number) => Promise<void> | void;
  onToggleStatus?: (id: number, isAvailable: boolean) => Promise<void> | void;
}

export default function CategoryManagerModal({
  isOpen,
  onClose,
  categories,
  onAdd,
  onUpdate,
  onDelete,
  onToggleStatus,
}: CategoryManagerModalProps) {
  const [newCategoryName, setNewCategoryName] = useState("");
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editName, setEditName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUpdatingId, setIsUpdatingId] = useState<number | null>(null);

  if (!isOpen) return null;

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = newCategoryName.trim();
    if (!trimmed || isSubmitting) return;

    // Chặn trùng tên danh mục ngay tại client
    const isDuplicate = categories.some(
      (c) => c.name.trim().toLowerCase() === trimmed.toLowerCase(),
    );
    if (isDuplicate) {
      toast.error(`Danh mục "${trimmed}" đã tồn tại!`);
      return;
    }

    setIsSubmitting(true);
    try {
      await onAdd(trimmed);
      setNewCategoryName("");
    } finally {
      setIsSubmitting(false);
    }
  };

  const startEdit = (cat: Category) => {
    setEditingId(cat.id);
    setEditName(cat.name);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditName("");
  };

  const handleKeyDown = async (
    e: React.KeyboardEvent<HTMLInputElement>,
    cat: Category,
  ) => {
    if (e.key === "Enter") {
      e.preventDefault();
      const trimmed = editName.trim();
      if (!trimmed) {
        toast.error("Tên danh mục không được để trống!");
        return;
      }
      if (trimmed.toLowerCase() === cat.name.toLowerCase()) {
        cancelEdit();
        return;
      }

      // Chặn trùng tên với danh mục khác khi cập nhật
      const isDuplicate = categories.some(
        (c) =>
          c.id !== cat.id &&
          c.name.trim().toLowerCase() === trimmed.toLowerCase(),
      );
      if (isDuplicate) {
        toast.error(`Danh mục "${trimmed}" đã tồn tại!`);
        return;
      }

      setIsUpdatingId(cat.id);
      try {
        await onUpdate(cat.id, trimmed);
        cancelEdit();
      } catch {
        // Giữ nguyên input để người dùng chỉnh sửa tiếp nếu xảy ra lỗi
      } finally {
        setIsUpdatingId(null);
      }
    } else if (e.key === "Escape") {
      cancelEdit();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-surface rounded-[var(--radius-card)] shadow-elevated w-full max-w-3xl mx-4 overflow-hidden animate-in fade-in zoom-in duration-200 flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between p-6 pb-4 border-b border-border">
          <div className="flex items-center gap-3 text-foreground">
            <Folder size={24} />
            <h2 className="text-2xl font-bold">Quản lý danh mục</h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 text-muted hover:bg-cream-50 hover:text-primary rounded-full transition-colors cursor-pointer"
          >
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto flex-1 bg-background flex flex-col gap-6">
          {/* Add Form */}
          <div className="bg-surface border border-border rounded-[var(--radius-card)] p-6 shadow-soft shrink-0">
            <div className="flex items-center gap-2 mb-4 text-foreground">
              <Plus size={20} className="text-primary" />
              <h3 className="font-bold text-lg">Thêm danh mục mới</h3>
            </div>
            <form
              onSubmit={handleAdd}
              className="flex flex-col md:flex-row md:items-end gap-4"
            >
              <div className="flex-1 space-y-2">
                <label className="block text-sm font-bold text-foreground">
                  Tên danh mục:
                </label>
                <input
                  type="text"
                  value={newCategoryName}
                  onChange={(e) => setNewCategoryName(e.target.value)}
                  placeholder="VD: Trà sữa, Cà phê..."
                  className="w-full px-4 py-2.5 rounded-[var(--radius-control)] border border-border focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-foreground bg-background placeholder:text-muted"
                />
              </div>
              <button
                type="submit"
                disabled={!newCategoryName.trim() || isSubmitting}
                className="px-6 py-2.5 bg-primary text-accent text-sm font-bold rounded-[var(--radius-control)] hover:bg-primary-hover transition-colors shadow-soft disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap cursor-pointer flex items-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    Đang thêm...
                  </>
                ) : (
                  "Thêm mới"
                )}
              </button>
            </form>
          </div>

          {/* Table */}
          <div className="bg-surface border border-border rounded-[var(--radius-card)] overflow-hidden shadow-soft">
            <table className="w-full text-sm text-left">
              <thead className="bg-cream-50 text-muted font-bold border-b border-border">
                <tr>
                  <th className="px-6 py-4 w-16">ID</th>
                  <th className="px-6 py-4">TÊN DANH MỤC</th>
                  <th className="px-6 py-4 w-36">TRẠNG THÁI</th>
                  <th className="px-6 py-4 w-28 text-right"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {categories.map((cat) => {
                  const isAvailable = cat.isAvailable !== false;
                  return (
                    <tr
                      key={cat.id}
                      className="hover:bg-cream-50/50 transition-colors"
                    >
                      <td className="px-6 py-4 text-muted">{cat.id}</td>
                      <td className="px-6 py-4 font-medium text-foreground">
                        {editingId === cat.id ? (
                          <div className="flex flex-col gap-1">
                            <div className="relative flex items-center">
                              <input
                                type="text"
                                value={editName}
                                onChange={(e) => setEditName(e.target.value)}
                                onKeyDown={(e) => handleKeyDown(e, cat)}
                                onBlur={cancelEdit}
                                disabled={isUpdatingId === cat.id}
                                className="w-full px-3 py-1.5 border border-primary rounded-[var(--radius-control)] focus:outline-none focus:ring-2 focus:ring-primary/20 bg-surface text-foreground pr-8 text-sm"
                                autoFocus
                              />
                              {isUpdatingId === cat.id && (
                                <Loader2
                                  size={16}
                                  className="animate-spin absolute right-2 text-primary"
                                />
                              )}
                            </div>
                            <span className="text-[11px] text-muted font-normal">
                              Nhấn{" "}
                              <kbd className="px-1 py-0.2 bg-cream-100 rounded text-foreground font-mono">
                                Enter
                              </kbd>{" "}
                              để lưu,{" "}
                              <kbd className="px-1 py-0.2 bg-cream-100 rounded text-foreground font-mono">
                                Esc
                              </kbd>{" "}
                              để hủy
                            </span>
                          </div>
                        ) : (
                          cat.name
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                            isAvailable
                              ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                              : "bg-red-50 text-red-600 border border-red-200"
                          }`}
                        >
                          {cat.status ||
                            (isAvailable ? "Đang bán" : "Ngừng bán")}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            type="button"
                            onClick={() => startEdit(cat)}
                            title="Sửa tên danh mục"
                            className="p-1.5 text-muted hover:text-primary hover:bg-cream-100 rounded-md transition-colors cursor-pointer"
                          >
                            <Pencil size={18} />
                          </button>
                          {isAvailable ? (
                            <button
                              type="button"
                              onClick={() => onDelete(cat.id)}
                              title="Ngừng bán danh mục"
                              className="p-1.5 text-muted hover:text-danger hover:bg-red-50 rounded-md transition-colors cursor-pointer"
                            >
                              <Trash2 size={18} />
                            </button>
                          ) : (
                            onToggleStatus && (
                              <button
                                type="button"
                                onClick={() => onToggleStatus(cat.id, true)}
                                title="Mở bán lại danh mục"
                                className="p-1.5 text-muted hover:text-emerald-600 hover:bg-emerald-50 rounded-md transition-colors cursor-pointer"
                              >
                                <RotateCcw size={18} />
                              </button>
                            )
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
                {categories.length === 0 && (
                  <tr>
                    <td
                      colSpan={4}
                      className="px-6 py-8 text-center text-muted"
                    >
                      Chưa có danh mục nào.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export { CategoryManagerModal };
