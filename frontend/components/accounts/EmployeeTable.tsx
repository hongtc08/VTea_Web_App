import { useState, useRef, useEffect } from 'react';
import { MoreVertical, Phone, Pencil, KeyRound, Lock, Unlock } from 'lucide-react';
import { Employee } from '@/types/employee';

interface EmployeeTableProps {
  employees: Employee[];
  onEdit: (employee: Employee) => void;
  onChangePassword: (employee: Employee) => void;
  onToggleStatus: (employee: Employee) => void;
}

export default function EmployeeTable({ employees, onEdit, onChangePassword, onToggleStatus }: EmployeeTableProps) {
  const [openDropdownId, setOpenDropdownId] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setOpenDropdownId(null);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="bg-surface rounded-[var(--radius-card)] border border-border shadow-soft">
      <table className="w-full text-sm text-left">
        <thead className="bg-surface text-muted font-medium border-b border-border">
          <tr>
            <th className="px-6 py-4 font-semibold">Nhân viên</th>
            <th className="px-6 py-4 font-semibold">Vị trí</th>
            <th className="px-6 py-4 font-semibold">Liên hệ</th>
            <th className="px-6 py-4 font-semibold">Ngày vào làm</th>
            <th className="px-6 py-4 font-semibold text-center">Trạng thái</th>
            <th className="px-6 py-4 font-semibold w-10"></th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {employees.map((emp) => (
            <tr key={emp.id} className="hover:bg-cream-100/50 transition-colors">
              <td className="px-6 py-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-accent text-accent-foreground flex items-center justify-center font-bold text-lg">
                    {emp.fullName.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex flex-col">
                    <span className="font-bold text-foreground">{emp.fullName}</span>
                    <span className="text-xs text-muted">{emp.username}</span>
                  </div>
                </div>
              </td>
              <td className="px-6 py-4">
                <span className="bg-cream-200 text-foreground px-4 py-1.5 rounded-[var(--radius-control)] text-sm font-medium">
                  {emp.role}
                </span>
              </td>
              <td className="px-6 py-4">
                <div className="flex items-center gap-2 text-muted">
                  <Phone size={14} />
                  <span>{emp.phone || '(Trống)'}</span>
                </div>
              </td>
              <td className="px-6 py-4 text-muted font-medium">
                {emp.startDate || '—'}
              </td>
              <td className="px-6 py-4 text-center">
                <span className={`px-5 py-2 rounded-full text-sm font-semibold inline-block ${
                  emp.status === 'Đang làm việc'
                    ? 'bg-tea-50 text-success'
                    : 'bg-red-50 text-danger'
                }`}>
                  {emp.status}
                </span>
              </td>
              <td className="px-6 py-4 relative">
                <button 
                  className="text-muted hover:text-foreground p-1.5 rounded-md hover:bg-cream-200 transition-colors"
                  onClick={(e) => {
                    e.stopPropagation();
                    setOpenDropdownId(openDropdownId === emp.id ? null : emp.id);
                  }}
                >
                  <MoreVertical size={18} />
                </button>

                {/* Dropdown Menu */}
                {openDropdownId === emp.id && (
                  <div 
                    ref={dropdownRef}
                    className="absolute right-8 top-10 w-48 bg-surface rounded-[var(--radius-card)] shadow-elevated border border-border py-1.5 z-10"
                  >
                    <button
                      onClick={() => { onEdit(emp); setOpenDropdownId(null); }}
                      className="w-full text-left px-4 py-2.5 text-sm text-foreground hover:bg-cream-100 flex items-center gap-2.5 transition-colors font-medium"
                    >
                      <Pencil size={16} className="text-muted" />
                      Sửa thông tin
                    </button>
                    <button
                      onClick={() => { onChangePassword(emp); setOpenDropdownId(null); }}
                      className="w-full text-left px-4 py-2.5 text-sm text-foreground hover:bg-cream-100 flex items-center gap-2.5 transition-colors font-medium"
                    >
                      <KeyRound size={16} className="text-muted" />
                      Đổi mật khẩu
                    </button>
                    <button
                      onClick={() => { onToggleStatus(emp); setOpenDropdownId(null); }}
                      className="w-full text-left px-4 py-2.5 text-sm text-foreground hover:bg-cream-100 flex items-center gap-2.5 transition-colors font-medium"
                    >
                      {emp.status === 'Đang làm việc' ? (
                        <>
                          <Lock size={16} className="text-muted" />
                          Khóa tài khoản
                        </>
                      ) : (
                        <>
                          <Unlock size={16} className="text-muted" />
                          Mở khóa tài khoản
                        </>
                      )}
                    </button>
                  </div>
                )}
              </td>
            </tr>
          ))}
          {employees.length === 0 && (
            <tr>
              <td colSpan={6} className="px-6 py-10 text-center text-muted font-medium">
                Không tìm thấy nhân viên nào.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
