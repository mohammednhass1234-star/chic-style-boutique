const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    const counts = await prisma.product.groupBy({
        by: ['categoryId'],
        _count: {
            id: true
        },
        where: {
            section: 'women'
        }
    });

    const categories = await prisma.category.findMany({
        where: { section: 'women' }
    });

    const results = categories.map(cat => ({
        ...cat,
        count: counts.find(c => c.categoryId === cat.id)?._count.id || 0
    }));

    console.log(JSON.stringify(results, null, 2));
}

main().catch(console.error).finally(() => prisma.$disconnect());
