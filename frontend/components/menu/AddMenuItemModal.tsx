"use client";

import React, { useState, useRef } from "react";
import Image from "next/image";
import { X, ChevronDown, Upload, Trash2, Loader2 } from "lucide-react";
import { MenuItem } from "@/types/menu";
import { menuService } from "@/services/menuService";
import { toast } from "sonner";

interface AddMenuItemModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (item: {
    name: string;
    price: number;
    category: string;
    image: string;
    description?: string;
  }) => Promise<void> | void;
  mode?: "menu" | "topping";
  categories?: string[];
  itemToEdit?: MenuItem | null;
}

export default function AddMenuItemModal({
  isOpen,
  onClose,
  onSave,
  mode = "menu",
  categories = [],
  itemToEdit = null,
}: AddMenuItemModalProps) {
  const isTopping = mode === "topping";
  const isEdit = !!itemToEdit;

  // Khởi tạo state trực tiếp từ props khi modal được mount (được điều khiển qua key ở component cha)
  const [name, setName] = useState(() => itemToEdit?.name || "");
  const [price, setPrice] = useState(() =>
    itemToEdit ? new Intl.NumberFormat("vi-VN").format(itemToEdit.price) : ""
  );
  const [category, setCategory] = useState(() =>
    itemToEdit?.category || (categories.length > 0 ? categories[0] : "")
  );
  const [imageUrl, setImageUrl] = useState(() => itemToEdit?.image || "");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(() => itemToEdit?.image || null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawVal = e.target.value.replace(/[^0-9]/g, "");
    if (!rawVal) {
      setPrice("");
      return;
    }
    const num = parseInt(rawVal, 10);
    setPrice(new Intl.NumberFormat("vi-VN").format(num));
  };

  const processSelectedFile = (file: File) => {
    if (!file.type.startsWith("image/")) {
      toast.error("Vui lòng chọn file hình ảnh (JPG, PNG, WEBP).");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Kích thước file ảnh không được vượt quá 5MB.");
      return;
    }

    setImageFile(file);
    const objectUrl = URL.createObjectURL(file);
    setImagePreview(objectUrl);
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files[0]) {
      processSelectedFile(files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processSelectedFile(e.dataTransfer.files[0]);
    }
  };

  const handleRemoveImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setImageFile(null);
    setImagePreview(null);
    setImageUrl("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanName = name.trim();
    const cleanPrice = parseInt(price.replace(/[^0-9]/g, "") || "0", 10);

    if (!cleanName) {
      toast.warning("Vui lòng nhập tên món/topping.");
      return;
    }

    if (cleanPrice <= 0) {
      toast.warning("Vui lòng nhập giá hợp lệ lớn hơn 0đ.");
      return;
    }

    setIsSubmitting(true);
    try {
      let finalImageUrl = imageUrl;

      // Nếu người dùng chọn file ảnh mới, upload trước lên server Next.js (lưu vào public/images/products)
      if (imageFile) {
        toast.loading("Đang lưu hình ảnh vào hệ thống...", { id: "upload-toast" });
        const uploadedUrl = await menuService.uploadImage(
          imageFile,
          isTopping ? "toppings" : "products"
        );
        finalImageUrl = uploadedUrl;
        toast.success("Tải ảnh lên thành công!", { id: "upload-toast" });
      }

      await onSave({
        name: cleanName,
        category: isTopping ? "Topping" : category || "Khác",
        price: cleanPrice,
        image: finalImageUrl,
      });

      onClose();
    } catch {
      // Lỗi được thông báo ở service
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4 animate-in fade-in duration-200">
      <div className="bg-surface rounded-[var(--radius-card)] shadow-elevated w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="flex items-center justify-between p-6 pb-4 border-b border-border bg-surface">
          <div>
            <h2 className="text-xl font-bold text-foreground">
              {isEdit
                ? isTopping
                  ? "Chỉnh sửa topping"
                  : "Chỉnh sửa món ăn"
                : isTopping
                  ? "Thêm topping mới"
                  : "Thêm món mới vào thực đơn"}
            </h2>
            <p className="text-xs text-muted mt-0.5">
              {isEdit
                ? "Cập nhật thông tin chi tiết của sản phẩm"
                : "Điền đầy đủ các thông tin để hiển thị trên thực đơn"}
            </p>
          </div>
          <button
            onClick={onClose}
            disabled={isSubmitting}
            className="p-2 text-muted hover:bg-cream-100 hover:text-foreground rounded-full transition-colors disabled:opacity-50 cursor-pointer"
            aria-label="Đóng modal"
          >
            <X size={20} />
          </button>
        </div>

        {/* Modal Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5 overflow-y-auto flex-1">
          {/* Tên món / topping */}
          <div className="space-y-1.5">
            <label className="block text-sm font-semibold text-foreground">
              {isTopping ? "Tên topping" : "Tên món"} <span className="text-danger">*</span>
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={isTopping ? "Ví dụ: Trân châu hoàng kim" : "Ví dụ: Cà phê Muối"}
              disabled={isSubmitting}
              className="w-full px-3.5 py-2.5 rounded-[var(--radius-control)] border border-border focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm transition-all text-foreground bg-background placeholder:text-muted"
              required
            />
          </div>

          {/* Danh mục (hiển thị cho product) */}
          {!isTopping && (
            <div className="space-y-1.5">
              <label className="block text-sm font-semibold text-foreground">
                Danh mục <span className="text-danger">*</span>
              </label>
              <div className="relative">
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  disabled={isSubmitting}
                  className="w-full px-3.5 py-2.5 rounded-[var(--radius-control)] border border-border focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm transition-all text-foreground bg-background appearance-none cursor-pointer pr-10"
                >
                  <option value="" disabled>-- Chọn danh mục --</option>
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center px-3 pointer-events-none text-muted">
                  <ChevronDown size={18} />
                </div>
              </div>
            </div>
          )}

          {/* Giá bán */}
          <div className="space-y-1.5">
            <label className="block text-sm font-semibold text-foreground">
              Giá bán (VNĐ) <span className="text-danger">*</span>
            </label>
            <div className="relative">
              <input
                type="text"
                value={price}
                onChange={handlePriceChange}
                placeholder="45.000"
                disabled={isSubmitting}
                className="w-full px-3.5 py-2.5 rounded-[var(--radius-control)] border border-border focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm transition-all text-foreground bg-background placeholder:text-muted pr-10"
                required
              />
              <span className="absolute inset-y-0 right-0 flex items-center pr-3.5 text-xs font-bold text-muted pointer-events-none">
                VNĐ
              </span>
            </div>
          </div>


          {/* Upload ảnh */}
          <div className="space-y-1.5">
            <label className="block text-sm font-semibold text-foreground">
              {isTopping ? "Hình ảnh topping" : "Hình ảnh món"}
            </label>

            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileInputChange}
              accept="image/png,image/jpeg,image/webp,image/jpg"
              className="hidden"
            />

            {imagePreview ? (
              <div className="relative rounded-[var(--radius-card)] border border-border bg-cream-50 p-3 flex items-center gap-4 group">
                <div className="w-20 h-20 rounded-[var(--radius-control)] bg-cream-100 overflow-hidden relative flex items-center justify-center shrink-0 border border-border">
                  <Image
                    src={imagePreview}
                    alt="Xem trước hình ảnh"
                    fill
                    sizes="80px"
                    className="object-contain p-1"
                    unoptimized
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-foreground truncate">
                    {imageFile ? imageFile.name : imageUrl ? imageUrl.split("/").pop() : "Hình ảnh hiện tại"}
                  </p>
                  <p className="text-xs text-muted mt-0.5">
                    {imageFile
                      ? `${(imageFile.size / 1024).toFixed(1)} KB (Đã sẵn sàng tải lên)`
                      : "Ảnh đã lưu trong hệ thống"}
                  </p>
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isSubmitting}
                    className="text-xs font-semibold text-primary hover:underline mt-1.5 block cursor-pointer"
                  >
                    Thay đổi hình ảnh khác
                  </button>
                </div>
                <button
                  type="button"
                  onClick={handleRemoveImage}
                  disabled={isSubmitting}
                  className="p-2 text-muted hover:text-danger hover:bg-red-50 rounded-full transition-colors cursor-pointer"
                  title="Xóa ảnh"
                  aria-label="Xóa ảnh"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            ) : (
              <div
                onClick={() => !isSubmitting && fileInputRef.current?.click()}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                className={`border-2 border-dashed rounded-[var(--radius-card)] p-6 flex flex-col items-center justify-center text-center transition-all cursor-pointer ${isDragging
                  ? "border-primary bg-primary/5 scale-[0.99]"
                  : "border-border hover:border-primary/50 hover:bg-cream-50/50"
                  }`}
              >
                <div className="w-12 h-12 rounded-full bg-cream-100 flex items-center justify-center mb-3 text-muted group-hover:text-primary transition-colors">
                  <Upload size={22} />
                </div>
                <p className="font-semibold text-primary text-sm mb-1">
                  Nhấn để tải ảnh hoặc kéo thả vào đây
                </p>
                <p className="text-xs text-muted">
                  Hỗ trợ định dạng JPG, PNG, WEBP (Tối đa 5MB)
                </p>
              </div>
            )}
          </div>

          {/* Form Actions */}
          <div className="flex gap-3 pt-3 border-t border-border">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="flex-1 py-2.5 px-4 bg-background border border-border text-foreground text-sm font-semibold rounded-[var(--radius-control)] hover:bg-cream-100 transition-colors disabled:opacity-50 cursor-pointer"
            >
              Hủy bỏ
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 py-2.5 px-4 bg-primary text-accent text-sm font-bold rounded-[var(--radius-control)] hover:bg-primary-hover transition-colors shadow-soft disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer"
            >
              {isSubmitting ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  <span>Đang xử lý...</span>
                </>
              ) : (
                <span>{isEdit ? "Lưu thay đổi" : "Xác nhận thêm"}</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
