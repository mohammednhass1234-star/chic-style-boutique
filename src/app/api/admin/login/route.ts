import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { comparePassword, hashPassword } from "@/lib/auth";

export async function POST(request: Request) {
    try {
        const { email, password } = await request.json();

        // 1. Find admin by email
        const admin = await prisma.admin.findUnique({
            where: { email: email.toLowerCase() }
        });

        if (!admin) {
            return NextResponse.json({ error: 'البريد الإلكتروني أو كلمة السر غير صحيحة' }, { status: 401 });
        }

        // 2. Compare password
        const isPasswordCorrect = await comparePassword(password, admin.password);
        if (!isPasswordCorrect) {
            return NextResponse.json({ error: 'البريد الإلكتروني أو كلمة السر غير صحيحة' }, { status: 401 });
        }

        // 3. Authentication successful
        const response = NextResponse.json({ success: true });

        // Set session cookie
        response.cookies.set('admin_session', 'true', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 60 * 60 * 24 * 7, // 1 week
            path: '/',
        });

        return response;
    } catch (error: any) {
        console.error('Login error detail:', {
            message: error.message,
            stack: error.stack,
            code: error.code
        });
        return NextResponse.json({ error: 'Internal Server Error', details: error.message }, { status: 500 });
    }
}
