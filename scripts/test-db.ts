
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function test() {
    try {
        console.log('Attempting to connect to database...');
        await prisma.$connect();
        console.log('Successfully connected to database!');
        const count = await prisma.product.count();
        console.log('Product count:', count);
    } catch (err) {
        console.error('Connection failed:', err.message);
    } finally {
        await prisma.$disconnect();
    }
}

test();
