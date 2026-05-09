const { PrismaClient } = require('@prisma/client')

const globalForPrisma = globalThis as unknown as { prisma: typeof PrismaClient }

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    datasourceUrl: process.env.MONGODB_URI,
  })

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma

export default prisma
