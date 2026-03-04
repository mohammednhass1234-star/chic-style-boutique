import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function DELETE(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const orderId = parseInt(id);

        // Delete order items first due to foreign key constraints if not cascaded
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
