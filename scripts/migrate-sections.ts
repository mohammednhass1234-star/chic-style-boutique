
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  console.log('Migrating categories and products to new section-based hierarchy...');

  try {
    // 1. Create or Update Categories for Women
    const womenCategories = [
      { name: 'حقائب', slug: 'bags' },
      { name: 'أحذية', slug: 'shoes' },
      { name: 'فساتين', slug: 'dresses' },
      { name: 'منتوجات', slug: 'women-products' }
    ];

    for (const cat of womenCategories) {
      await prisma.category.upsert({
        where: { slug: cat.slug },
        update: { section: 'women', name: cat.name },
        create: { ...cat, section: 'women' }
      });
    }

    // 2. Create or Update Categories for Kids
    const kidsCategories = [
      { name: 'أحذية', slug: 'kids-shoes' },
      { name: 'ملابس', slug: 'kids-clothing' }
    ];

    for (const cat of kidsCategories) {
      await prisma.category.upsert({
        where: { slug: cat.slug },
        update: { section: 'kids', name: cat.name },
        create: { ...cat, section: 'kids' }
      });
    }

    // 3. Migrate existing products
    // Products in 'kids-junior' or 'kids-teen' -> section 'kids'
    const kidsCategorySlugs = ['kids-junior', 'kids-teen'];
    const kidsProducts = await prisma.product.findMany({
      where: {
        category: {
          slug: { in: kidsCategorySlugs }
        }
      }
    });

    console.log(`Found ${kidsProducts.length} kids products to migrate.`);

    // Map old kids categories to new ones if needed, or just set section
    for (const prod of kidsProducts) {
      // Find original category to guess if it's shoes or clothing
      const oldCat = await prisma.category.findUnique({ where: { id: prod.categoryId || 0 } });
      let newSlug = 'kids-clothing';
      if (prod.subCategory === 'shoes' || oldCat?.name.includes('أحذية')) {
        newSlug = 'kids-shoes';
      }

      const newCat = await prisma.category.findUnique({ where: { slug: newSlug } });

      await prisma.product.update({
        where: { id: prod.id },
        data: {
          section: 'kids',
          categoryId: newCat?.id
        }
      });
    }

    // Products in women categories
    const womenCategorySlugs = ['bags', 'shoes', 'clothing']; // 'clothing' might need renaming to 'dresses' or kept
    const womenProducts = await prisma.product.findMany({
      where: {
        OR: [
          { categoryId: null },
          { category: { slug: { in: womenCategorySlugs } } }
        ],
        NOT: {
            id: { in: kidsProducts.map(p => p.id) }
        }
      }
    });

    console.log(`Found ${womenProducts.length} women products to migrate.`);

    for (const prod of womenProducts) {
      await prisma.product.update({
        where: { id: prod.id },
        data: { section: 'women' }
      });
    }

    // Cleanup old kids categories if empty
    for (const slug of kidsCategorySlugs) {
        try {
            await prisma.category.delete({ where: { slug } });
            console.log(`Deleted old category: ${slug}`);
        } catch (e) {
            console.log(`Could not delete ${slug} (might have products):`, e.message);
        }
    }

    console.log('Migration completed successfully.');
  } catch (error) {
    console.error('Migration failed:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
