import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function main() {
    console.log('Testing DB connection...')
    const start = Date.now()
    const count = await prisma.product.count()
    console.log(`Connection successful. Product count: ${count}`)
    console.log(`Execution time: ${Date.now() - start}ms`)
}

main()
    .catch(e => console.error('DB Error:', e))
    .finally(async () => await prisma.$disconnect())
