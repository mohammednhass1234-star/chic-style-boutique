import { NextResponse } from 'next/server';
import { prisma } from "@/lib/prisma";
import { comparePassword, hashPassword } from "@/lib/auth";

export async function POST(request: Request) {
    try {
        const { password, email } = await request.json();
        const adminEmail = email || "admin@chicjeune.com"; // Fallback/Default

        let admin = await prisma.admin.findUnique({
            where: { email: adminEmail }
        });

        // Initial setup seed if no admin exists
        if (!admin && password === (process.env.ADMIN_PASSWORD || "chic2026")) {
            admin = await prisma.admin.create({
                data: {
                    email: adminEmail,
                    password: await hashPassword(password)
                }
            });
        }

        if (admin && await comparePassword(password, admin.password)) {
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
        }

        return NextResponse.json({ error: 'البيانات غير صحيحة' }, { status: 401 });
    } catch (error) {
        console.error('Login error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
