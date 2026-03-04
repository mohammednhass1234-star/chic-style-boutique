const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
    // Create Categories
    const women = await prisma.category.upsert({
        where: { name: 'النساء' },
        update: {},
        create: { name: 'النساء' },
    })

    const children = await prisma.category.upsert({
        where: { name: 'الأطفال' },
        update: {},
        create: { name: 'الأطفال' },
    })

    // Sample Products for Women
    const womenProducts = [
        {
            name: 'فستان سهرة زهري',
            description: 'فستان سهرة أنيق بلون وردي فاتح، مثالي للمناسبات الخاصة.',
            price: 450.0,
            categoryId: women.id,
            sizes: 'S,M,L,XL',
            colors: 'وردي,بيج',
            stock: 10,
        },
        {
            name: 'جاكيت شتوي كلاسيكي',
            description: 'جاكيت شتوي طويل يوفر الدفء والأناقة في آن واحد.',
            price: 550.0,
            categoryId: women.id,
            sizes: 'M,L,XL',
            colors: 'أسود,بني',
            stock: 5,
        },
    ]

    // Sample Products for Children
    const childrenProducts = [
        {
            name: 'طقم ولادي صيفي',
            description: 'طقم مريح مكون من قطعتين، مثالي للعب والحركة.',
            price: 180.0,
            categoryId: children.id,
            sizes: '2Y,4Y,6Y',
            colors: 'أزرق,أبيض',
            stock: 15,
        },
        {
            name: 'فستان بناتي رقيق',
            description: 'فستان قطني ناعم بتصاميم زهور جميلة.',
            price: 220.0,
            categoryId: children.id,
            sizes: '3Y,5Y,7Y',
            colors: 'أصفر,وردي',
            stock: 12,
        },
    ]

    for (const p of [...womenProducts, ...childrenProducts]) {
        await prisma.product.create({ data: p })
    }

    console.log('Seeding finished.')
}

main()
    .catch((e) => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
