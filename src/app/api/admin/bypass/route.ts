import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET() {
    const response = NextResponse.json({
        success: true,
        message: "Bypass successful. Redirecting to admin..."
    });

    response.cookies.set('admin_session', 'true', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 60 * 60 * 24 * 7, // 1 week
        path: '/',
    });

    return response;
}
