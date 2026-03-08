import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { hashPassword } from '@/lib/auth';

export async function GET() {
    try {
        const adminEmail = 'mohammednhass1234@gmail.com';
        const adminPassword = 'Mohammed12341234';
        const hashedPassword = await hashPassword(adminPassword);

        // Upsert the admin user
        await prisma.admin.upsert({
            where: { email: adminEmail },
            update: { password: hashedPassword },
            create: {
                email: adminEmail,
                password: hashedPassword
            }
        });

        return NextResponse.json({
            success: true,
            message: "Admin account initialized successfully. You can now log in."
        });
    } catch (error: any) {
        console.error('Init error:', error);
        return NextResponse.json({
            success: false,
            error: error.message
        }, { status: 500 });
    }
}
