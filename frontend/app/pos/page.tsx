"use client";

import React, { useCallback, useEffect, useRef, useState } from 'react';
import { toast } from 'sonner';
import { CartItem, Product, SelectedTopping, Topping } from '@/types/pos';
import { posService } from '@/services/posService';
import { CreateInvoiceRequest, InvoiceResponse, PaymentMethodEnum } from '@/types/invoiceApi';
import ProductList from '@/components/pos/ProductList';
import Cart from '@/components/pos/Cart';
import ToppingModal from '@/components/pos/ToppingModal';
import PaymentSuccessModal from '@/components/pos/PaymentSuccessModal';
import BillPreviewModal, { BillDetailData } from '@/components/pos/BillPreviewModal';
import { useCart } from '@/contexts/CartContext';

const ALL_CATEGORY = 'Tất cả';

function mapPaymentMethodToBackend(method: string): PaymentMethodEnum {
  const normalized = method.toLowerCase();
  if (normalized.includes('chuyển khoản') || normalized.includes('qr') || normalized.includes('transfer')) {
    return 'TRANSFER';
  }
  return 'CASH';
}

function mapPaymentMethodFromBackend(method: PaymentMethodEnum | string): string {
  switch (method) {
    case 'TRANSFER':
      return 'Chuyển khoản (QR Code)';
    case 'CASH':
    default:
      return 'Tiền mặt';
  }
}

