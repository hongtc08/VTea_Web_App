export interface Employee {
  id: string;
  fullName: string;
  username: string;
  role: 'Quản lý' | 'Nhân viên';
  phone: string;
  startDate: string;
  status: 'Đang làm việc' | 'Đã khóa';
}
