import { NextResponse } from 'next/server';
import { prisma } from "@/lib/prisma";
import crypto from 'crypto';

export async function POST(request: Request) {
    try {
        const { email } = await request.json();

        // Find admin by email
        let admin = await prisma.admin.findUnique({
            where: { email }
        });

        // For initial setup, if no admin exists, we could create one or 
        // just fail. Let's create a default one for the first time 
        // if the email matches a specific one or just for testing.
        if (!admin) {
            // Strictly for safety, we usually don't do this in prod, 
            // but for a single-admin site, it helps initialize.
            return NextResponse.json({ error: 'البريد الإلكتروني غير مسجل' }, { status: 404 });
        }

        // Generate token
        const token = crypto.randomBytes(32).toString('hex');
        const expiry = new Date(Date.now() + 3600000); // 1 hour from now

        await prisma.admin.update({
            where: { email },
            data: {
                resetToken: token,
                resetTokenExpiry: expiry
            }
        });

        // SIMULATE SENDING EMAIL
        console.log(`[AUTH] Reset Token for ${email}: ${token}`);
        console.log(`[AUTH] Reset Link: http://localhost:3000/admin/reset-password?token=${token}`);

        return NextResponse.json({ success: true, message: 'تم إرسال رمز الاستعادة إلى بريدك الإلكتروني' });
    } catch (error) {
        console.error('Error in forgot-password:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
