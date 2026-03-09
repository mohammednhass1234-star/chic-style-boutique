const { PrismaClient } = require('@prisma/client');
const path = require('path');

const dbPath = path.join(__dirname, '..', 'prisma', 'dev.db');
const prisma = new PrismaClient({
    datasources: {
        db: {
            url: `file:${dbPath}`
        }
    }
});

async function main() {
    try {
        console.log("Attempting to delete product with ID 1...");
        const deletedProduct = await prisma.product.delete({
            where: { id: 1 }
        });
        console.log("Success! Product deleted:", deletedProduct.name);
    } catch (error) {
        console.error("FAILURE:", error);
    } finally {
        await prisma.$disconnect();
    }
}

main();
