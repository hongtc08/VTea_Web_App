"use client";

import React, { useState } from "react";
import { X, Pencil, Trash2, Plus, Folder } from "lucide-react";

export interface Category {
  id: number;
  name: string;
  status: string;
}

interface CategoryManagerModalProps {
  isOpen: boolean;
  onClose: () => void;
  categories: Category[];
  onAdd: (name: string) => void;
  onUpdate: (id: number, name: string) => void;
  onDelete: (id: number) => void;
}

export default function CategoryManagerModal({
  isOpen,
  onClose,
  categories,
  onAdd,
  onUpdate,
  onDelete
}: CategoryManagerModalProps) {
  const [newCategoryName, setNewCategoryName] = useState("");
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editName, setEditName] = useState("");

  if (!isOpen) return null;

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCategoryName.trim()) return;
    onAdd(newCategoryName.trim());
    setNewCategoryName("");
  };

  const startEdit = (cat: Category) => {
    setEditingId(cat.id);
    setEditName(cat.name);
  };

  const saveEdit = (id: number) => {
    if (editName.trim()) {
      onUpdate(id, editName.trim());
    }
    setEditingId(null);
    setEditName("");
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
            onClick={onClose}
            className="p-2 text-muted hover:bg-cream-50 hover:text-primary rounded-full transition-colors"
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
            <form onSubmit={handleAdd} className="flex flex-col md:flex-row md:items-end gap-4">
              <div className="flex-1 space-y-2">
                <label className="block text-sm font-bold text-foreground">Tên danh mục:</label>
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
                disabled={!newCategoryName.trim()}
                className="px-6 py-2.5 bg-primary text-accent text-sm font-bold rounded-[var(--radius-control)] hover:bg-primary-hover transition-colors shadow-soft disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
              >
                Thêm mới
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
                  <th className="px-6 py-4 w-32">TRẠNG THÁI</th>
                  <th className="px-6 py-4 w-24 text-right"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {categories.map((cat) => (
                  <tr key={cat.id} className="hover:bg-cream-50/50 transition-colors">
                    <td className="px-6 py-4 text-muted">{cat.id}</td>
                    <td className="px-6 py-4 font-medium text-foreground">
                      {editingId === cat.id ? (
                        <input
                          type="text"
                          value={editName}
                          onChange={(e) => setEditName(e.target.value)}
                          onBlur={() => saveEdit(cat.id)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') saveEdit(cat.id);
                            if (e.key === 'Escape') setEditingId(null);
                          }}
                          className="w-full px-3 py-1.5 border border-primary rounded-[var(--radius-control)] focus:outline-none focus:ring-2 focus:ring-primary/20 bg-surface"
                          autoFocus
                        />
                      ) : (
                        cat.name
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-foreground">{cat.status}</span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => startEdit(cat)}
                          className="p-1.5 text-muted hover:text-primary hover:bg-cream-100 rounded-md transition-colors"
                        >
                          <Pencil size={18} />
                        </button>
                        <button
                          onClick={() => onDelete(cat.id)}
                          className="p-1.5 text-muted hover:text-danger hover:bg-red-50 rounded-md transition-colors"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {categories.length === 0 && (
                  <tr>
                    <td colSpan={4} className="px-6 py-8 text-center text-muted">
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
