import { apiFetch } from '@/lib/api';
import {
  MenuItemResponseDto,
  CreateMenuItemRequestDto,
  UpdateMenuItemRequestDto,
  ToppingResponseDto,
  CreateToppingRequestDto,
  UpdateToppingRequestDto,
  MenuItem,
  ImageUploadResponseDto,
} from '@/types/menu';

/**
 * Chuyển từ MenuItemResponse DTO (be) sang MenuItem (fe)
 */
export function mapMenuItemResponseToUI(dto: MenuItemResponseDto): MenuItem {
  return {
    id: dto.id,
    name: dto.name,
    category: dto.category || 'Khác',
    price: Number(dto.price),
    image: dto.imageUrl || '',
    description: dto.description || '',
  };
}

/**
 * Chuyển từ ToppingResponse DTO (be) sang MenuItem (fe)
 */
export function mapToppingResponseToUI(dto: ToppingResponseDto): MenuItem {
  return {
    id: dto.toppingId,
    name: dto.name,
    category: 'Topping',
    price: Number(dto.price),
    image: dto.imageUrl || '',
  };
}

export const menuService = {
  /**
   * GET /api/menu
   */
  async getAllMenuItems(): Promise<MenuItem[]> {
    const data = await apiFetch<MenuItemResponseDto[]>('/api/menu');
    return Array.isArray(data) ? data.map(mapMenuItemResponseToUI) : [];
  },

  /**
   * GET /api/menu/{id}
   */
  async getMenuItemById(id: number | string): Promise<MenuItemResponseDto> {
    return apiFetch<MenuItemResponseDto>(`/api/menu/${id}`);
  },

  /**
   * POST /api/menu
   */
  async createMenuItem(data: CreateMenuItemRequestDto): Promise<MenuItem> {
    const payload: CreateMenuItemRequestDto = {
      name: data.name.trim(),
      description: data.description?.trim() || '',
      price: data.price,
      imageUrl: data.imageUrl || '',
      category: data.category.trim(),
    };

    const created = await apiFetch<MenuItemResponseDto>('/api/menu', {
      method: 'POST',
      body: JSON.stringify(payload),
    });

    return mapMenuItemResponseToUI(created);
  },

  /**
   * PUT /api/menu/{id}
   */
  async updateMenuItem(id: number | string, data: UpdateMenuItemRequestDto): Promise<MenuItem> {
    const payload: UpdateMenuItemRequestDto = {
      name: data.name?.trim(),
      description: data.description?.trim(),
      price: data.price,
      imageUrl: data.imageUrl,
      category: data.category?.trim(),
    };

    const updated = await apiFetch<MenuItemResponseDto>(`/api/menu/${id}`, {
      method: 'PUT',
      body: JSON.stringify(payload),
    });

    return mapMenuItemResponseToUI(updated);
  },

  /**
   * DELETE /api/menu/{id}
   */
  async deleteMenuItem(id: number | string): Promise<string> {
    return apiFetch<string>(`/api/menu/${id}`, {
      method: 'DELETE',
    });
  },

  /**
   * GET /api/toppings
   */
  async getAllToppings(): Promise<MenuItem[]> {
    const data = await apiFetch<ToppingResponseDto[]>('/api/toppings');
    return Array.isArray(data) ? data.map(mapToppingResponseToUI) : [];
  },

  /**
   * POST /api/toppings
   */
  async createTopping(data: CreateToppingRequestDto): Promise<MenuItem> {
    const created = await apiFetch<ToppingResponseDto>('/api/toppings', {
      method: 'POST',
      body: JSON.stringify(data),
    });
    return mapToppingResponseToUI(created);
  },

  /**
   * PUT /api/toppings/{id}
   */
  async updateTopping(id: number | string, data: UpdateToppingRequestDto): Promise<MenuItem> {
    const updated = await apiFetch<ToppingResponseDto>(`/api/toppings/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
    return mapToppingResponseToUI(updated);
  },

  /**
   * DELETE /api/toppings/{id}
   */
  async deleteTopping(id: number | string): Promise<string> {
    return apiFetch<string>(`/api/toppings/${id}`, {
      method: 'DELETE',
    });
  },

  /**
   * Tải ảnh lên images/products qua Next.js Route
   */
  async uploadImage(file: File, folder: 'products' | 'toppings' = 'products'): Promise<string> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('folder', folder);

    const response = await fetch('/api/upload', {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const err = await response.json().catch(() => ({ message: 'Lỗi tải ảnh lên server.' }));
      throw new Error(err.message || 'Lỗi khi upload hình ảnh.');
    }

    const data: ImageUploadResponseDto = await response.json();
    if (!data.success || !data.url) {
      throw new Error('Upload ảnh thất bại, không nhận được URL kết quả.');
    }

    return data.url;
  },
};
