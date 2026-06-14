import { Pool } from 'pg'
import { PrismaPg } from '@prisma/adapter-pg'
import { PrismaClient } from '../generated/prisma/client'

const prismaClientSingleton = (): PrismaClient => {
  const connectionString = process.env.DATABASE_URL || 'postgresql://dummy:dummy@localhost:5432/dummy'
  
  if (!process.env.DATABASE_URL && process.env.NODE_ENV === 'production') {
    console.warn("DATABASE_URL is not set. Prisma operations will fail at runtime.");
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
