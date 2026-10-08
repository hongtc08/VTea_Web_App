"use client";

import React, { useState, useEffect, useRef } from 'react';
import { toast } from 'sonner';
import { Product, CartItem, Topping } from '@/types/pos';
import { CATEGORIES, INITIAL_PRODUCTS } from '@/data/mockProducts';
import ProductList from '@/components/pos/ProductList';
import Cart from '@/components/pos/Cart';

export default function PosPage() {
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const [selectedCategory, setSelectedCategory] = useState<string>('Tất cả');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [paymentMethod, setPaymentMethod] = useState<string>('Tiền mặt');
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Thử fetch dữ liệu sản phẩm từ API backend /api/menu nếu có
  useEffect(() => {
    async function fetchMenu() {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';
        const res = await fetch(`${apiUrl}/api/menu`);
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data) && data.length > 0) {
            // Map dữ liệu từ backend sang format Product
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
      } catch (err) {
        // Nếu backend chưa sẵn sàng, giữ INITIAL_PRODUCTS
        console.log('Using initial products for POS');
      }
    }
    fetchMenu();
  }, []);

  // Lắng nghe phím tắt bàn phím (F1: Focus Search, F12: Thanh toán, Esc: Xóa giỏ hàng)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'F1') {
        e.preventDefault();
        searchInputRef.current?.focus();
        toast.info('Đã bật tìm kiếm / chọn món');
      } else if (e.key === 'F12') {
        e.preventDefault();
        handleCheckout();
      } else if (e.key === 'Escape') {
        e.preventDefault();
        if (cartItems.length > 0) {
          handleClearCart();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [cartItems]);

  // Lọc sản phẩm theo danh mục và tìm kiếm
  const filteredProducts = products.filter((p) => {
    const matchesCategory =
      selectedCategory === 'Tất cả' || p.category.toLowerCase() === selectedCategory.toLowerCase();
    const matchesSearch =
      searchQuery.trim() === '' ||
      p.name.toLowerCase().includes(searchQuery.toLowerCase().trim()) ||
      p.category.toLowerCase().includes(searchQuery.toLowerCase().trim());
    return matchesCategory && matchesSearch;
  });

  // Thêm món vào giỏ
  const handleAddToCart = (product: Product) => {
    setCartItems((prevItems) => {
      // Tìm xem đã có món này chưa (chưa chọn topping)
      const existingIndex = prevItems.findIndex(
        (item) => item.product.id === product.id && item.toppings.length === 0
      );

      if (existingIndex > -1) {
        const updated = [...prevItems];
        updated[existingIndex] = {
          ...updated[existingIndex],
          quantity: updated[existingIndex].quantity + 1,
        };
        return updated;
      }

      const newItem: CartItem = {
        id: `${product.id}-${Date.now()}`,
        product,
        quantity: 1,
        toppings: [],
        isCustomizingTopping: false,
      };
      return [...prevItems, newItem];
    });

    toast.success(`Đã thêm ${product.name} vào đơn`);
  };

  // Cập nhật số lượng món
  const handleUpdateQuantity = (cartItemId: string, delta: number) => {
    setCartItems((prev) =>
      prev
        .map((item) => {
          if (item.id === cartItemId) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean) as CartItem[]
    );
  };

  // Xóa một món khỏi giỏ
  const handleRemoveItem = (cartItemId: string) => {
    setCartItems((prev) => prev.filter((item) => item.id !== cartItemId));
    toast.info('Đã xóa món khỏi đơn hàng');
  };

  // Xóa tất cả giỏ hàng
  const handleClearCart = () => {
    setCartItems([]);
    toast.info('Đã xóa toàn bộ đơn hàng');
  };

  // Mở / Đóng bảng thêm topping
  const handleToggleCustomizing = (cartItemId: string) => {
    setCartItems((prev) =>
      prev.map((item) =>
        item.id === cartItemId
          ? { ...item, isCustomizingTopping: !item.isCustomizingTopping }
          : item
      )
    );
  };

  // Cập nhật số lượng Topping cho 1 dòng món
  const handleUpdateTopping = (
    cartItemId: string,
    topping: Topping,
    delta: number
  ) => {
    setCartItems((prev) =>
      prev.map((item) => {
        if (item.id !== cartItemId) return item;

        const existingTopIndex = item.toppings.findIndex((t) => t.id === topping.id);
        let updatedToppings = [...item.toppings];

        if (existingTopIndex > -1) {
          const currentTop = updatedToppings[existingTopIndex];
          const newQty = currentTop.quantity + delta;
          if (newQty > 0) {
            updatedToppings[existingTopIndex] = { ...currentTop, quantity: newQty };
          } else {
            updatedToppings = updatedToppings.filter((t) => t.id !== topping.id);
          }
        } else if (delta > 0) {
          updatedToppings.push({
            id: topping.id,
            name: topping.name,
            price: topping.price,
            quantity: delta,
          });
        }

        return { ...item, toppings: updatedToppings };
      })
    );
  };

  // Xóa bỏ hoàn toàn 1 topping khỏi món
  const handleRemoveTopping = (cartItemId: string, toppingId: string) => {
    setCartItems((prev) =>
      prev.map((item) => {
        if (item.id !== cartItemId) return item;
        return {
          ...item,
          toppings: item.toppings.filter((t) => t.id !== toppingId),
        };
      })
    );
  };

  // Xử lý thanh toán
  const handleCheckout = () => {
    if (cartItems.length === 0) {
      toast.error('Đơn hàng hiện chưa có món nào!');
      return;
    }

    const subtotal = cartItems.reduce((sum, item) => {
      const topSum = item.toppings.reduce((s, t) => s + t.price * t.quantity, 0);
      return sum + (item.product.price + topSum) * item.quantity;
    }, 0);
    const total = subtotal + Math.round(subtotal * 0.1);

    toast.success(
      `Thanh toán thành công qua ${paymentMethod}! Tổng tiền: ${new Intl.NumberFormat('vi-VN').format(total)}đ`
    );
    setCartItems([]);
  };

  return (
    <div className="flex h-full w-full gap-5 p-5 bg-background overflow-hidden">
      {/* Cột trái: Danh sách món ăn & Search bar (Chiếm 62-65% chiều ngang) */}
      <div className="flex-1 min-w-0 h-full flex flex-col">
        <ProductList
          products={filteredProducts}
          categories={CATEGORIES}
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          onAddToCart={handleAddToCart}
          searchInputRef={searchInputRef}
        />
      </div>

      {/* Cột phải: Giỏ hàng & Thanh toán (Rộng cố định 360px - 400px) */}
      <div className="w-[360px] xl:w-[390px] shrink-0 h-full">
        <Cart
          items={cartItems}
          onUpdateQuantity={handleUpdateQuantity}
          onRemoveItem={handleRemoveItem}
          onClearCart={handleClearCart}
          onToggleCustomizing={handleToggleCustomizing}
          onUpdateTopping={handleUpdateTopping}
          onRemoveTopping={handleRemoveTopping}
          paymentMethod={paymentMethod}
          onPaymentMethodChange={setPaymentMethod}
          onCheckout={handleCheckout}
        />
      </div>
    </div>
  );
}
