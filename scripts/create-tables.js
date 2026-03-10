const { PrismaClient } = require('@prisma/client');

async function main() {
  const prisma = new PrismaClient({
    datasources: {
      db: {
        url: process.env.DATABASE_URL
      }
    }
  });

  const sqls = [
    `CREATE TABLE "Category" (
        "id" SERIAL NOT NULL,
        "name" TEXT NOT NULL,
        "slug" TEXT NOT NULL,
        CONSTRAINT "Category_pkey" PRIMARY KEY ("id")
    );`,
    `CREATE TABLE "Product" (
        "id" SERIAL NOT NULL,
        "name" TEXT NOT NULL,
        "description" TEXT NOT NULL,
        "price" DOUBLE PRECISION NOT NULL,
        "image" TEXT,
        "stock" INTEGER NOT NULL DEFAULT 0,
        "sizes" TEXT,
        "colors" TEXT,
        "videoUrl" TEXT,
        "instagramUrl" TEXT,
        "originalPrice" DOUBLE PRECISION,
        "isOfferActive" BOOLEAN NOT NULL DEFAULT false,
        "offerExpiry" TIMESTAMP(3),
        "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" TIMESTAMP(3) NOT NULL,
        "categoryId" INTEGER,
        CONSTRAINT "Product_pkey" PRIMARY KEY ("id")
    );`,
    `CREATE TABLE "Order" (
        "id" SERIAL NOT NULL,
        "customerName" TEXT NOT NULL,
        "customerPhone" TEXT NOT NULL,
        "customerAddress" TEXT NOT NULL,
        "customerCity" TEXT NOT NULL,
        "total" DOUBLE PRECISION NOT NULL,
        "status" TEXT NOT NULL DEFAULT 'pending',
        "paymentMethod" TEXT NOT NULL DEFAULT 'COD',
        "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" TIMESTAMP(3) NOT NULL,
        CONSTRAINT "Order_pkey" PRIMARY KEY ("id")
    );`,
    `CREATE TABLE "OrderItem" (
        "id" SERIAL NOT NULL,
        "orderId" INTEGER NOT NULL,
        "productId" INTEGER NOT NULL,
        "quantity" INTEGER NOT NULL,
        "price" DOUBLE PRECISION NOT NULL,
        CONSTRAINT "OrderItem_pkey" PRIMARY KEY ("id")
    );`,
    `CREATE TABLE "Admin" (
        "id" SERIAL NOT NULL,
        "email" TEXT NOT NULL,
        "password" TEXT NOT NULL,
        "resetToken" TEXT,
        "resetTokenExpiry" TIMESTAMP(3),
        "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" TIMESTAMP(3) NOT NULL,
        CONSTRAINT "Admin_pkey" PRIMARY KEY ("id")
    );`,
    `CREATE TABLE "Setting" (
        "id" SERIAL NOT NULL,
        "key" TEXT NOT NULL,
        "value" TEXT NOT NULL,
        CONSTRAINT "Setting_pkey" PRIMARY KEY ("id")
    );`,
    `CREATE UNIQUE INDEX "Category_name_key" ON "Category"("name");`,
    `CREATE UNIQUE INDEX "Category_slug_key" ON "Category"("slug");`,
    `CREATE UNIQUE INDEX "Admin_email_key" ON "Admin"("email");`,
    `CREATE UNIQUE INDEX "Admin_resetToken_key" ON "Admin"("resetToken");`,
    `CREATE UNIQUE INDEX "Setting_key_key" ON "Setting"("key");`,
    `ALTER TABLE "Product" ADD CONSTRAINT "Product_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category"("id") ON DELETE SET NULL ON UPDATE CASCADE;`,
    `ALTER TABLE "OrderItem" ADD CONSTRAINT "OrderItem_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;`,
    `ALTER TABLE "OrderItem" ADD CONSTRAINT "OrderItem_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order"("id") ON DELETE RESTRICT ON UPDATE CASCADE;`
  ];

  try {
    console.log('Starting manual table creation...');
    for (const sql of sqls) {
      console.log('Executing:', sql.substring(0, 50) + '...');
      try {
        await prisma.$executeRawUnsafe(sql);
      } catch (e) {
        if (e.message.includes('already exists')) {
          console.log('Skipping (already exists)');
        } else {
          throw e;
        }
      }
    }
    console.log('TABLES CREATED SUCCESSFULLY!');
  } catch (error) {
    console.error('CREATION FAILED:');
    console.error(error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
