"use client";

import Image from 'next/image';
import { LogOut, Crown, User as UserIcon } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

export default function Header() {
    const { user, logout } = useAuth();

    const isAdmin = user?.role === 'ROLE_ADMIN';
    const displayName = user?.username || 'Người dùng';
    const roleLabel = isAdmin ? 'Quản lý (Admin)' : 'Nhân viên (Staff)';
    const avatarInitial = displayName.charAt(0).toUpperCase();

    return (
        <header className="h-[72px] bg-primary border-b border-primary flex items-center justify-between px-6">

            {/* Vùng Logo */}
            <div className="flex items-center gap-3.5">
                <div className="w-[60px] h-[60px] bg-surface rounded-[var(--radius-card)] overflow-hidden relative flex items-center justify-center">
                    <Image src="/images/logo.png" alt="VTea Logo" fill className="object-contain" />
                </div>

                <div className="flex flex-col justify-center">
                    <div className="flex items-center gap-2">
                        <h1 className="text-xl font-bold text-primary-foreground">VTea</h1>
                        <div className="w-1.5 h-1.5 rounded-full bg-accent"></div>
                        <span className="text-lg font-medium text-primary-foreground/80">Cafe & Trà Sữa</span>
                    </div>
                </div>
            </div>

            {/* Vùng User Info & Logout */}
            <div className="flex items-center gap-4">

                {/* User Info Box */}
                <div className="flex items-center gap-3 px-4 py-2 border border-white/20 rounded-xl bg-white/5">
                    <div className="relative w-10 h-10 bg-[#D8B56A] rounded-full flex items-center justify-center text-[#0B3B2C] font-bold text-lg">
                        {avatarInitial || <UserIcon size={18} />}
                        {isAdmin && (
                            <Crown size={14} className="absolute -top-1 -right-1 text-black fill-black" />
                        )}
                    </div>

                    <div className="flex flex-col pr-2">
                        <span className="text-sm font-bold text-white">{displayName}</span>
                        <span className="text-xs text-[#D8B56A] font-medium">{roleLabel}</span>
                    </div>
                </div>

                {/* Nút Logout */}
                <button
                    onClick={logout}
                    className="flex items-center gap-2 px-4 py-2.5 border border-white/20 rounded-xl bg-white/5 hover:bg-white/10 active:scale-[0.98] transition-all text-white text-sm font-medium cursor-pointer"
                >
                    <LogOut size={18} />
                    Đăng xuất
                </button>
            </div>

        </header>
    );
}