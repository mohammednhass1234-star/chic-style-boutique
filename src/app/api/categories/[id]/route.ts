import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function DELETE(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const categoryId = parseInt(id);

        // Delete related products first if needed, or rely on cascade if configured
        // For simplicity, we'll try to delete directly. 
        // Note: Prisma might error if there are associated products.

        await prisma.category.delete({
            where: { id }
        });

        return NextResponse.json({ message: 'Category deleted successfully' });
    } catch (error) {
        console.error('Error deleting category:', error);
        return NextResponse.json({ error: 'Failed to delete category. It might have products associated with it.' }, { status: 500 });
    }
}
