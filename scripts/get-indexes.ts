
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    try {
        console.log('Listing all indexes on Category table...');
        const result = await prisma.$queryRaw`
            SELECT indexname, indexdef
            FROM pg_indexes
            WHERE tablename = 'Category';
        `;
        console.log(JSON.stringify(result, null, 2));
    } catch (err) {
        console.error('Failed to fetch indexes:', err.message);
    } finally {
        await prisma.$disconnect();
    }
}

main();
