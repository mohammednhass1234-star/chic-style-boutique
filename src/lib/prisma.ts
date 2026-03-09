import { PrismaClient } from '@prisma/client';

declare global {
    var prisma: PrismaClient | undefined;
}

const getDatabaseUrl = () => {
    if (process.env.DATABASE_URL) return process.env.DATABASE_URL;

    // In Vercel/Production, the path might be different. Absolute path usually works better.
    const path = require('path');
    const dbPath = path.join(process.cwd(), 'prisma', 'dev.db');
    return `file:${dbPath}`;
};

export const prisma = global.prisma || new PrismaClient({
    datasources: {
        db: {
            url: getDatabaseUrl()
        }
    }
});

if (process.env.NODE_ENV !== 'production') global.prisma = prisma;
