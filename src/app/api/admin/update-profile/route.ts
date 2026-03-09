import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { hashPassword } from "@/lib/auth";
import { cookies } from 'next/headers';

export async function POST(request: Request) {
    try {
        const cookieStore = await cookies();
        const session = cookieStore.get('admin_session');

        if (!session || session.value !== 'true') {
            return NextResponse.json({ error: 'غير مصرح لك بالقيام بهذا الإجراء' }, { status: 401 });
        }

        const { email, password, currentPassword } = await request.json();

        // Find the admin
        const admin = await prisma.admin.findFirst();
        if (!admin) {
            return NextResponse.json({ error: 'المسؤول غير موجود' }, { status: 404 });
        }

        const updateData: any = {};
        if (email) {
            updateData.email = email.trim().toLowerCase();
        }
        if (password) {
            updateData.password = await hashPassword(password);
        }

        if (Object.keys(updateData).length === 0) {
            return NextResponse.json({ error: 'لا توجد بيانات للتحديث' }, { status: 400 });
        }

        await prisma.admin.update({
            where: { id: admin.id },
            data: updateData
        });

        return NextResponse.json({ success: true, message: 'تم تحديث البيانات بنجاح' });
    } catch (error) {
        console.error('Update profile error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
