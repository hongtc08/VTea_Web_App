import { getStoredAuth, clearAuth } from '@/lib/auth';

export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

/**
 * Lấy Bearer Token từ hàm getStoredAuth() trong auth.ts (kèm fallback cookie nếu cần).
 */
export function getAuthToken(): string | null {
  const { token } = getStoredAuth();
  if (token) return token;

  if (typeof document !== 'undefined') {
    const match = document.cookie.match(/(?:^|;\s*)token=([^;]*)/);
    if (match) return decodeURIComponent(match[1]);
  }

  return null;
}

/**
 * Tạo Headers chứa Authorization Bearer Token từ token lưu trong auth.
 */
export function getAuthHeaders(headersInit?: HeadersInit): Headers {
  const headers = new Headers(headersInit);

  if (!headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json');
  }

  const token = getAuthToken();
  if (token && !headers.has('Authorization')) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  return headers;
}

/**
 * Hàm tiện ích gọi API chung cho toàn bộ ứng dụng.
 * Tự động gắn kèm Authorization Bearer token từ auth util và xử lý lỗi phản hồi.
 */
export async function apiFetch<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = endpoint.startsWith('http') ? endpoint : `${API_BASE_URL}${endpoint}`;

  const response = await fetch(url, {
    ...options,
    headers: getAuthHeaders(options.headers),
  });

  if (!response.ok) {
    if (response.status === 401) {
      clearAuth();
      throw new Error('Phiên đăng nhập đã hết hạn hoặc token không hợp lệ.');
    }
    if (response.status === 403) {
      throw new Error('Bạn không có quyền thực hiện thao tác này (yêu cầu quyền ADMIN).');
    }
    const errorText = await response.text();
    throw new Error(errorText || `Yêu cầu thất bại với mã trạng thái ${response.status}`);
  }

  // Tự động phân tích JSON nếu backend trả về JSON, ngược lại trả về text
  const contentType = response.headers.get('content-type');
  if (contentType && contentType.includes('application/json')) {
    return response.json();
  }

  return (await response.text()) as unknown as T;
}
