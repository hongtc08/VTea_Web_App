import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Các route chỉ dành cho ADMIN
const ADMIN_ONLY_ROUTES = ['/accounts', '/statistics'];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const token = request.cookies.get('token')?.value;
  const role = request.cookies.get('role')?.value;

  // Nếu người dùng đã đăng nhập mà truy cập /login, redirect về trang chính
  if (pathname === '/login') {
    if (token) {
      return NextResponse.redirect(new URL('/pos', request.url));
    }
    return NextResponse.next();
  }

  // Nếu chưa đăng nhập (không có token), chuyển hướng về /login
  if (!token) {
    const loginUrl = new URL('/login', request.url);
    return NextResponse.redirect(loginUrl);
  }

  // Phân quyền: Route chỉ dành cho ROLE_ADMIN
  const isAdminRoute = ADMIN_ONLY_ROUTES.some((route) => pathname.startsWith(route));
  if (isAdminRoute && role !== 'ROLE_ADMIN') {
    // Không có quyền Admin -> chuyển hướng về trang POS
    return NextResponse.redirect(new URL('/pos', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - images (public images)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|images).*)',
  ],
};

