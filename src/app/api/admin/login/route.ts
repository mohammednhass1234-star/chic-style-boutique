import { NextResponse } from 'next/server';

export async function POST(request: Request) {
    try {
        const body = await request.json().catch(() => ({}));
        const { email, password } = body;

        const HARDCODED_EMAIL = 'mohammednhass1234@gmail.com';
        const HARDCODED_PASSWORD = 'Mohammed12341234';

        if (email && password &&
            email.trim().toLowerCase() === HARDCODED_EMAIL &&
            password.trim() === HARDCODED_PASSWORD) {

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
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
