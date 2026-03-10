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
                    create: items.map((item: any) => {
                        // Robust price parsing (handle strings with "درهم" or "DH")
                        let cleanPrice = 0;
                        if (typeof item.price === 'string') {
                            cleanPrice = parseFloat(item.price.replace(/[^\d.]/g, '')) || 0;
                        } else {
                            cleanPrice = parseFloat(item.price) || 0;
                        }

                        return {
                            productId: parseInt(item.productId || item.id),
                            quantity: parseInt(item.quantity || 1),
                            price: cleanPrice,
                            name: item.name || "",
                            size: item.size || "",
                            color: item.color || ""
                        };
                    })
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
