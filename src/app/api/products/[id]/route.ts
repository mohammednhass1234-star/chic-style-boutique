import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const product = await prisma.product.findUnique({
            where: { id: parseInt(id) },
            include: { category: true }
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

        const deletedProduct = await prisma.product.delete({
            where: { id: parseInt(id) }
        });

        return NextResponse.json({ message: 'Product deleted successfully', product: deletedProduct });
    } catch (error) {
        console.error('Error in DELETE /api/products/[id]:', error);
        return NextResponse.json({ error: 'Failed to delete product' }, { status: 500 });
    }
}
