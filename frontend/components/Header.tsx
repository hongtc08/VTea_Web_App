import Image from 'next/image';
import Link from 'next/link';
import { LogOut, Crown } from 'lucide-react';

export default function Header() {
    return (
        <header className="h-[72px] bg-[#0B3B2C] border-b border-[#0B3B2C] flex items-center justify-between px-6">

            {/* Vùng Logo */}
            <div className="flex items-center gap-3.5">
                <div className="w-[60px] h-[60px] bg-white rounded-xl overflow-hidden relative flex items-center justify-center">
                    <Image src="/images/logo.png" alt="VTea Logo" fill className="object-contain" />
                </div>

                <div className="flex flex-col justify-center">
                    <div className="flex items-center gap-2">
                        <h1 className="text-xl font-bold text-white">VTea</h1>
                        <div className="w-1.5 h-1.5 rounded-full bg-[#D8B56A]"></div>
                        <span className="text-lg font-medium text-gray-300">Cafe & Trà Sữa</span>
                    </div>
                </div>
            </div>

            {/* Vùng User Info & Logout */}
            <div className="flex items-center gap-4">

                {/* User Info Box */}
                <div className="flex items-center gap-3 px-4 py-2 border border-white/20 rounded-xl bg-white/5">
                    <div className="relative w-10 h-10 bg-[#D8B56A] rounded-full flex items-center justify-center text-[#0B3B2C] font-bold text-lg">
                        N
                        <Crown size={14} className="absolute -top-1 -right-1 text-black fill-black" />
                    </div>

                    <div className="flex flex-col pr-2">
                        <span className="text-sm font-bold text-white">Nguyễn Văn A</span>
                        <span className="text-xs text-gray-400">Quản lý</span>
                    </div>
                </div>

                {/* Nút Logout */}
                <Link
                    href="/login"
                    className="flex items-center gap-2 px-4 py-3 border border-white/20 rounded-xl bg-white/5 hover:bg-white/10 transition-colors text-white text-sm font-medium"
                >
                    <LogOut size={18} />
                    Đăng xuất
                </Link>
            </div>

        </header>
    );
}