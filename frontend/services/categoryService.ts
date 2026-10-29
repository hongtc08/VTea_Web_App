import { apiFetch } from '@/lib/api';
import {
  Category,
  CategoryResponseDto,
  CreateCategoryRequestDto,
  UpdateCategoryRequestDto,
} from '@/types/menu';

export const CATEGORY_STATUS_ACTIVE = 'Đang bán';
export const CATEGORY_STATUS_INACTIVE = 'Ngừng bán';

/**
 * Chuyển từ CategoryResponseDto (be) sang Category (fe UI)
 */
export function mapCategoryResponseToUI(dto: CategoryResponseDto): Category {
  const isAvailable = dto.isAvailable !== false;
  return {
    id: dto.categoryId,
    name: dto.name,
    status: isAvailable ? CATEGORY_STATUS_ACTIVE : CATEGORY_STATUS_INACTIVE,
    isAvailable,
  };
}

export const categoryService = {
  /**
   * Lấy toàn bộ danh mục từ database: GET /api/categories
   */
  async getAllCategories(): Promise<Category[]> {
    const data = await apiFetch<CategoryResponseDto[]>('/api/categories');
    return Array.isArray(data) ? data.map(mapCategoryResponseToUI) : [];
  },

  /**
   * Lấy danh mục đang mở bán: GET /api/categories/available
   */
  async getAvailableCategories(): Promise<Category[]> {
    const data = await apiFetch<CategoryResponseDto[]>('/api/categories/available');
    return Array.isArray(data) ? data.map(mapCategoryResponseToUI) : [];
  },

  /**
   * Lấy thông tin chi tiết danh mục theo ID: GET /api/categories/{id}
   */
  async getCategoryById(id: number | string): Promise<CategoryResponseDto> {
    return apiFetch<CategoryResponseDto>(`/api/categories/${id}`);
  },

  /**
   * Tạo mới danh mục: POST /api/categories
   */
  async createCategory(data: CreateCategoryRequestDto): Promise<Category> {
    const payload: CreateCategoryRequestDto = {
      name: data.name.trim(),
      isAvailable: data.isAvailable !== undefined ? data.isAvailable : true,
    };

    const created = await apiFetch<CategoryResponseDto>('/api/categories', {
      method: 'POST',
      body: JSON.stringify(payload),
    });

    return mapCategoryResponseToUI(created);
  },

  /**
   * Cập nhật danh mục: PUT /api/categories/{id}
   */
  async updateCategory(
    id: number | string,
    data: UpdateCategoryRequestDto
  ): Promise<Category> {
    const payload: UpdateCategoryRequestDto = {
      name: data.name?.trim(),
      isAvailable: data.isAvailable,
    };

    const updated = await apiFetch<CategoryResponseDto>(`/api/categories/${id}`, {
      method: 'PUT',
      body: JSON.stringify(payload),
    });

    return mapCategoryResponseToUI(updated);
  },

  /**
   * Xóa mềm danh mục (ngừng bán): DELETE /api/categories/{id}
   */
  async deleteCategory(id: number | string): Promise<string> {
    return apiFetch<string>(`/api/categories/${id}`, {
      method: 'DELETE',
    });
  },
};