export default function PosPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<string[]>([ALL_CATEGORY]);
  const [toppings, setToppings] = useState<Topping[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>(ALL_CATEGORY);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Modal states
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [isBillPreviewOpen, setIsBillPreviewOpen] = useState(false);
  const [isToppingModalOpen, setIsToppingModalOpen] = useState(false);
  const [selectedProductForModal, setSelectedProductForModal] = useState<Product | null>(null);
  const [targetCartItemId, setTargetCartItemId] = useState<string | null>(null);

  // Dữ liệu hóa đơn trả về từ API POST /api/invoices
  const [invoiceResult, setInvoiceResult] = useState<InvoiceResponse | null>(null);
  const [billPreviewData, setBillPreviewData] = useState<BillDetailData | null>(null);

  const searchInputRef = useRef<HTMLInputElement>(null);

  const {
    addToCart,
    addToCartItemToppings,
    clearCart,
    cartItems,
    paymentMethod,
  } = useCart();

  /**
   * Gọi duy nhất 1 API GET /api/pos/menu tối ưu từ PosMenuController
   * Lấy Categories, Products và Toppings đồng thời hỗ trợ search & filter
   */
  useEffect(() => {
    let isActive = true;

    async function loadPosMenu() {
      setIsLoading(true);
      setError(null);

      try {
        const data = await posService.getPosMenu({
          search: searchQuery,
          category: selectedCategory,
        });

        if (isActive) {
          setProducts(data.products);
          setCategories(data.categories);
          setToppings(data.toppings);
        }
      } catch (err) {
        if (isActive) {
          const message =
            err instanceof Error ? err.message : 'Không thể tải dữ liệu POS.';
          setError(message);
          toast.error(message);
        }
      } finally {
        if (isActive) setIsLoading(false);
      }
    }

    const timeoutId = window.setTimeout(loadPosMenu, 250);

    return () => {
      isActive = false;
      window.clearTimeout(timeoutId);
    };
  }, [searchQuery, selectedCategory]);

  /**
   * Flow Thanh toán:
   * 1. Kiểm tra giỏ hàng
   * 2. Gọi API POST /api/invoices lưu vào cơ sở dữ liệu
   * 3. Lấy thẳng InvoiceResponse trả về truyền vào PaymentSuccessModal & BillPreviewModal
   */
  const handleCheckout = useCallback(async () => {
    if (cartItems.length === 0) {
      toast.error('Đơn hàng hiện chưa có món nào!');
      return;
    }

    setIsSubmitting(true);

    try {
      // Chuẩn bị payload gửi lên POST /api/invoices
      const payload: CreateInvoiceRequest = {
        paymentMethod: mapPaymentMethodToBackend(paymentMethod),
        items: cartItems.map((item) => ({
          productId: Number(item.product.id),
          quantity: item.quantity,
          toppings: item.toppings.map((t) => ({
            toppingId: Number(t.id),
            quantity: t.quantity,
          })),
        })),
      };

      // Gửi POST tới backend
      const createdInvoice = await posService.createInvoice(payload);

      // Lưu kết quả hóa đơn trả về từ backend
      setInvoiceResult(createdInvoice);

      // Chuyển đổi dữ liệu từ backend sang format chuẩn của BillDetailData
      const totalAmount = Number(createdInvoice.totalAmount);
      const subtotalAmount = Math.round(totalAmount / 1.1);
      const vatAmount = totalAmount - subtotalAmount;

      const billData: BillDetailData = {
        invoiceCode: `#${createdInvoice.invoiceId}`,
        staffName: createdInvoice.staffName || 'Nhân viên',
        customerName: 'Khách vãng lai',
        paymentMethod: mapPaymentMethodFromBackend(createdInvoice.paymentMethod),
        createdAt: createdInvoice.createdAt,
        total: totalAmount,
        subtotal: subtotalAmount,
        vat: vatAmount,
        items: createdInvoice.items.map((item, idx) => ({
          id: `inv-item-${idx}`,
          quantity: item.quantity,
          product: {
            id: item.productId,
            name: item.productName,
            price: Number(item.unitPrice),
            category: 'Món',
          },
          toppings: (item.toppings || []).map((t, tIdx) => ({
            id: `inv-top-${tIdx}`,
            name: t.toppingName,
            price: Number(t.unitPrice),
            quantity: t.quantity,
          })),
        })),
      };

      setBillPreviewData(billData);

      // Mở modal thông báo thành công
      setIsPaymentModalOpen(true);
      toast.success(`Tạo hóa đơn #${createdInvoice.invoiceId} thành công!`);

      // Xóa giỏ hàng sau khi đã lưu đơn thành công
      clearCart();
    } catch (err) {
      const message =
        err instanceof Error ? err.message : 'Tạo hóa đơn thất bại, vui lòng thử lại!';
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  }, [cartItems, clearCart, paymentMethod]);

  // Phím tắt bàn phím F1, F12, Escape
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
        if (isToppingModalOpen) {
          setIsToppingModalOpen(false);
          setSelectedProductForModal(null);
          setTargetCartItemId(null);
        } else if (isBillPreviewOpen) {
          setIsBillPreviewOpen(false);
        } else if (isPaymentModalOpen) {
          setIsPaymentModalOpen(false);
        } else if (cartItems.length > 0) {
          clearCart();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [
    cartItems.length,
    clearCart,
    handleCheckout,
    isBillPreviewOpen,
    isPaymentModalOpen,
    isToppingModalOpen,
  ]);

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
          isLoading={isLoading}
          error={error}
        />
      </div>

      <div className="w-[360px] xl:w-[390px] shrink-0 h-full">
        <Cart
          onOpenToppingModalForCartItem={handleOpenToppingModalForCartItem}
          onCheckout={handleCheckout}
        />
      </div>

      <ToppingModal
        isOpen={isToppingModalOpen}
        product={selectedProductForModal}
        toppings={toppings}
        isLoading={isLoading}
        error={error}
        onClose={() => {
          setIsToppingModalOpen(false);
          setSelectedProductForModal(null);
          setTargetCartItemId(null);
        }}
        onConfirm={handleConfirmTopping}
      />

      <PaymentSuccessModal
        isOpen={isPaymentModalOpen}
        invoiceId={invoiceResult?.invoiceId}
        total={Number(invoiceResult?.totalAmount || 0)}
        paymentMethod={
          invoiceResult
            ? mapPaymentMethodFromBackend(invoiceResult.paymentMethod)
            : paymentMethod
        }
        onClose={() => {
          setIsPaymentModalOpen(false);
          setInvoiceResult(null);
        }}
        onExportBill={() => {
          setIsPaymentModalOpen(false);
          setIsBillPreviewOpen(true);
        }}
      />

      <BillPreviewModal
        isOpen={isBillPreviewOpen}
        billData={billPreviewData}
        onClose={() => {
          setIsBillPreviewOpen(false);
          setBillPreviewData(null);
          setInvoiceResult(null);
        }}
      />
    </div>
  );
}
