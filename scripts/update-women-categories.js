const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    const categories = [
        { name: 'أحذية', slug: 'shoes' },
        { name: 'معاطف', slug: 'coats' },
        { name: 'كيتما', slug: 'tracksuits' },
        { name: 'بيجامات', slug: 'pyjamas' }
    ];

    console.log('Updating categories for women section...');

    for (const cat of categories) {
        await prisma.category.upsert({
            where: { slug: cat.slug },
            update: { name: cat.name, section: 'women' },
            create: { name: cat.name, slug: cat.slug, section: 'women' }
        });
        console.log(`Upserted category: ${cat.name} (${cat.slug})`);
    }

    // List all categories for women to see the result
    const allWomenCats = await prisma.category.findMany({
        where: { section: 'women' }
    });
    console.log('Current Women Categories:', JSON.stringify(allWomenCats, null, 2));

    // Cleanup old ones if needed? User didn't ask but it's cleaner. 
    // Wait, let's just leave them for now to avoid breaking anything if products ARE associated.
}

main().catch(console.error).finally(() => prisma.$disconnect());
