import { NextResponse } from 'next/server';
import prisma from "@/lib/prisma";

export async function PATCH(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        const productId = parseInt(params.id);
        const { isOfferActive, offerExpiry } = await request.json();

        const updatedProduct = await prisma.product.update({
            where: { id: productId },
            data: {
                isOfferActive,
                offerExpiry: offerExpiry ? new Date(offerExpiry) : null
            }
        });

        return NextResponse.json(updatedProduct);
    } catch (error) {
        console.error('Error in toggle-offer:', error);
        return NextResponse.json({ error: 'Failed to toggle offer' }, { status: 500 });
    }
}
