"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';
import { toast } from 'sonner';
import { Product, CartItem, Topping, SelectedTopping } from '@/types/pos';

interface CartContextType {
  cartItems: CartItem[];
  paymentMethod: string;
  setPaymentMethod: (method: string) => void;
  // Các action giỏ hàng
  addToCart: (product: Product, toppings?: SelectedTopping[]) => void;
  addToCartItemToppings: (cartItemId: string, newToppings: SelectedTopping[]) => void;
  updateQuantity: (cartItemId: string, delta: number) => void;
  removeItem: (cartItemId: string) => void;
  clearCart: () => void;
  // Quản lý topping trực tiếp trên dòng món
  updateToppingInCart: (cartItemId: string, topping: Topping, delta: number) => void;
  removeToppingFromCart: (cartItemId: string, toppingId: string) => void;
  // Thanh toán
  subtotal: number;
  vat: number;
  total: number;
  checkout: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [paymentMethod, setPaymentMethod] = useState<string>('Tiền mặt');

  // Load giỏ hàng từ localStorage nếu có
  useEffect(() => {
    try {
      const saved = localStorage.getItem('vtea_pos_cart');
      if (saved) {
        setCartItems(JSON.parse(saved));
      }
    } catch {
      // ignore
    }
  }, []);

  // Lưu giỏ hàng vào localStorage khi thay đổi
  useEffect(() => {
    try {
      localStorage.setItem('vtea_pos_cart', JSON.stringify(cartItems));
    } catch {
      // ignore
    }
  }, [cartItems]);

  // Thêm món vào giỏ
  const addToCart = (product: Product, toppings: SelectedTopping[] = []) => {
    setCartItems((prevItems) => {
      // Tạo chữ ký topping để kiểm tra trùng
      const toppingKey = toppings
        .map((t) => `${t.id}:${t.quantity}`)
        .sort()
        .join('|');

      const existingIndex = prevItems.findIndex((item) => {
        if (item.product.id !== product.id) return false;
        const itemToppingKey = item.toppings
          .map((t) => `${t.id}:${t.quantity}`)
          .sort()
          .join('|');
        return itemToppingKey === toppingKey;
      });

      if (existingIndex > -1) {
        const updated = [...prevItems];
        updated[existingIndex] = {
          ...updated[existingIndex],
          quantity: updated[existingIndex].quantity + 1,
        };
        return updated;
      }

      const newItem: CartItem = {
        id: `${product.id}-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
        product,
        quantity: 1,
        toppings,
      };
      return [...prevItems, newItem];
    });

    toast.success(`Đã thêm ${product.name} vào đơn hàng`);
  };

  // Bổ sung thêm topping vào 1 item đã có sẵn trong giỏ từ modal
  const addToCartItemToppings = (cartItemId: string, newToppings: SelectedTopping[]) => {
    if (newToppings.length === 0) return;

    setCartItems((prev) =>
      prev.map((item) => {
        if (item.id !== cartItemId) return item;

        let mergedToppings = [...item.toppings];

        newToppings.forEach((addedTop) => {
          const idx = mergedToppings.findIndex((t) => t.id === addedTop.id);
          if (idx > -1) {
            mergedToppings[idx] = {
              ...mergedToppings[idx],
              quantity: mergedToppings[idx].quantity + addedTop.quantity,
            };
          } else {
            mergedToppings.push(addedTop);
          }
        });

        return { ...item, toppings: mergedToppings };
      })
    );

    toast.success('Đã cập nhật topping cho món');
  };

  // Cập nhật số lượng của một dòng trong giỏ
  const updateQuantity = (cartItemId: string, delta: number) => {
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

  // Xóa 1 dòng món khỏi giỏ
  const removeItem = (cartItemId: string) => {
    setCartItems((prev) => prev.filter((item) => item.id !== cartItemId));
    toast.info('Đã xóa món khỏi đơn hàng');
  };

  // Xóa tất cả giỏ hàng
  const clearCart = () => {
    setCartItems([]);
    toast.info('Đã xóa toàn bộ đơn hàng');
  };

  // Tăng/giảm số lượng 1 topping trên dòng giỏ hàng
  const updateToppingInCart = (
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

  // Xóa bỏ 1 topping khỏi dòng giỏ hàng
  const removeToppingFromCart = (cartItemId: string, toppingId: string) => {
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

  // Tính tiền
  const subtotal = cartItems.reduce((sum, item) => {
    const toppingsTotal = item.toppings.reduce(
      (topSum, t) => topSum + t.price * t.quantity,
      0
    );
    return sum + (item.product.price + toppingsTotal) * item.quantity;
  }, 0);

  const vat = Math.round(subtotal * 0.1);
  const total = subtotal + vat;

  // Thanh toán
  const checkout = () => {
    if (cartItems.length === 0) {
      toast.error('Đơn hàng hiện chưa có món nào!');
      return;
    }

    toast.success(
      `Thanh toán thành công qua ${paymentMethod}! Tổng tiền: ${new Intl.NumberFormat('vi-VN').format(total)}đ`
    );
    setCartItems([]);
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        paymentMethod,
        setPaymentMethod,
        addToCart,
        addToCartItemToppings,
        updateQuantity,
        removeItem,
        clearCart,
        updateToppingInCart,
        removeToppingFromCart,
        subtotal,
        vat,
        total,
        checkout,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
