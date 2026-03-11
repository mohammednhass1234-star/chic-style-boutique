
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    try {
        console.log('Fetching database constraints for Category table...');
        const result = await prisma.$queryRaw`
            SELECT conname
            FROM pg_constraint
            JOIN pg_class ON pg_class.oid = pg_constraint.conrelid
            WHERE relname = 'Category';
        `;
        console.log(JSON.stringify(result, null, 2));
    } catch (err) {
        console.error('Failed to fetch constraints:', err.message);
    } finally {
        await prisma.$disconnect();
    }
}

main();
