import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
async function main() {
  // Update 'Kids' (ID 4) to 'أطفال صغار'
  await prisma.category.update({
    where: { id: 4 },
    data: { name: 'أطفال صغار', slug: 'kids-junior' }
  });
  
  // Add 'أطفال كبار'
  await prisma.category.upsert({
    where: { slug: 'kids-teen' },
    update: { name: 'أطفال كبار' },
    create: { name: 'أطفال كبار', slug: 'kids-teen' }
  });

  console.log('Categories updated successfully.');
}
main().catch(console.error).finally(() => prisma.$disconnect());
