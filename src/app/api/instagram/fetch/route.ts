import { NextResponse } from 'next/server';

export async function POST(request: Request) {
    try {
        const { url } = await request.json();

        if (!url || !url.includes('instagram.com')) {
            return NextResponse.json({ error: 'من فضلك أدخل رابط إنستقرام صحيح' }, { status: 400 });
        }

        // Clean URL to handle tracking parameters
        const cleanUrl = url.split('?')[0];
        
        const response = await fetch(cleanUrl, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
            },
        });

        if (!response.ok) {
            throw new Error('Failed to fetch Instagram page');
        }

        const html = await response.text();

        // Extract og:image
        const imageMatch = html.match(/<meta[^>]*property="og:image"[^>]*content="([^"]*)"/i);
        let image = imageMatch ? imageMatch[1] : null;

        // Convert image to base64 to avoid hotlinking protection and for permanent storage
        if (image) {
            try {
                const imgRes = await fetch(image);
                const buffer = await imgRes.arrayBuffer();
                const contentType = imgRes.headers.get('content-type') || 'image/jpeg';
                const base64 = Buffer.from(buffer).toString('base64');
                image = `data:${contentType};base64,${base64}`;
            } catch (e) {
                console.warn('Failed to convert IG image to base64, using direct URL:', e);
            }
        }

        // Extract og:description (Caption)
        const descMatch = html.match(/<meta[^>]*property="og:description"[^>]*content="([^"]*)"/i);
        let description = descMatch ? descMatch[1] : '';

        // Clean up description (IG often adds "on Instagram: ..." at the end)
        description = description.split('on Instagram:')[0].trim();
        // Remove "Like, Comment, Share..." if present
        description = description.split('Like,')[0].trim();

        // Extract name from first line or first sentence
        const firstLine = description.split('\n')[0].split('.')[0].trim();
        const name = firstLine.length > 50 ? firstLine.substring(0, 50) + '...' : firstLine;

        // Try to extract price from description
        const priceMatch = description.match(/(\d+(?:\.\d+)?)\s*(?:DH|درهم|Dhs|د)/i);
        const price = priceMatch ? priceMatch[1] : '';

        // Extract sizes (Common patterns like S, M, L, XL, XXL or numbers)
        const sizesMatch = description.match(/(?:مقاسات|sizes?|taille?|Taille):\s*([^\n|]*)/i);
        const sizes = sizesMatch ? sizesMatch[1].trim() : '';

        // Extract colors
        const colorsMatch = description.match(/(?:ألوان|colors?|couleurs?):\s*([^\n|]*)/i);
        const colors = colorsMatch ? colorsMatch[1].trim() : '';

        // Only return videoUrl if we found a real direct link
        const videoMatch = html.match(/<meta[^>]*property="og:video"[^>]*content="([^"]*)"/i);
        const videoUrl = videoMatch ? videoMatch[1] : null;

        return NextResponse.json({
            name,
            image,
            description,
            price,
            sizes,
            colors,
            videoUrl,
            success: true
        });

    } catch (error) {
        console.error('Instagram fetch error:', error);
        return NextResponse.json({ error: 'عذراً، فشل جلب البيانات. قد يكون المنشور خاصاً أو يتطلب تسجيل دخول.' }, { status: 500 });
    }
}
