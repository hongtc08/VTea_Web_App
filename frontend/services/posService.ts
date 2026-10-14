import { apiFetch } from '@/lib/api';
import { Product, Topping } from '@/types/pos';
import {
  CategoryResponseDto,
  PosProductResponseDto,
  ToppingResponseDto,
} from '@/types/menu';

export interface PosProductQuery {
  search?: string;
  category?: string;
  categoryId?: number;
}

function buildProductQuery(params: PosProductQuery = {}): string {
  const query = new URLSearchParams();
  const search = params.search?.trim();
  const category = params.category?.trim();

  if (search) query.set('search', search);
  if (params.categoryId) query.set('categoryId', String(params.categoryId));
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
    category: dto.categoryName || 'Khac',
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
  async getProducts(params: PosProductQuery = {}): Promise<Product[]> {
    const data = await apiFetch<PosProductResponseDto[]>(
      `/api/products${buildProductQuery(params)}`
    );
    return Array.isArray(data) ? data.map(mapPosProductResponseToUI) : [];
  },

  async getCategories(): Promise<string[]> {
    const data = await apiFetch<CategoryResponseDto[]>('/api/categories');
    const availableNames = Array.isArray(data)
      ? data
          .filter((category) => category.isAvailable !== false)
          .map((category) => category.name)
          .filter(Boolean)
      : [];

    return ['Tất cả', ...availableNames];
  },

  async getToppings(): Promise<Topping[]> {
    const data = await apiFetch<ToppingResponseDto[]>('/api/toppings');
    return Array.isArray(data)
      ? data
          .filter((topping) => topping.isAvailable !== false)
          .map(mapToppingResponseToPos)
      : [];
  },
};
