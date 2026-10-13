"use client";

import React, { useEffect, useRef, useState } from 'react';
import { toast } from 'sonner';
import { CartItem, Product, SelectedTopping, Topping } from '@/types/pos';
import { posService } from '@/services/posService';
import ProductList from '@/components/pos/ProductList';
import Cart from '@/components/pos/Cart';
import ToppingModal from '@/components/pos/ToppingModal';
import { useCart } from '@/contexts/CartContext';

const ALL_CATEGORY = 'Tất cả';

export default function PosPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<string[]>([ALL_CATEGORY]);
  const [toppings, setToppings] = useState<Topping[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>(ALL_CATEGORY);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isProductsLoading, setIsProductsLoading] = useState(true);
  const [isToppingsLoading, setIsToppingsLoading] = useState(true);
  const [productsError, setProductsError] = useState<string | null>(null);
  const [toppingsError, setToppingsError] = useState<string | null>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const [isToppingModalOpen, setIsToppingModalOpen] = useState(false);
  const [selectedProductForModal, setSelectedProductForModal] = useState<Product | null>(null);
  const [targetCartItemId, setTargetCartItemId] = useState<string | null>(null);

  const { addToCart, addToCartItemToppings, checkout, clearCart, cartItems } = useCart();

  useEffect(() => {
    async function fetchCategoriesAndToppings() {
      try {
        const [categoryData, toppingData] = await Promise.all([
          posService.getCategories(),
          posService.getToppings(),
        ]);
        setCategories(categoryData);
        setToppings(toppingData);
        setToppingsError(null);
      } catch (error) {
        const message =
          error instanceof Error ? error.message : 'Không thể tải dữ liệu POS.';
        setToppingsError(message);
        toast.error(message);
      } finally {
        setIsToppingsLoading(false);
      }
    }

    fetchCategoriesAndToppings();
  }, []);

  useEffect(() => {
    let isActive = true;

    async function fetchProducts() {
      setIsProductsLoading(true);
      setProductsError(null);

      try {
        const data = await posService.getProducts({
          search: searchQuery,
          category: selectedCategory,
        });
        if (isActive) setProducts(data);
      } catch (error) {
        if (isActive) {
          const message =
            error instanceof Error ? error.message : 'Không thể tải danh sách món.';
          setProducts([]);
          setProductsError(message);
        }
      } finally {
        if (isActive) setIsProductsLoading(false);
      }
    }

    const timeoutId = window.setTimeout(fetchProducts, 250);

    return () => {
      isActive = false;
      window.clearTimeout(timeoutId);
    };
  }, [searchQuery, selectedCategory]);

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

  const handleProductClick = (product: Product) => {
    setTargetCartItemId(null);
    setSelectedProductForModal(product);
    setIsToppingModalOpen(true);
  };

  const handleOpenToppingModalForCartItem = (cartItem: CartItem) => {
    setTargetCartItemId(cartItem.id);
    setSelectedProductForModal(cartItem.product);
    setIsToppingModalOpen(true);
  };

  const handleConfirmTopping = (
    product: Product,
    selectedToppings: SelectedTopping[]
  ) => {
    if (targetCartItemId) {
      addToCartItemToppings(targetCartItemId, selectedToppings);
    } else {
      addToCart(product, selectedToppings);
    }
    setTargetCartItemId(null);
    setSelectedProductForModal(null);
  };

  return (
    <div className="flex h-full w-full gap-5 p-5 bg-background overflow-hidden">
      <div className="flex-1 min-w-0 h-full flex flex-col">
        <ProductList
          products={products}
          categories={categories}
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          onProductClick={handleProductClick}
          searchInputRef={searchInputRef}
          isLoading={isProductsLoading}
          error={productsError}
        />
      </div>

      <div className="w-[360px] xl:w-[390px] shrink-0 h-full">
        <Cart onOpenToppingModalForCartItem={handleOpenToppingModalForCartItem} />
      </div>

      <ToppingModal
        isOpen={isToppingModalOpen}
        product={selectedProductForModal}
        toppings={toppings}
        isLoading={isToppingsLoading}
        error={toppingsError}
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
