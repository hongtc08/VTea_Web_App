import { apiFetch } from '@/lib/api';
import { Category, CategoryResponseDto, CategoryRequestDto } from '@/types/menu';

export const CATEGORY_STATUS_ACTIVE = 'Đang bán';
export const CATEGORY_STATUS_INACTIVE = 'Ngưng bán';

/**
 * Chuyển từ CategoryResponse DTO (be) sang Category (fe)
 */
export function mapCategoryResponseToUI(dto: CategoryResponseDto): Category {
  return {
    id: dto.categoryId,
    name: dto.name,
    status: dto.isAvailable ? CATEGORY_STATUS_ACTIVE : CATEGORY_STATUS_INACTIVE,
  };
}

export const categoryService = {
  /**
   * GET /api/categories - Tất cả danh mục (kể cả đã ngưng bán)
   */
  async getAllCategories(): Promise<Category[]> {
    const data = await apiFetch<CategoryResponseDto[]>('/api/categories');
    return Array.isArray(data) ? data.map(mapCategoryResponseToUI) : [];
  },

  /**
   * GET /api/categories/available - Chỉ các danh mục đang bán
   */
  async getAvailableCategories(): Promise<Category[]> {
    const data = await apiFetch<CategoryResponseDto[]>('/api/categories/available');
    return Array.isArray(data) ? data.map(mapCategoryResponseToUI) : [];
  },

  /**
   * POST /api/categories
   */
  async createCategory(data: CategoryRequestDto): Promise<Category> {
    const created = await apiFetch<CategoryResponseDto>('/api/categories', {
      method: 'POST',
      body: JSON.stringify(data),
    });
    return mapCategoryResponseToUI(created);
  },

  /**
   * PUT /api/categories/{id}
   */
  async updateCategory(id: number | string, data: CategoryRequestDto): Promise<Category> {
    const updated = await apiFetch<CategoryResponseDto>(`/api/categories/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
    return mapCategoryResponseToUI(updated);
  },

  /**
   * DELETE /api/categories/{id} (soft delete)
   */
  async deleteCategory(id: number | string): Promise<string> {
    return apiFetch<string>(`/api/categories/${id}`, {
      method: 'DELETE',
    });
  },
};
