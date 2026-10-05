"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
    BookOpen, Users,
    FileText, PieChart, ShoppingCart
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

const menuItems = [
    { name: 'Bán hàng (POS)', path: '/pos', icon: ShoppingCart, adminOnly: false },
    { name: 'Thực đơn', path: '/menu', icon: BookOpen, adminOnly: false },
    { name: 'Nhân viên', path: '/accounts', icon: Users, adminOnly: true },
    { name: 'Hóa đơn', path: '/invoices', icon: FileText, adminOnly: false },
    { name: 'Thống kê', path: '/statistics', icon: PieChart, adminOnly: true },
];

export default function Sidebar() {
    const pathname = usePathname();
    const { user } = useAuth();
    const isAdmin = user?.role === 'ROLE_ADMIN';

    // Staff không được thấy menu Nhân viên và Thống kê
    const visibleMenuItems = menuItems.filter(item => !item.adminOnly || isAdmin);

    return (
        <aside className="w-[220px] h-full bg-white border-r border-gray-200 flex flex-col pt-5 pb-5 px-3">

            {/* Label MENU CHÍNH */}
            <div className="text-xs font-bold text-gray-500 mb-3 ml-2 tracking-wide uppercase">
                Menu Chính
            </div>

            {/* Danh sách các nút Navigation */}
            <nav className="flex flex-col gap-2">
                {visibleMenuItems.map((item) => {
                    const isActive = pathname === item.path;
                    return (
                        <Link
                            key={item.path}
                            href={item.path}
                            className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                                isActive
                                    ? 'bg-[#0B3B2C] text-[#D8B56A] font-bold shadow-md shadow-[#0B3B2C]/30 scale-[1.02]'
                                    : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900 font-medium'
                            }`}
                        >
                            <item.icon size={20} className={isActive ? 'text-[#D8B56A]' : 'text-gray-500'} />
                            <span>{item.name}</span>
                        </Link>
                    );
                })}
            </nav>
        </aside>
    );
}