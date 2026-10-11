"use client";

import React, { useState, useEffect, useRef } from 'react';
import { toast } from 'sonner';
import { Product, SelectedTopping, CartItem } from '@/types/pos';
import { CATEGORIES, INITIAL_PRODUCTS } from '@/data/mockProducts';
import ProductList from '@/components/pos/ProductList';
import Cart from '@/components/pos/Cart';
import ToppingModal from '@/components/pos/ToppingModal';
import { useCart } from '@/contexts/CartContext';

export default function PosPage() {
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const [selectedCategory, setSelectedCategory] = useState<string>('Tất cả');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Quản lý Modal Topping
  const [isToppingModalOpen, setIsToppingModalOpen] = useState(false);
  const [selectedProductForModal, setSelectedProductForModal] = useState<Product | null>(null);
  // Nếu modal được mở từ 1 item đã có trong giỏ hàng:
  const [targetCartItemId, setTargetCartItemId] = useState<string | null>(null);

  const { addToCart, addToCartItemToppings, checkout, clearCart, cartItems } = useCart();

  // Thử fetch dữ liệu món từ API backend /api/menu nếu server Spring Boot đang chạy
  useEffect(() => {
    async function fetchMenu() {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';
        const res = await fetch(`${apiUrl}/api/menu`);
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data) && data.length > 0) {
            const mapped = data.map((item: any) => ({
              id: item.id,
              name: item.name,
              price: Number(item.price),
              category: item.category || 'Khác',
              imageUrl: item.imageUrl || '/images/products/bc-xu-1779541523944.png',
              description: item.description,
            }));
            setProducts(mapped);
          }
        }
      } catch {
        // Giữ INITIAL_PRODUCTS khi backend chưa bật
      }
    }
    fetchMenu();
  }, []);

  // Lắng nghe phím tắt bàn phím (F1: Focus Search, F12: Thanh toán, Esc: Xóa giỏ hàng / đóng modal)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'F1') {
        e.preventDefault();
        searchInputRef.current?.focus();
        toast.info('Đã bật tìm kiếm / chọn món');
      } else if (e.key === 'F12') {
        e.preventDefault();
        checkout();
      } else if (e.key === 'Escape') {
        e.preventDefault();
        if (isToppingModalOpen) {
          setIsToppingModalOpen(false);
          setSelectedProductForModal(null);
          setTargetCartItemId(null);
        } else if (cartItems.length > 0) {
          clearCart();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [cartItems, isToppingModalOpen, checkout, clearCart]);

  // Lọc sản phẩm theo danh mục và từ khóa tìm kiếm
  const filteredProducts = products.filter((p) => {
    const matchesCategory =
      selectedCategory === 'Tất cả' ||
      p.category.toLowerCase() === selectedCategory.toLowerCase();
    const matchesSearch =
      searchQuery.trim() === '' ||
      p.name.toLowerCase().includes(searchQuery.toLowerCase().trim()) ||
      p.category.toLowerCase().includes(searchQuery.toLowerCase().trim());
    return matchesCategory && matchesSearch;
  });

  // Khi click vào 1 món ăn trên danh sách bên trái: Mở ToppingModal để chọn topping trước khi thêm vào giỏ
  const handleProductClick = (product: Product) => {
    setTargetCartItemId(null);
    setSelectedProductForModal(product);
    setIsToppingModalOpen(true);
  };

  // Khi bấm nút "+ Thêm topping" trên 1 món trong giỏ hàng: Mở ToppingModal cho món đó
  const handleOpenToppingModalForCartItem = (cartItem: CartItem) => {
    setTargetCartItemId(cartItem.id);
    setSelectedProductForModal(cartItem.product);
    setIsToppingModalOpen(true);
  };

  // Xác nhận từ Modal Topping
  const handleConfirmTopping = (
    product: Product,
    toppings: SelectedTopping[]
  ) => {
    if (targetCartItemId) {
      // Đang thêm topping cho 1 món đã có trong giỏ hàng
      addToCartItemToppings(targetCartItemId, toppings);
    } else {
      // Thêm mới món vào giỏ hàng kèm topping
      addToCart(product, toppings);
    }
    setTargetCartItemId(null);
    setSelectedProductForModal(null);
  };

  return (
    <div className="flex h-full w-full gap-5 p-5 bg-background overflow-hidden">
      {/* Cột trái: Danh sách món ăn có thanh search */}
      <div className="flex-1 min-w-0 h-full flex flex-col">
        <ProductList
          products={filteredProducts}
          categories={CATEGORIES}
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          onProductClick={handleProductClick}
          searchInputRef={searchInputRef}
        />
      </div>

      {/* Cột phải: Giỏ hàng */}
      <div className="w-[360px] xl:w-[390px] shrink-0 h-full">
        <Cart onOpenToppingModalForCartItem={handleOpenToppingModalForCartItem} />
      </div>

      {/* Modal Thêm Topping duy nhất cho cả click món và bấm Thêm topping ở giỏ hàng */}
      <ToppingModal
        isOpen={isToppingModalOpen}
        product={selectedProductForModal}
        onClose={() => {
          setIsToppingModalOpen(false);
          setSelectedProductForModal(null);
          setTargetCartItemId(null);
        }}
        onConfirm={handleConfirmTopping}
      />
    </div>
  );
}
