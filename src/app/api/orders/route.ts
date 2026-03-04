import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
    try {
        const orders = await prisma.order.findMany({
            include: { items: { include: { product: true } } },
            orderBy: { createdAt: 'desc' }
        });
        return NextResponse.json(orders);
    } catch (error) {
        console.error('Error fetching orders:', error);
        return NextResponse.json({ error: 'Failed to fetch orders' }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { customerName, customerPhone, customerAddress, items, total } = body;

        const newOrder = await prisma.order.create({
            data: {
                customerName,
                customerPhone,
                customerAddress,
                customerCity: "Fes", // Default
                total: parseFloat(total),
                status: 'قيد المراجعة',
                items: {
                    create: items.map((item: any) => ({
                        productId: parseInt(item.id),
                        quantity: parseInt(item.quantity || 1),
                        price: parseFloat(item.price)
                    }))
                }
            },
            include: { items: true }
        });

        return NextResponse.json(newOrder, { status: 201 });
    } catch (error) {
        console.error('Error in POST /api/orders:', error);
        return NextResponse.json({ error: 'Failed to create order' }, { status: 500 });
    }
}
