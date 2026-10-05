"use client";

import Header from '@/components/Header';
import Sidebar from '@/components/Sidebar';
import { usePathname } from 'next/navigation';
import { AuthProvider } from '@/contexts/AuthContext';
import './globals.css';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isLoginPage = pathname === '/login';

  return (
    <html lang="vi">
      <body className="antialiased">
        <AuthProvider>
          {isLoginPage ? (
            <main className="min-h-screen w-full">
              {children}
            </main>
          ) : (
            <div className="flex flex-col h-screen bg-[#F7F0E1] overflow-hidden text-sm">
              {/* Top: Header */}
              <Header />

              <div className="flex flex-1 overflow-hidden">
                {/* Left: Sidebar */}
                <Sidebar />

                {/* Center: Content Area */}
                <main className="flex-1 overflow-y-auto p-6">
                  <div className="bg-white rounded-xl shadow-sm min-h-full p-6 border border-gray-100">
                    {children}
                  </div>
                </main>
              </div>
            </div>
          )}
        </AuthProvider>
      </body>
    </html>
  );
}
