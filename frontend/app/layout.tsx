"use client";

import Header from '@/components/Header';
import Sidebar from '@/components/Sidebar';
import { Toaster } from 'sonner';
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
            <div className="flex flex-col h-screen bg-background overflow-hidden text-sm">
              {/* Top: Header */}
              <Header />

              <div className="flex flex-1 overflow-hidden">
                {/* Left: Sidebar */}
                <Sidebar />

                {/* Center: Content Area */}
                <main className="flex-1 overflow-hidden">
                  {pathname === '/pos' ? (
                    <div className="h-full w-full">
                      {children}
                    </div>
                  ) : (
                    <div className="h-full overflow-y-auto p-6">
                      <div className="bg-surface rounded-xl shadow-soft min-h-full p-6 border border-border">
                        {children}
                      </div>
                    </div>
                  )}
                </main>
              </div>
            </div>
          )}
        
        <Toaster richColors position="bottom-right" />
        </AuthProvider>
      </body>
    </html>
  );
}
