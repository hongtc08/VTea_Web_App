"use client";

import { useState, useEffect, useCallback } from 'react';
import { Plus } from 'lucide-react';
import { Employee } from '@/types/employee';
import EmployeeFilters from '@/components/accounts/EmployeeFilters';
import EmployeeTable from '@/components/accounts/EmployeeTable';
import EmployeeModal from '@/components/accounts/EmployeeModal';
import ChangePasswordModal from '@/components/accounts/ChangePasswordModal';
import { userService } from '@/services/userService';
import { toast } from 'sonner';

export default function AccountsPage() {
    const [employees, setEmployees] = useState<Employee[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [activeTab, setActiveTab] = useState('Tất cả');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
    const [employeeToEdit, setEmployeeToEdit] = useState<Employee | null>(null);

    // Tải danh sách tài khoản từ API
    const loadEmployees = useCallback(async () => {
        try {
            const data = await userService.getAllUsers();
            setEmployees(data);
        } catch (error: unknown) {
            const message = error instanceof Error ? error.message : 'Không thể tải danh sách tài khoản.';
            console.error('Lỗi khi tải danh sách người dùng:', error);
            toast.error(message);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        let isMounted = true;
        userService.getAllUsers().then((data) => {
            if (isMounted) {
                setEmployees(data);
                setIsLoading(false);
            }
        }).catch((error: unknown) => {
            if (isMounted) {
                const message = error instanceof Error ? error.message : 'Không thể tải danh sách tài khoản.';
                console.error('Lỗi khi tải danh sách người dùng:', error);
                toast.error(message);
                setIsLoading(false);
            }
        });

        return () => {
            isMounted = false;
        };
    }, []);


    const filteredEmployees = employees.filter(emp => {
        // Lọc theo tab
        if (activeTab !== 'Tất cả' && emp.role !== activeTab) return false;

        // Lọc theo tìm kiếm
        if (searchQuery) {
            const q = searchQuery.toLowerCase().trim();
            return (
                emp.fullName.toLowerCase().includes(q) ||
                emp.username.toLowerCase().includes(q) ||
                (emp.phone && emp.phone.includes(q))
            );
        }
        return true;
    });

    const handleSaveEmployee = async (empData: Employee | Omit<Employee, 'id'>) => {
        try {
            if (employeeToEdit) {
                // Gọi API PUT /api/users/{id}
                await userService.updateUser(employeeToEdit.id, {
                    fullName: empData.fullName,
                    phone: empData.phone,
                    role: empData.role,
                    status: (empData as Employee).status,
                });
                toast.success('Cập nhật thông tin nhân viên thành công!');
            } else {
                // Gọi API POST /api/users
                await userService.createUser({
                    username: empData.username,
                    password: empData.password,
                    fullName: empData.fullName,
                    phone: empData.phone,
                    role: empData.role,
                });
                toast.success('Thêm nhân viên mới thành công!');
            }
            await loadEmployees();
        } catch (error: unknown) {
            const message = error instanceof Error ? error.message : 'Thao tác không thành công.';
            console.error('Lỗi lưu nhân viên:', error);
            toast.error(message);
            throw error; // Ném lỗi để modal biết và không đóng form
        }
    };

    const handleToggleStatus = async (emp: Employee) => {
        try {
            if (emp.status === 'Đang làm việc') {
                // Gọi API DELETE /api/users/{id}
                await userService.deleteUser(emp.id);
                toast.success(`Đã khóa tài khoản của ${emp.fullName}`);
            } else {
                // Mở khóa tài khoản: Gọi API PUT /api/users/{id} với status ACTIVE
                await userService.updateUser(emp.id, {
                    status: 'ACTIVE',
                });
                toast.success(`Đã mở khóa tài khoản của ${emp.fullName}`);
            }
            await loadEmployees();
        } catch (error: unknown) {
            const message = error instanceof Error ? error.message : 'Lỗi khi thay đổi trạng thái tài khoản.';
            console.error('Lỗi thay đổi trạng thái:', error);
            toast.error(message);
        }
    };

    return (
        <div className="flex flex-col h-full">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-foreground">Quản lý nhân viên</h1>
                    <p className="text-sm text-muted">Quản lý danh sách tài khoản nhân viên và phân quyền trong hệ thống</p>
                </div>
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
                isLoading={isLoading}
                onEdit={(emp) => { setEmployeeToEdit(emp); setIsModalOpen(true); }}
                onChangePassword={(emp) => { setEmployeeToEdit(emp); setIsPasswordModalOpen(true); }}
                onToggleStatus={handleToggleStatus}
            />

            {isModalOpen && (
                <EmployeeModal
                    key={employeeToEdit?.id ?? 'create'}
                    isOpen={isModalOpen}
                    onClose={() => { setIsModalOpen(false); setEmployeeToEdit(null); }}
                    onSave={handleSaveEmployee}
                    employeeToEdit={employeeToEdit}
                />
            )}

            <ChangePasswordModal
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
