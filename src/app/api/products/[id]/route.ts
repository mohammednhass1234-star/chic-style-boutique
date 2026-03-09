import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const product = await prisma.product.findUnique({
            where: { id: parseInt(id) }
        });

        if (!product) {
            return NextResponse.json({ error: 'Product not found' }, { status: 404 });
        }

        return NextResponse.json(product);
    } catch (error) {
        console.error('Error in GET /api/products/[id]:', error);
        return NextResponse.json({ error: 'Failed to fetch product' }, { status: 500 });
    }
}

export async function DELETE(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const productId = parseInt(id);

        if (isNaN(productId)) {
            return NextResponse.json({ error: 'ID منتج غير صالح' }, { status: 400 });
        }

        // Check if product has orders
        const orderCount = await prisma.orderItem.count({
            where: { productId }
        });

        if (orderCount > 0) {
            return NextResponse.json({
                error: 'لا يمكن حذف هذا المنتج لأنه مرتبط بطلبات شراء سابقة. يمكنك إخفاؤه بدلاً من حذفه.',
                code: 'HAS_ORDERS'
            }, { status: 400 });
        }

        const deletedProduct = await prisma.product.delete({
            where: { id: productId }
        });

        return NextResponse.json({ message: 'تم حذف المنتج بنجاح', product: deletedProduct });
    } catch (error: any) {
        console.error('Error in DELETE /api/products/[id]:', error);

        if (error.code === 'P2025') {
            return NextResponse.json({ error: 'هذا المنتج غير موجود أصلاً أو تم حذفه مسبقاً.' }, { status: 404 });
        }

        return NextResponse.json({
            error: 'فشل في حذف المنتج من قاعدة البيانات',
            details: error.message || String(error)
        }, { status: 500 });
    }
}
