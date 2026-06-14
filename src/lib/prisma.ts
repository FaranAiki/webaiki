import { Pool, PoolConfig } from 'pg'
import { PrismaPg } from '@prisma/adapter-pg'
import { PrismaClient } from '../generated/prisma/client'

const prismaClientSingleton = (): PrismaClient => {
  const isProduction = process.env.NODE_ENV === 'production';
  
  const connectionString = process.env.DIRECT_URL || 
                           process.env.DATABASE_URL || 
                           process.env.POSTGRES_URL_NON_POOLING || 
                           process.env.POSTGRES_URL;

  if (!connectionString || connectionString.trim() === '' || connectionString === 'base') {
    if (isProduction) {
      console.error("CRITICAL: Database connection string is missing or invalid ('base'). Check Vercel Env Vars.");
    }
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    return new PrismaClient({});
  }

  try {
    const poolConfig: PoolConfig = {
      connectionString,
      max: isProduction ? 1 : 10,
      connectionTimeoutMillis: 10000,
      idleTimeoutMillis: 30000,
    };

    if (isProduction || connectionString.includes('supabase') || connectionString.includes('pooler')) {
      poolConfig.ssl = { rejectUnauthorized: false };
    }

    const pool = new Pool(poolConfig);
    const adapter = new PrismaPg(pool);
    
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    return new PrismaClient({ adapter });
  } catch (error) {
    console.error('Failed to initialize Prisma with adapter, falling back to engine:', error);
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    return new PrismaClient({});
  }
}

declare global {
  var prisma: undefined | PrismaClient
}

const prisma = globalThis.prisma ?? prismaClientSingleton()

export default prisma

if (process.env.NODE_ENV !== 'production') globalThis.prisma = prisma
