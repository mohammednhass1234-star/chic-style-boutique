const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
    console.log("Seeding admin user...");
    const adminEmail = 'mohammednhass1234@gmail.com';
    const adminPassword = 'Mohammed12341234';
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(adminPassword, salt);

    await prisma.admin.upsert({
        where: { email: adminEmail },
        update: { password: hashedPassword },
        create: {
            email: adminEmail,
            password: hashedPassword
        }
    });

    console.log(`Admin ${adminEmail} successfully created/updated in the cloud database.`);
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
