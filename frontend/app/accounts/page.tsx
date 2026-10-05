"use client";

import { useState } from 'react';
import { Plus } from 'lucide-react';
import { Employee } from '@/types/employee';
import EmployeeFilters from '@/components/accounts/EmployeeFilters';
import EmployeeTable from '@/components/accounts/EmployeeTable';
import EmployeeModal from '@/components/accounts/EmployeeModal';
import PasswordModal from '@/components/accounts/PasswordModal';
import { toast } from 'sonner';

const MOCK_EMPLOYEES: Employee[] = [
    { id: '1', fullName: 'Nguyễn Văn A', username: 'nguyenvana', role: 'Quản lý', phone: '1236549870', startDate: '', status: 'Đang làm việc' },
    { id: '2', fullName: 'Trần Thị B', username: 'tranthib', role: 'Nhân viên', phone: '', startDate: '', status: 'Đã khóa' },
    { id: '3', fullName: 'Lê Thị C', username: 'lethic', role: 'Quản lý', phone: '', startDate: '', status: 'Đang làm việc' },
    { id: '4', fullName: 'Trần Văn D', username: 'tranvand', role: 'Nhân viên', phone: '', startDate: '', status: 'Đang làm việc' },
    { id: '5', fullName: 'Nguyễn Văn Huy', username: 'huy.nguyen', role: 'Nhân viên', phone: '', startDate: '12/06/2026', status: 'Đang làm việc' },
];

export default function AccountsPage() {
    const [employees, setEmployees] = useState<Employee[]>(MOCK_EMPLOYEES);
    const [searchQuery, setSearchQuery] = useState('');
    const [activeTab, setActiveTab] = useState('Tất cả');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
    const [employeeToEdit, setEmployeeToEdit] = useState<Employee | null>(null);

    const filteredEmployees = employees.filter(emp => {
        // Lọc theo tab
        if (activeTab !== 'Tất cả' && emp.role !== activeTab) return false;

        // Lọc theo tìm kiếm
        if (searchQuery) {
            const q = searchQuery.toLowerCase();
            return emp.fullName.toLowerCase().includes(q) ||
                emp.username.toLowerCase().includes(q) ||
                (emp.phone && emp.phone.includes(q));
        }
        return true;
    });

    const handleSaveEmployee = (empData: Employee | Omit<Employee, 'id'>) => {
        if (employeeToEdit) {
            setEmployees(employees.map(emp => emp.id === (empData as Employee).id ? (empData as Employee) : emp));
            toast.success('Đã cập nhật thông tin nhân viên thành công!');
        } else {
            const newEmployee: Employee = {
                ...empData,
                id: Math.random().toString(36).substr(2, 9),
            };
            setEmployees([newEmployee, ...employees]);
            toast.success('Đã thêm nhân viên mới thành công!');
        }
    };

    const handleToggleStatus = (emp: Employee) => {
        setEmployees(employees.map(e => {
            if (e.id === emp.id) {
                const newStatus = e.status === 'Đang làm việc' ? 'Đã khóa' : 'Đang làm việc';
                if (newStatus === 'Đã khóa') {
                    toast.error(`Đã khóa tài khoản của ${emp.fullName}`);
                } else {
                    toast.success(`Đã mở khóa tài khoản của ${emp.fullName}`);
                }
                return { ...e, status: newStatus };
            }
            return e;
        }));
    };

    return (
        <div className="flex flex-col h-full">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-foreground">Quản lý nhân viên</h1>
                <button
                    onClick={() => { setEmployeeToEdit(null); setIsModalOpen(true); }}
                    className="flex items-center gap-2 bg-primary text-accent px-4 py-2.5 rounded-[var(--radius-control)] font-bold hover:bg-primary-hover transition-colors shadow-soft"
                >
                    <Plus size={18} />
                    Thêm nhân viên
                </button>
            </div>

            <EmployeeFilters
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                activeTab={activeTab}
                setActiveTab={setActiveTab}
            />

            <EmployeeTable 
                employees={filteredEmployees}
                onEdit={(emp) => { setEmployeeToEdit(emp); setIsModalOpen(true); }}
                onChangePassword={(emp) => { setEmployeeToEdit(emp); setIsPasswordModalOpen(true); }}
                onToggleStatus={handleToggleStatus}
            />

            <EmployeeModal
                isOpen={isModalOpen}
                onClose={() => { setIsModalOpen(false); setEmployeeToEdit(null); }}
                onSave={handleSaveEmployee}
                employeeToEdit={employeeToEdit}
            />

            <PasswordModal
                isOpen={isPasswordModalOpen}
                onClose={() => { setIsPasswordModalOpen(false); setEmployeeToEdit(null); }}
                onSubmit={(oldPass, newPass) => {
                    // Chỗ này sẽ gọi API để đổi mật khẩu sau
                    console.log(`Đổi mật khẩu cho: ${employeeToEdit?.username}`, { oldPass, newPass });
                    alert('Đổi mật khẩu thành công (mock)!');
                }}
            />
        </div>
    );
}
