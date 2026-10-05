import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { Employee } from '@/types/employee';

interface EmployeeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (employee: Employee | Omit<Employee, 'id'>) => void;
  employeeToEdit?: Employee | null;
}

export default function EmployeeModal({ isOpen, onClose, onSave, employeeToEdit }: EmployeeModalProps) {
  const getTodayDateString = () => new Date().toISOString().split('T')[0];
  const isEditing = !!employeeToEdit;

  const [formData, setFormData] = useState({
    fullName: '',
    username: '',
    password: '',
    role: 'Nhân viên' as 'Quản lý' | 'Nhân viên',
    phone: '',
    startDate: getTodayDateString(),
  });

  // Reset or pre-fill form when modal opens
  useEffect(() => {
    if (isOpen) {
      if (employeeToEdit) {
        setFormData({
          fullName: employeeToEdit.fullName,
          username: employeeToEdit.username,
          password: '',
          role: employeeToEdit.role,
          phone: employeeToEdit.phone || '',
          startDate: employeeToEdit.startDate || getTodayDateString(),
        });
      } else {
        setFormData({
          fullName: '',
          username: '',
          password: '',
          role: 'Nhân viên',
          phone: '',
          startDate: getTodayDateString(),
        });
      }
    }
  }, [isOpen, employeeToEdit]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isEditing && employeeToEdit) {
      onSave({
        ...employeeToEdit, // Keep id and status
        fullName: formData.fullName,
        username: formData.username,
        role: formData.role,
        phone: formData.phone,
        startDate: formData.startDate,
      });
    } else {
      onSave({
        ...formData,
        status: 'Đang làm việc'
      });
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
      <div className="bg-surface rounded-[var(--radius-card)] w-full max-w-md overflow-hidden shadow-elevated">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border bg-primary">
          <h2 className="text-lg font-bold text-accent">
            {isEditing ? 'Sửa thông tin nhân viên' : 'Thêm nhân viên mới'}
          </h2>
          <button type="button" onClick={onClose} className="text-accent hover:text-primary-foreground transition-colors">
            <X size={20} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-4">
          
          <div>
            <label className="block text-sm font-medium text-foreground mb-1">Họ tên *</label>
            <input 
              required
              type="text" 
              className="w-full px-3 py-2 border border-border rounded-[var(--radius-control)] focus:outline-none focus:ring-2 focus:ring-primary bg-background"
              placeholder="VD: Nguyễn Văn A"
              value={formData.fullName}
              onChange={e => setFormData({...formData, fullName: e.target.value})}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-1">Tên đăng nhập *</label>
            <input 
              required
              type="text" 
              className="w-full px-3 py-2 border border-border rounded-[var(--radius-control)] focus:outline-none focus:ring-2 focus:ring-primary bg-background"
              placeholder="VD: nguyenvana"
              value={formData.username}
              onChange={e => setFormData({...formData, username: e.target.value})}
            />
          </div>

          {!isEditing && (
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">Mật khẩu *</label>
              <input 
                required
                type="password" 
                className="w-full px-3 py-2 border border-border rounded-[var(--radius-control)] focus:outline-none focus:ring-2 focus:ring-primary bg-background"
                placeholder="Mật khẩu ít nhất 6 ký tự"
                value={formData.password}
                onChange={e => setFormData({...formData, password: e.target.value})}
              />
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-foreground mb-1">Vai trò *</label>
            <select 
              className="w-full px-3 py-2 border border-border rounded-[var(--radius-control)] focus:outline-none focus:ring-2 focus:ring-primary bg-background"
              value={formData.role}
              onChange={e => setFormData({...formData, role: e.target.value as 'Quản lý' | 'Nhân viên'})}
            >
              <option value="Nhân viên">Nhân viên</option>
              <option value="Quản lý">Quản lý</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">Số điện thoại *</label>
              <input 
                required
                type="text" 
                pattern="[0-9]{10}"
                title="Số điện thoại phải bao gồm đúng 10 chữ số"
                className="w-full px-3 py-2 border border-border rounded-[var(--radius-control)] focus:outline-none focus:ring-2 focus:ring-primary bg-background"
                placeholder="VD: 0987654321"
                value={formData.phone}
                onChange={e => setFormData({...formData, phone: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">Ngày vào làm *</label>
              <input 
                required
                type="date" 
                className="w-full px-3 py-2 border border-border rounded-[var(--radius-control)] focus:outline-none focus:ring-2 focus:ring-primary bg-background"
                value={formData.startDate}
                onChange={e => setFormData({...formData, startDate: e.target.value})}
              />
            </div>
          </div>

          {/* Footer Actions */}
          <div className="flex justify-end gap-3 mt-4 pt-4 border-t border-border">
            <button 
              type="button" 
              onClick={onClose}
              className="px-4 py-2 text-muted bg-cream-200 hover:bg-cream-300 rounded-[var(--radius-control)] font-medium transition-colors"
            >
              Hủy
            </button>
            <button 
              type="submit" 
              className="px-4 py-2 bg-primary text-accent hover:bg-primary-hover rounded-[var(--radius-control)] font-bold transition-colors"
            >
              {isEditing ? 'Cập nhật' : 'Lưu nhân viên'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
