import { Pool } from 'pg'
import { PrismaPg } from '@prisma/adapter-pg'
import { PrismaClient } from '../generated/prisma/client'

const prismaClientSingleton = (): PrismaClient => {
  const connectionString = process.env.DIRECT_URL || process.env.DATABASE_URL
  
  if (!connectionString) {
    if (process.env.NODE_ENV === 'production') {
      console.warn("DATABASE_URL or DIRECT_URL is not set. Prisma operations will fail at runtime.");
    }
    // @ts-expect-error - Prisma 7 requires arguments but we provide empty for fallback
    return new PrismaClient({})
  }

  const pool = new Pool({ 
    connectionString,
    max: 1, 
    connectionTimeoutMillis: 5000,
  })
  const adapter = new PrismaPg(pool)
  return new PrismaClient({ adapter })
}

declare global {
  var prisma: undefined | PrismaClient
}

const prisma = globalThis.prisma ?? prismaClientSingleton()

export default prisma

if (process.env.NODE_ENV !== 'production') globalThis.prisma = prisma
