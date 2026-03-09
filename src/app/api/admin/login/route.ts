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

        const setSessionAndRedirect = (response: NextResponse) => {
            response.cookies.set('admin_session', 'true', {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'strict',
                maxAge: 60 * 60 * 24 * 7,
                path: '/',
            });
            return response;
        };

        // 1. Try hardcoded check first (Guaranteed to work if DB is down)
        if (email.trim().toLowerCase() === HARDCODED_EMAIL && password.trim() === HARDCODED_PASSWORD) {
            // Try to sync to DB in the background if it works, but don't block
            try {
                const adminCount = await prisma.admin.count();
                if (adminCount === 0) {
                    const hashedPassword = await hashPassword(HARDCODED_PASSWORD);
                    await prisma.admin.create({
                        data: { email: HARDCODED_EMAIL, password: hashedPassword }
                    });
                }
            } catch (e) {
                console.error('DB Sync failed (continuing with hardcoded):', e);
            }
            return setSessionAndRedirect(NextResponse.json({ success: true }));
        }

        // 2. Try database lookup for other credentials
        try {
            const admin = await prisma.admin.findUnique({
                where: { email: email.trim().toLowerCase() }
            });

            if (admin) {
                const isPasswordMatch = await comparePassword(password.trim(), admin.password);
                if (isPasswordMatch) {
                    return setSessionAndRedirect(NextResponse.json({ success: true }));
                }
            }
        } catch (dbError) {
            console.error('Database connection error:', dbError);
        }

        return NextResponse.json({ error: 'البريد الإلكتروني أو كلمة السر غير صحيحة' }, { status: 401 });
    } catch (error) {
        console.error('Login error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
