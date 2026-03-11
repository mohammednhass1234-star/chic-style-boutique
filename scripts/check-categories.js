const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    try {
        const categories = await prisma.category.findMany({
            where: { section: 'women' }
        });
        console.log(JSON.stringify(categories, null, 2));
    } catch (e) {
        console.error(e);
    } finally {
        await prisma.$disconnect();
    }
}

main();
