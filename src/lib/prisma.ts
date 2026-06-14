import { Pool } from 'pg'
import { PrismaPg } from '@prisma/adapter-pg'
import { PrismaClient } from '../generated/prisma/client'

const prismaClientSingleton = (): PrismaClient => {
  const connectionString = process.env.DIRECT_URL || 
                           process.env.DATABASE_URL || 
                           process.env.POSTGRES_URL_NON_POOLING || 
                           process.env.POSTGRES_PRISMA_URL ||
                           process.env.POSTGRES_URL
  
  if (!connectionString) {
    if (process.env.NODE_ENV === 'production') {
      console.error("Critical: No database connection string found in environment variables (DATABASE_URL, DIRECT_URL, POSTGRES_URL, etc.).");
    }
    // @ts-expect-error - Prisma 7 requires arguments but we provide empty for fallback
    return new PrismaClient({})
  }

  try {
    const pool = new Pool({ 
      connectionString,
      max: 1, 
      connectionTimeoutMillis: 5000,
      idleTimeoutMillis: 30000,
    })
    
    pool.on('error', (err) => {
      console.error('Unexpected error on idle client', err)
    })

    const adapter = new PrismaPg(pool)
    return new PrismaClient({ adapter })
  } catch (error) {
    console.error('Failed to initialize Prisma with adapter:', error)
    // @ts-expect-error - Prisma 7 requires arguments
    return new PrismaClient({})
  }
}

declare global {
  var prisma: undefined | PrismaClient
}

const prisma = globalThis.prisma ?? prismaClientSingleton()

export default prisma

if (process.env.NODE_ENV !== 'production') globalThis.prisma = prisma
