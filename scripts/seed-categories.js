const { PrismaClient } = require('@prisma/client');
const path = require('path');

const prisma = new PrismaClient();

async function main() {
    const categories = [
        { name: "حقائب", slug: "bags" },
        { name: "أحذية", slug: "shoes" },
        { name: "ألبسة", slug: "clothing" },
        { name: "أطفال", slug: "kids" }
    ];

    console.log("Seeding categories...");
    for (const cat of categories) {
        await prisma.category.upsert({
            where: { name: cat.name },
            update: {},
            create: cat
        });
    }
    console.log("Success! Categories seeded.");
}

main()
    .catch(e => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
