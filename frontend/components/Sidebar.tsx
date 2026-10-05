"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
    BookOpen, Users,
    FileText, PieChart, ShoppingCart
} from 'lucide-react';

const menuItems = [
    { name: 'Bán hàng (POS)', path: '/pos', icon: ShoppingCart },
    { name: 'Thực đơn', path: '/menu', icon: BookOpen },
    { name: 'Nhân viên', path: '/accounts', icon: Users },
    { name: 'Hóa đơn', path: '/invoices', icon: FileText },
    { name: 'Thống kê', path: '/statistics', icon: PieChart },
];

export default function Sidebar() {
    const pathname = usePathname();

    return (
        <aside className="w-[220px] h-full bg-surface border-r border-border flex flex-col pt-5 pb-5 px-3">

            {/* Label MENU CHÍNH */}
            <div className="text-xs font-bold text-muted mb-3 ml-2 tracking-wide uppercase">
                Menu Chính
            </div>

            {/* Danh sách các nút Navigation */}
            <nav className="flex flex-col gap-2">
                {menuItems.map((item) => {
                    const isActive = pathname === item.path;
                    return (
                        <Link
                            key={item.path}
                            href={item.path}
                            className={`flex items-center gap-3 px-4 py-3 rounded-[var(--radius-control)] transition-all ${
                                isActive
                                    ? 'bg-primary text-accent font-bold shadow-soft scale-[1.02]'
                                    : 'text-muted hover:bg-cream-200 hover:text-foreground font-medium'
                            }`}
                        >
                            <item.icon size={20} className={isActive ? 'text-accent' : 'text-muted'} />
                            <span>{item.name}</span>
                        </Link>
                    );
                })}
            </nav>
        </aside>
    );
}