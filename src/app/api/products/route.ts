import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const query = searchParams.get('q')?.toLowerCase();
        const categoryId = searchParams.get('categoryId');

        let where: any = {};

        if (query) {
            where.OR = [
                { name: { contains: query, mode: 'insensitive' } },
                { description: { contains: query, mode: 'insensitive' } },
            ];
        }

        if (categoryId) {
            where.categoryId = parseInt(categoryId);
        }

        const now = new Date();

        // Gracefully attempt to update expired offers
        try {
            await prisma.product.updateMany({
                where: {
                    isOfferActive: true,
                    offerExpiry: { lt: now }
                },
                data: {
                    isOfferActive: false,
                    offerExpiry: null
                }
            });
        } catch (updateError) {
            console.warn('Background offer update failed (likely read-only DB):', updateError);
        }

        const products = await prisma.product.findMany({
            where,
            orderBy: { createdAt: 'desc' }
        });

        return NextResponse.json(products);
    } catch (error) {
        console.error('Error in GET /api/products:', error);
        return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const {
            name,
            description,
            price,
            stock,
            image,
            sizes,
            colors,
            videoUrl,
            instagramUrl,
            originalPrice,
            isOfferActive,
            offerExpiry,
            categoryId
        } = body;

        // Validation
        if (!name || !price || !image) {
            return NextResponse.json(
                { error: 'Missing required fields: name, price, or image' },
                { status: 400 }
            );
        }

        const parsedPrice = parseFloat(price);
        if (isNaN(parsedPrice)) {
            return NextResponse.json({ error: 'Invalid price format' }, { status: 400 });
        }

        const parsedStock = parseInt(stock || '0');
        const parsedCategoryId = categoryId ? parseInt(categoryId) : null;

        const newProduct = await prisma.product.create({
            data: {
                name,
                description: description || '',
                price: parsedPrice,
                originalPrice: originalPrice ? parseFloat(originalPrice) : null,
                isOfferActive: !!isOfferActive,
                offerExpiry: offerExpiry ? new Date(offerExpiry) : null,
                stock: isNaN(parsedStock) ? 0 : parsedStock,
                image,
                sizes: sizes || '',
                colors: colors || '',
                videoUrl: videoUrl || '',
                instagramUrl: instagramUrl || '',
                categoryId: parsedCategoryId,
            }
        });

        return NextResponse.json(newProduct, { status: 201 });
    } catch (error) {
        console.error('Error in POST /api/products:', error);
        return NextResponse.json({ error: 'Failed to create product. Make sure all fields are valid.' }, { status: 500 });
    }
}
