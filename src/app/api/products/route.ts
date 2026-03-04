import { NextResponse } from 'next/server';
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const categoryName = searchParams.get('category');
        const query = searchParams.get('q')?.toLowerCase();

        let where: any = {};

        if (categoryName) {
            where.category = { name: categoryName };
        }

        if (query) {
            where.OR = [
                { name: { contains: query, mode: 'insensitive' } },
                { description: { contains: query, mode: 'insensitive' } },
            ];
        }

        const now = new Date();

        // Fetch all to handle auto-expiration in memory or via update
        // Better: Update expired offers in DB
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

        const products = await prisma.product.findMany({
            where,
            include: { category: true },
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
        const { name, description, price, stock, categoryId, image, sizes, colors, videoUrl, instagramUrl, originalPrice, isOfferActive, offerExpiry } = body;

        // Ensure "Women" category exists (id 1 usually)
        let categoryIdToUse = categoryId || 1;

        const newProduct = await prisma.product.create({
            data: {
                name,
                description,
                price: parseFloat(price),
                originalPrice: originalPrice ? parseFloat(originalPrice) : null,
                isOfferActive: isOfferActive || false,
                offerExpiry: offerExpiry ? new Date(offerExpiry) : null,
                stock: parseInt(stock),
                categoryId: parseInt(categoryIdToUse),
                image,
                sizes,
                colors,
                videoUrl,
                instagramUrl,
            },
            include: { category: true }
        });

        return NextResponse.json(newProduct, { status: 201 });
    } catch (error) {
        console.error('Error in POST /api/products:', error);
        return NextResponse.json({ error: 'Failed to create product' }, { status: 500 });
    }
}
