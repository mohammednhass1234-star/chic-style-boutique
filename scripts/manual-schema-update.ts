
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    try {
        console.log('Adding section columns via raw SQL...');
        
        // Add section to Product
        try {
            await prisma.$executeRaw`ALTER TABLE "Product" ADD COLUMN IF NOT EXISTS "section" TEXT DEFAULT 'women'`;
            console.log('Added section to Product table.');
        } catch (e) {
            console.log('Product section column might already exist or error:', e.message);
        }

        // Add section to Category
        try {
            await prisma.$executeRaw`ALTER TABLE "Category" ADD COLUMN IF NOT EXISTS "section" TEXT DEFAULT 'women'`;
            console.log('Added section to Category table.');
        } catch (e) {
            console.log('Category section column might already exist or error:', e.message);
        }

        // Remove unique constraint from Category name (if possible via raw SQL)
        try {
            await prisma.$executeRaw`ALTER TABLE "Category" DROP CONSTRAINT IF EXISTS "Category_name_key"`;
            console.log('Dropped unique constraint from Category name.');
        } catch (e) {
            console.log('Could not drop Category_name_key (might not exist or different name):', e.message);
        }

        console.log('Schema update completed!');
    } catch (err) {
        console.error('Raw SQL migration failed:', err.message);
    } finally {
        await prisma.$disconnect();
    }
}

main();
