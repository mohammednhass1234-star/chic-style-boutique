import { NextResponse } from 'next/server';
import { prisma } from "@/lib/prisma";
import { hashPassword } from "@/lib/auth";

export async function POST(request: Request) {
    try {
        const { token, newPassword } = await request.json();

        if (!token || !newPassword) {
            return NextResponse.json({ error: 'بيانات غير مكتملة' }, { status: 400 });
        }

        const admin = await prisma.admin.findUnique({
            where: { resetToken: token }
        });

        if (!admin || !admin.resetTokenExpiry || admin.resetTokenExpiry < new Date()) {
            return NextResponse.json({ error: 'رمز الاستعادة غير صالح أو منتهي الصلاحية' }, { status: 400 });
        }

        const hashedPassword = await hashPassword(newPassword);

        await prisma.admin.update({
            where: { id: admin.id },
            data: {
                password: hashedPassword,
                resetToken: null,
                resetTokenExpiry: null
            }
        });

        return NextResponse.json({ success: true, message: 'تم تغيير كلمة السر بنجاح' });
    } catch (error) {
        console.error('Error in reset-password:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
