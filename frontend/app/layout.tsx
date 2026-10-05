import Header from '@/components/Header';
import Sidebar from '@/components/Sidebar';
import { Toaster } from 'sonner';
import './globals.css';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <div className="flex flex-col h-screen bg-background overflow-hidden text-sm">
          {/* Top: Header */}
          <Header />

          <div className="flex flex-1 overflow-hidden">
            {/* Left: Sidebar */}
            <Sidebar />

            {/* Center: Content Area */}
            <main className="flex-1 overflow-y-auto p-6">
              <div className="min-h-full">
                {children}
              </div>
            </main>
          </div>
        </div>
        <Toaster richColors position="bottom-right" />
      </body>
    </html>
  );
}