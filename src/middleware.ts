import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    // Protect all /admin routes except /admin/login, /admin/forgot-password, /admin/reset-password
    const publicAdminPaths = ['/admin/login', '/admin/forgot-password', '/admin/reset-password'];

    if (pathname.startsWith('/admin') && !publicAdminPaths.includes(pathname)) {
        const session = request.cookies.get('admin_session');

        if (!session) {
            const loginUrl = new URL('/admin/login', request.url);
            return NextResponse.redirect(loginUrl);
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/admin/:path*'],
};
