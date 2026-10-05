import Image from 'next/image';
import { LogOut, Crown } from 'lucide-react';

export default function Header() {
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
                <div className="flex items-center gap-3 px-4 py-2 border border-primary-foreground/20 rounded-[var(--radius-control)] bg-primary-foreground/5">
                    <div className="relative w-10 h-10 bg-accent rounded-full flex items-center justify-center text-accent-foreground font-bold text-lg">
                        N
                        <Crown size={14} className="absolute -top-1 -right-1 text-primary fill-primary" />
                    </div>

                    <div className="flex flex-col pr-2">
                        <span className="text-sm font-bold text-primary-foreground">Nguyễn Văn A</span>
                        <span className="text-xs text-primary-foreground/60">Quản lý</span>
                    </div>
                </div>

                {/* Nút Logout */}
                <button className="flex items-center gap-2 px-4 py-3 border border-primary-foreground/20 rounded-[var(--radius-control)] bg-primary-foreground/5 hover:bg-primary-foreground/10 transition-colors text-primary-foreground text-sm font-medium">
                    <LogOut size={18} />
                    Đăng xuất
                </button>
            </div>

        </header>
    );
}