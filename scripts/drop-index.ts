
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    try {
        console.log('Dropping unique constraint Category_name_key...');
        await prisma.$executeRawUnsafe('DROP INDEX IF EXISTS "Category_name_key"');
        console.log('Done.');
    } catch (err) {
        console.error('Failed:', err.message);
    } finally {
        await prisma.$disconnect();
    }
}

main();
