const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    const requestedSlugs = ['shoes', 'coats', 'tracksuits', 'pyjamas'];
    
    console.log('Cleaning up unused women categories...');

    const deleted = await prisma.category.deleteMany({
        where: {
            section: 'women',
            slug: {
                notIn: requestedSlugs
            }
        }
    });

    console.log(`Deleted ${deleted.count} unused categories.`);
}

main().catch(console.error).finally(() => prisma.$disconnect());
