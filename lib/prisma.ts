import { PrismaClient } from '@prisma/client'

// ✅ Temporary fallback for DATABASE_URL missing in Vercel
if (!process.env.DATABASE_URL) {
  process.env.DATABASE_URL =
    'postgresql://postgres:0t9HYmnNwnyzXEgh@db.aozigwmupsuospytwlas.supabase.co:5432/postgres'
  console.warn('⚠️ DATABASE_URL fallback in use (temporary)')
}

const globalForPrisma = global as unknown as { prisma: PrismaClient }

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    log: ['error', 'warn'],
  })

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma
