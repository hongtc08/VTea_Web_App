"use client";

import React, { useState, useEffect, useCallback } from "react";
import {
  Search,
  Folder,
  Layers,
  Plus,
  ArrowLeft,
  AlertCircle,
  Trash2,
} from "lucide-react";
import AddMenuItemModal from "@/components/menu/AddMenuItemModal";
import MenuItemCard from "@/components/menu/MenuItemCard";
import CategoryManagerModal from "@/components/menu/CategoryManagerModal";
import { menuService } from "@/services/menuService";
import { categoryService } from "@/services/categoryService";
import { MenuItem, Category } from "@/types/menu";
import { matchesSearchTerm } from "@/lib/utils";
import { toast } from "sonner";

export default function MenuPage() {
  const [items, setItems] = useState<MenuItem[]>([]);
  const [toppings, setToppings] = useState<MenuItem[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [currentView, setCurrentView] = useState<"menu" | "topping">("menu");
  const [activeCategory, setActiveCategory] = useState("Tất cả");
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [itemToEdit, setItemToEdit] = useState<MenuItem | null>(null);
  const [itemToDelete, setItemToDelete] = useState<MenuItem | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);

  // Tải lại danh sách món, topping và danh mục từ API (hỗ trợ silent reload để không giật màn hình)
  const loadMenuData = useCallback(async (silent = false) => {
    if (!silent) setIsLoading(true);
    setError(null);
    try {
      const [fetchedItems, fetchedToppings, fetchedCategories] =
        await Promise.all([
          menuService.getAllMenuItems(),
          menuService.getAllToppings().catch(() => [] as MenuItem[]),
          categoryService.getAllCategories().catch(() => [] as Category[]),
        ]);
      setItems(fetchedItems);
      setToppings(fetchedToppings);
      setCategories(fetchedCategories);
    } catch (err: unknown) {
      const message =
        err instanceof Error
          ? err.message
          : "Không thể tải danh sách thực đơn từ máy chủ.";
      setError(message);
      toast.error(message);
    } finally {
      if (!silent) setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    let isMounted = true;

    Promise.all([
      menuService.getAllMenuItems(),
      menuService.getAllToppings().catch(() => [] as MenuItem[]),
      categoryService.getAllCategories().catch(() => [] as Category[]),
    ])
      .then(([fetchedItems, fetchedToppings, fetchedCategories]) => {
        if (!isMounted) return;
        setItems(fetchedItems);
        setToppings(fetchedToppings);
        setCategories(fetchedCategories);
        setIsLoading(false);
      })
      .catch((err: unknown) => {
        if (!isMounted) return;
        const message =
          err instanceof Error
            ? err.message
            : "Không thể tải danh sách thực đơn.";
        setError(message);
        toast.error(message);
        setIsLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const isToppingView = currentView === "topping";
  const availableCategories = categories.filter((c) => c.isAvailable !== false);
  const categoryTabs = ["Tất cả", ...availableCategories.map((c) => c.name)];
  const displayData = isToppingView ? toppings : items;

  const filteredItems = displayData.filter((item) => {
    const matchesCategory =
      isToppingView ||
      activeCategory === "Tất cả" ||
      item.category === activeCategory;
    const matchesSearch =
      matchesSearchTerm(item.name, searchQuery) ||
      matchesSearchTerm(item.category, searchQuery);
    return matchesCategory && matchesSearch;
  });

  // Lưu món mới hoặc cập nhật món
  const handleSaveItem = async (savedData: {
    name: string;
    price: number;
    category: string;
    image: string;
    description?: string;
  }) => {
    try {
      if (isToppingView) {
        if (itemToEdit) {
          await menuService.updateTopping(itemToEdit.id, {
            name: savedData.name,
            price: savedData.price,
            imageUrl: savedData.image,
            isAvailable: true,
          });
          toast.success("Cập nhật topping thành công!");
        } else {
          await menuService.createTopping({
            name: savedData.name,
            price: savedData.price,
            imageUrl: savedData.image,
            isAvailable: true,
          });
          toast.success("Thêm topping mới thành công!");
        }
      } else {
        if (itemToEdit) {
          await menuService.updateMenuItem(itemToEdit.id, {
            name: savedData.name,
            price: savedData.price,
            category: savedData.category,
            imageUrl: savedData.image,
            description: savedData.description,
          });
          toast.success("Cập nhật món thành công!");
        } else {
          await menuService.createMenuItem({
            name: savedData.name,
            price: savedData.price,
            category: savedData.category,
            imageUrl: savedData.image,
            description: savedData.description,
          });
          toast.success("Thêm món mới thành công!");
        }
      }

      await loadMenuData(true);
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Thao tác không thành công.";
      toast.error(message);
      throw err;
    }
  };

  // Xác nhận xóa món
  const handleConfirmDelete = async () => {
    if (!itemToDelete) return;
    setIsDeleting(true);
    try {
      if (isToppingView) {
        await menuService.deleteTopping(itemToDelete.id);
        toast.success(`Đã xóa topping "${itemToDelete.name}"!`);
      } else {
        await menuService.deleteMenuItem(itemToDelete.id);
        toast.success(`Đã xóa món "${itemToDelete.name}"!`);
      }
      setItemToDelete(null);
      await loadMenuData(true);
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Lỗi khi xóa mục đã chọn.";
      toast.error(message);
    } finally {
      setIsDeleting(false);
    }
  };

  // Thêm danh mục mới qua API
  const handleAddCategory = async (name: string) => {
    const trimmed = name.trim();
    const isDuplicate = categories.some(
      (c) => c.name.trim().toLowerCase() === trimmed.toLowerCase(),
    );
    if (isDuplicate) {
      toast.error(`Danh mục "${trimmed}" đã tồn tại!`);
      throw new Error(`Danh mục "${trimmed}" đã tồn tại!`);
    }

    try {
      await categoryService.createCategory({ name: trimmed });
      toast.success(`Đã thêm danh mục "${trimmed}"`);
      await loadMenuData(true);
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Không thể thêm danh mục.";
      toast.error(message);
      throw err;
    }
  };

  // Sửa tên danh mục qua API (Enter để lưu)
  const handleUpdateCategory = async (id: number, name: string) => {
    const trimmed = name.trim();
    const isDuplicate = categories.some(
      (c) =>
        c.id !== id && c.name.trim().toLowerCase() === trimmed.toLowerCase(),
    );
    if (isDuplicate) {
      toast.error(`Danh mục "${trimmed}" đã tồn tại!`);
      throw new Error(`Danh mục "${trimmed}" đã tồn tại!`);
    }

    try {
      await categoryService.updateCategory(id, { name: trimmed });
      toast.success("Cập nhật danh mục thành công!");
      await loadMenuData(true);
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Không thể cập nhật danh mục.";
      toast.error(message);
      throw err;
    }
  };

  // Xóa danh mục qua API (ngừng bán)
  const handleDeleteCategory = async (id: number) => {
    try {
      await categoryService.deleteCategory(id);
      toast.success("Đã ngừng bán danh mục!");
      await loadMenuData(true);
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Không thể xóa danh mục.";
      toast.error(message);
      throw err;
    }
  };

  // Mở bán lại danh mục qua API
  const handleToggleCategoryStatus = async (
    id: number,
    isAvailable: boolean,
  ) => {
    try {
      await categoryService.updateCategory(id, { isAvailable });
      toast.success(
        isAvailable ? "Đã mở bán lại danh mục!" : "Đã ngừng bán danh mục!",
      );
      await loadMenuData(true);
    } catch (err: unknown) {
      const message =
        err instanceof Error
          ? err.message
          : "Cập nhật trạng thái danh mục thất bại.";
      toast.error(message);
      throw err;
    }
  };

  return (
    <div className="flex flex-col h-full space-y-6">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground mb-1">
            {isToppingView ? "Quản lý topping" : "Quản lý thực đơn"}
          </h1>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {isToppingView ? (
            <button
              onClick={() => {
                setCurrentView("menu");
                setSearchQuery("");
                setActiveCategory("Tất cả");
              }}
              className="flex items-center gap-2 px-4 py-2 bg-background border border-border rounded-[var(--radius-control)] text-sm font-medium text-muted hover:text-foreground hover:bg-cream-100 transition-colors cursor-pointer"
            >
              <ArrowLeft size={16} />
              Quay lại thực đơn
            </button>
          ) : (
            <>
              <button
                onClick={() => setIsCategoryModalOpen(true)}
                className="flex items-center gap-2 px-4 py-2 bg-background border border-border rounded-[var(--radius-control)] text-sm font-medium text-muted hover:text-foreground hover:bg-cream-100 transition-colors cursor-pointer"
              >
                <Folder size={16} />
                Quản lý danh mục
              </button>
              <button
                onClick={() => {
                  setCurrentView("topping");
                  setSearchQuery("");
                }}
                className="flex items-center gap-2 px-4 py-2 bg-background border border-border rounded-[var(--radius-control)] text-sm font-medium text-muted hover:text-foreground hover:bg-cream-100 transition-colors cursor-pointer"
              >
                <Layers size={16} />
                Quản lý topping
              </button>
            </>
          )}

          <button
            onClick={() => {
              setItemToEdit(null);
              setIsAddModalOpen(true);
            }}
            className="flex items-center gap-2 px-5 py-2 bg-primary text-accent rounded-[var(--radius-control)] text-sm font-bold hover:bg-primary-hover transition-colors shadow-soft cursor-pointer"
          >
            <Plus size={18} />
            {isToppingView ? "Thêm topping" : "Thêm món"}
          </button>
        </div>
      </div>

      {/* Thông báo lỗi khi gọi API thất bại */}
      {error && !isLoading && (
        <div className="bg-red-50 border border-red-200 text-danger rounded-[var(--radius-card)] p-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <AlertCircle size={20} className="shrink-0" />
            <span className="text-sm font-medium">{error}</span>
          </div>
          <button
            onClick={() => loadMenuData()}
            className="px-3 py-1.5 text-xs font-bold bg-danger text-white rounded-[var(--radius-control)] hover:opacity-90 transition-opacity shrink-0 cursor-pointer"
          >
            Thử lại
          </button>
        </div>
      )}

      {/* Search and Filters */}
      <div className="space-y-4">
        <div className="relative max-w-lg">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-muted">
            <Search size={18} />
          </div>
          <input
            type="text"
            placeholder={
              isToppingView
                ? "Tìm kiếm tên topping..."
                : "Tìm kiếm tên món ăn, danh mục..."
            }
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-background border border-border rounded-[var(--radius-control)] focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm text-foreground placeholder:text-muted"
          />
        </div>

        {!isToppingView && (
          <div className="flex items-center gap-2 flex-wrap">
            {categoryTabs.map((category) => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`px-4 py-1.5 rounded-[var(--radius-control)] text-sm font-medium transition-all cursor-pointer ${
                  activeCategory === category
                    ? "bg-primary text-accent border border-primary shadow-xs"
                    : "bg-background text-muted hover:text-foreground hover:bg-cream-100 border border-border"
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Item Grid & States */}
      {isLoading ? (
        /* Trạng thái Loading: Skeleton Grid */
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {Array.from({ length: 10 }).map((_, i) => (
            <div
              key={i}
              className="bg-surface rounded-[var(--radius-card)] p-4 border border-border/60 animate-pulse space-y-3"
            >
              <div className="bg-cream-200/70 aspect-square rounded-[var(--radius-control)] w-full" />
              <div className="h-4 bg-cream-200/80 rounded w-3/4" />
              <div className="h-3 bg-cream-200/50 rounded w-1/2" />
              <div className="flex justify-between items-center pt-2">
                <div className="h-5 bg-cream-200/80 rounded w-1/3" />
                <div className="h-7 w-14 bg-cream-200/60 rounded" />
              </div>
            </div>
          ))}
        </div>
      ) : filteredItems.length > 0 ? (
        /* Trạng thái có dữ liệu */
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {filteredItems.map((item) => (
            <MenuItemCard
              key={item.id}
              item={item}
              showActions={true}
              onEdit={(editedItem) => {
                setItemToEdit(editedItem);
                setIsAddModalOpen(true);
              }}
              onDelete={(deletedItem) => {
                setItemToDelete(deletedItem);
              }}
            />
          ))}
        </div>
      ) : (
        /* Trạng thái Empty */
        <div className="bg-surface border border-dashed border-border rounded-[var(--radius-card)] py-16 px-6 text-center flex flex-col items-center justify-center">
          <div className="w-16 h-16 rounded-full bg-cream-100 flex items-center justify-center text-muted mb-4">
            <Search size={28} />
          </div>
          <h3 className="text-lg font-bold text-foreground mb-1">
            Không tìm thấy {isToppingView ? "topping" : "món nước"} nào
          </h3>
          <p className="text-sm text-muted max-w-sm mb-6">
            {searchQuery
              ? `Không có kết quả nào phù hợp với từ khóa "${searchQuery}". Hãy thử tìm kiếm từ khóa khác.`
              : `Chưa có dữ liệu ${isToppingView ? "topping" : "món"} nào trong danh mục này. Hãy thêm mới ngay.`}
          </p>
          <button
            onClick={() => {
              setItemToEdit(null);
              setIsAddModalOpen(true);
            }}
            className="flex items-center gap-2 px-4 py-2 bg-primary text-accent rounded-[var(--radius-control)] text-sm font-bold hover:bg-primary-hover transition-colors shadow-soft cursor-pointer"
          >
            <Plus size={16} />
            {isToppingView ? "Thêm topping ngay" : "Thêm món ngay"}
          </button>
        </div>
      )}

      {/* Modal Thêm/sửa món */}
      {isAddModalOpen && (
        <AddMenuItemModal
          key={itemToEdit?.id ?? "create"}
          isOpen={isAddModalOpen}
          onClose={() => {
            setIsAddModalOpen(false);
            setItemToEdit(null);
          }}
          onSave={handleSaveItem}
          mode={currentView}
          categories={availableCategories.map((c) => c.name)}
          itemToEdit={itemToEdit}
        />
      )}

      {/* Modal Quản lý danh mục */}
      <CategoryManagerModal
        isOpen={isCategoryModalOpen}
        onClose={() => setIsCategoryModalOpen(false)}
        categories={categories}
        onAdd={handleAddCategory}
        onUpdate={handleUpdateCategory}
        onDelete={handleDeleteCategory}
        onToggleStatus={handleToggleCategoryStatus}
      />

      {/* Modal Xác nhận Xóa */}
      {itemToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4 animate-in fade-in duration-200">
          <div className="bg-surface rounded-[var(--radius-card)] shadow-elevated w-full max-w-md p-6 space-y-4">
            <div className="flex items-center gap-3 text-danger">
              <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center shrink-0">
                <Trash2 size={20} />
              </div>
              <div>
                <h3 className="text-lg font-bold text-foreground">
                  Xác nhận xóa
                </h3>
                <p className="text-xs text-muted">
                  Hành động này không thể hoàn tác
                </p>
              </div>
            </div>

            <p className="text-sm text-foreground">
              Bạn có chắc chắn muốn xóa {isToppingView ? "topping" : "món nước"}{" "}
              <strong className="text-primary font-bold">
                &quot;{itemToDelete.name}&quot;
              </strong>{" "}
              khỏi hệ thống?
            </p>

            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setItemToDelete(null)}
                disabled={isDeleting}
                className="px-4 py-2 bg-background border border-border text-foreground text-sm font-semibold rounded-[var(--radius-control)] hover:bg-cream-100 transition-colors cursor-pointer disabled:opacity-50"
              >
                Hủy bỏ
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                disabled={isDeleting}
                className="px-4 py-2 bg-danger text-white text-sm font-bold rounded-[var(--radius-control)] hover:opacity-90 transition-opacity shadow-soft cursor-pointer disabled:opacity-50 flex items-center gap-2"
              >
                {isDeleting ? "Đang xóa..." : "Xóa"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
