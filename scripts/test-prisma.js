const { PrismaClient } = require('@prisma/client');

async function main() {
  const prisma = new PrismaClient({
    datasources: {
      db: {
        url: process.env.DATABASE_URL
      }
    }
  });

  try {
    console.log('Attempting to connect to:', process.env.DATABASE_URL.replace(/:[^:@]+@/, ':****@'));
    await prisma.$connect();
    console.log('CONNECTED SUCCESSFULLY!');
    const tables = await prisma.$queryRaw`SELECT table_name FROM information_schema.tables WHERE table_schema = 'public'`;
    console.log('Tables in public schema:', tables);
  } catch (error) {
    console.error('CONNECTION FAILED:');
    console.error(error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
