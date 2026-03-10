import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function PATCH(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const orderId = parseInt(id);
        const body = await request.json();

        const updatedOrder = await prisma.order.update({
            where: { id: orderId },
            data: { status: body.status }
        });

        return NextResponse.json(updatedOrder);
    } catch (error) {
        console.error('Error in PATCH /api/orders/[id]:', error);
        return NextResponse.json({ error: 'Failed to update order' }, { status: 500 });
    }
}

export async function DELETE(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const orderId = parseInt(id);

        await prisma.orderItem.deleteMany({
            where: { orderId }
        });

        const deletedOrder = await prisma.order.delete({
            where: { id: orderId }
        });

        return NextResponse.json({ message: 'Order deleted successfully', order: deletedOrder });
    } catch (error) {
        console.error('Error in DELETE /api/orders/[id]:', error);
        return NextResponse.json({ error: 'Failed to delete order' }, { status: 500 });
    }
}
