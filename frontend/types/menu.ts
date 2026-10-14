export interface MenuItemResponseDto {
  id: number;
  name: string;
  description?: string;
  price: number;
  imageUrl?: string;
  category: string;
}

export interface CreateMenuItemRequestDto {
  name: string;
  description?: string;
  price: number;
  imageUrl?: string;
  category: string;
}

export interface UpdateMenuItemRequestDto {
  name?: string;
  description?: string;
  price?: number;
  imageUrl?: string;
  category?: string;
}

export interface ToppingResponseDto {
  toppingId: number;
  name: string;
  price: number;
  imageUrl?: string;
  isAvailable?: boolean;
}

export interface PosProductResponseDto {
  productId: number;
  name: string;
  price: number;
  imageUrl?: string;
  categoryId?: number;
  categoryName?: string;
}

export interface CategoryResponseDto {
  categoryId: number;
  name: string;
  isAvailable?: boolean;
}

export interface CreateToppingRequestDto {
  name: string;
  price: number;
  imageUrl?: string;
  isAvailable?: boolean;
}

export interface UpdateToppingRequestDto {
  name?: string;
  price?: number;
  imageUrl?: string;
  isAvailable?: boolean;
}

/**
 * Model hiển thị cho Menu Item
 */
export interface MenuItem {
  id: number;
  name: string;
  category: string;
  price: number;
  image: string;
  description?: string;
}

/**
 * Model danh mục
 */
export interface Category {
  id: number;
  name: string;
  status: string;
}

/**
 * Response trả về từ API upload ảnh
 */
export interface ImageUploadResponseDto {
  url: string;
  fileName: string;
  success: boolean;
}
