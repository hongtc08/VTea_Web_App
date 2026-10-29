import { apiFetch } from '@/lib/api';
import { Product, Topping } from '@/types/pos';
import {
  CategoryResponseDto,
  PosProductResponseDto,
  ToppingResponseDto,
} from '@/types/menu';
import { CreateInvoiceRequest, InvoiceResponse } from '@/types/invoiceApi';

export interface PosProductQuery {
  search?: string;
  category?: string;
  categoryId?: number;
}

export interface PosMenuData {
  categories: string[];
  products: Product[];
  toppings: Topping[];
}

interface PosMenuResponseDto {
  categories: CategoryResponseDto[];
  products: PosProductResponseDto[];
  toppings: ToppingResponseDto[];
}

function buildPosMenuQuery(params: PosProductQuery = {}): string {
  const query = new URLSearchParams();
  const search = params.search?.trim();
  const category = params.category?.trim();

  if (search) {
    query.set('search', search);
  }
  if (params.categoryId) {
    query.set('categoryId', String(params.categoryId));
  }
  if (category && category.toLowerCase() !== 'all' && category !== 'Tất cả') {
    query.set('category', category);
  }

  const value = query.toString();
  return value ? `?${value}` : '';
}

export function mapPosProductResponseToUI(dto: PosProductResponseDto): Product {
  return {
    id: dto.productId,
    name: dto.name,
    price: Number(dto.price),
    category: dto.categoryName || 'Khác',
    imageUrl: dto.imageUrl || '',
  };
}

export function mapToppingResponseToPos(dto: ToppingResponseDto): Topping {
  return {
    id: String(dto.toppingId),
    name: dto.name,
    price: Number(dto.price),
    imageUrl: dto.imageUrl || '',
    category: 'Topping',
  };
}

export const posService = {
  /**
   * Gọi duy nhất 1 API GET /api/pos/menu tối ưu từ PosMenuController.
   * Lấy trọn bộ Danh mục, Món nước và Topping (đã lọc món đang mở bán).
   */
  async getPosMenu(params: PosProductQuery = {}): Promise<PosMenuData> {
    const data = await apiFetch<PosMenuResponseDto>(
      `/api/pos/menu${buildPosMenuQuery(params)}`
    );

    const categories = Array.isArray(data?.categories)
      ? [
          'Tất cả',
          ...data.categories
            .filter((category) => category.isAvailable !== false)
            .map((category) => category.name)
            .filter(Boolean),
        ]
      : ['Tất cả'];

    const products = Array.isArray(data?.products)
      ? data.products.map(mapPosProductResponseToUI)
      : [];

    const toppings = Array.isArray(data?.toppings)
      ? data.toppings
          .filter((topping) => topping.isAvailable !== false)
          .map(mapToppingResponseToPos)
      : [];

    return { categories, products, toppings };
  },

  /**
   * API tạo hóa đơn và thanh toán: POST /api/invoices
   * Nhân viên tạo hóa đơn tự động trích xuất từ JWT token ở header.
   */
  async createInvoice(payload: CreateInvoiceRequest): Promise<InvoiceResponse> {
    return await apiFetch<InvoiceResponse>('/api/invoices', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },
};
