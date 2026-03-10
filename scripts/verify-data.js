const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    const products = await prisma.product.findMany();
    const categories = await prisma.category.findMany();
    console.log(`Found ${categories.length} categories and ${products.length} products.`);
    if (products.length > 0) {
        console.log(`First product: ${products[0].name}`);
    }
}

main()
  .catch(e => console.error(e))
  .finally(() => prisma.$disconnect());
