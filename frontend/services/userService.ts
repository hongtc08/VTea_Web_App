import { apiFetch } from '@/lib/api';
import { formatDate } from '@/lib/date';
import { Employee } from '@/types/employee';

export interface UserResponseDto {
  userId: number;
  username: string;
  fullName: string;
  phone: string;
  role: 'ADMIN' | 'STAFF';
  status: 'ACTIVE' | 'DELETED';
  createdAt?: string;
}

export interface CreateUserRequestDto {
  username: string;
  password?: string;
  fullName: string;
  phone: string;
  role: 'ADMIN' | 'STAFF';
}

export interface UpdateUserRequestDto {
  fullName?: string;
  phone?: string;
  role?: 'ADMIN' | 'STAFF';
  status?: 'ACTIVE' | 'DELETED';
}

/**
 * map UserResponse (be) -> Employee (fe)
 */
export function mapUserResponseToEmployee(user: UserResponseDto): Employee {
  return {
    id: String(user.userId),
    fullName: user.fullName || '',
    username: user.username,
    role: user.role === 'ADMIN' ? 'Quản lý' : 'Nhân viên',
    phone: user.phone || '',
    startDate: formatDate(user.createdAt),
    status: user.status === 'ACTIVE' ? 'Đang làm việc' : 'Đã khóa',
  };
}

export const userService = {
  /**
   * GET /api/users
   */
  async getAllUsers(): Promise<Employee[]> {
    const data = await apiFetch<UserResponseDto[]>('/api/users');
    return data.map(mapUserResponseToEmployee);
  },

  /**
   * GET /api/users/{id}
   */
  async getUserById(id: number | string): Promise<UserResponseDto> {
    return apiFetch<UserResponseDto>(`/api/users/${id}`);
  },

  /**
   * POST /api/users
   */
  async createUser(data: {
    username: string;
    password?: string;
    fullName: string;
    phone?: string;
    role: 'Quản lý' | 'Nhân viên' | 'ADMIN' | 'STAFF';
  }): Promise<Employee> {
    const payload: CreateUserRequestDto = {
      username: data.username.trim(),
      password: data.password || '123456',
      fullName: data.fullName.trim(),
      phone: data.phone?.trim() || '',
      role: data.role === 'Quản lý' ? 'ADMIN' : data.role === 'Nhân viên' ? 'STAFF' : data.role,
    };

    const created = await apiFetch<UserResponseDto>('/api/users', {
      method: 'POST',
      body: JSON.stringify(payload),
    });

    return mapUserResponseToEmployee(created);
  },

  /**
   * PUT /api/users/{id}
   */
  async updateUser(
    id: number | string,
    data: {
      fullName?: string;
      phone?: string;
      role?: 'Quản lý' | 'Nhân viên' | 'ADMIN' | 'STAFF';
      status?: 'Đang làm việc' | 'Đã khóa' | 'ACTIVE' | 'DELETED';
    }
  ): Promise<Employee> {
    const payload: UpdateUserRequestDto = {};

    if (data.fullName !== undefined) payload.fullName = data.fullName.trim();
    if (data.phone !== undefined) payload.phone = data.phone.trim();
    if (data.role !== undefined) {
      payload.role = data.role === 'Quản lý' ? 'ADMIN' : data.role === 'Nhân viên' ? 'STAFF' : data.role;
    }
    if (data.status !== undefined) {
      payload.status =
        data.status === 'Đang làm việc' ? 'ACTIVE' : data.status === 'Đã khóa' ? 'DELETED' : data.status;
    }

    const updated = await apiFetch<UserResponseDto>(`/api/users/${id}`, {
      method: 'PUT',
      body: JSON.stringify(payload),
    });

    return mapUserResponseToEmployee(updated);
  },

  /**
   * DELETE /api/users/{id}
   */
  async deleteUser(id: number | string): Promise<string> {
    return apiFetch<string>(`/api/users/${id}`, {
      method: 'DELETE',
    });
  },
};
