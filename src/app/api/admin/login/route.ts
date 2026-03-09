import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { comparePassword, hashPassword } from "@/lib/auth";

export async function POST(request: Request) {
    try {
        const body = await request.json().catch(() => ({}));
        const { email, password } = body;

        if (!email || !password) {
            return NextResponse.json({ error: 'يرجى إدخال البريد الإلكتروني وكلمة السر' }, { status: 400 });
        }

        const HARDCODED_EMAIL = 'mohammednhass1234@gmail.com';
        const HARDCODED_PASSWORD = 'Mohammed12341234';

        // Check if any admin exists in the database
        let admin = await prisma.admin.findFirst();

        // If no admin exists, and the credentials match the initial defaults, create the first admin
        if (!admin) {
            if (email.trim().toLowerCase() === HARDCODED_EMAIL && password.trim() === HARDCODED_PASSWORD) {
                const hashedPassword = await hashPassword(HARDCODED_PASSWORD);
                admin = await prisma.admin.create({
                    data: {
                        email: HARDCODED_EMAIL,
                        password: hashedPassword
                    }
                });
            } else {
                return NextResponse.json({ error: 'البريد الإلكتروني أو كلمة السر غير صحيحة' }, { status: 401 });
            }
        }

        // Verify credentials against the database
        const isEmailMatch = email.trim().toLowerCase() === admin.email.toLowerCase();
        const isPasswordMatch = await comparePassword(password.trim(), admin.password);

        if (isEmailMatch && isPasswordMatch) {
            const response = NextResponse.json({ success: true });
            response.cookies.set('admin_session', 'true', {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'strict',
                maxAge: 60 * 60 * 24 * 7,
                path: '/',
            });
            return response;
        }

        return NextResponse.json({ error: 'البريد الإلكتروني أو كلمة السر غير صحيحة' }, { status: 401 });
    } catch (error) {
        console.error('Login error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
