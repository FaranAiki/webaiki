import { Pool, PoolConfig } from 'pg'
import { PrismaPg } from '@prisma/adapter-pg'
import { PrismaClient } from '../generated/prisma/client'

const prismaClientSingleton = (): PrismaClient => {
  const isProduction = process.env.NODE_ENV === 'production';
  
  const connectionString = process.env.DIRECT_URL || 
                           process.env.DATABASE_URL || 
                           process.env.POSTGRES_URL_NON_POOLING || 
                           process.env.POSTGRES_URL;

  let effectiveConnectionString = connectionString;

  if (!effectiveConnectionString || effectiveConnectionString.trim() === '' || effectiveConnectionString === 'base') {
    if (isProduction) {
      console.error("CRITICAL: Database connection string is missing or invalid ('base'). Check Vercel Env Vars.");
    }
    effectiveConnectionString = "postgresql://invalid_placeholder_check_env_vars";
  }

  try {
    const poolConfig: PoolConfig = {
      connectionString: effectiveConnectionString,
      max: isProduction ? 1 : 10,
      connectionTimeoutMillis: 10000,
      idleTimeoutMillis: 30000,
    };

    if (isProduction || (effectiveConnectionString && (effectiveConnectionString.includes('supabase') || effectiveConnectionString.includes('pooler')))) {
      poolConfig.ssl = { rejectUnauthorized: false };
    }

    const pool = new Pool(poolConfig);
    const adapter = new PrismaPg(pool);
    
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    return new PrismaClient({ adapter });
  } catch (error) {
    console.error('Failed to initialize Prisma with adapter:', error);
    try {
      const fallbackPool = new Pool({
        connectionString: "postgresql://invalid_placeholder_check_env_vars",
        connectionTimeoutMillis: 1000,
      });
      const fallbackAdapter = new PrismaPg(fallbackPool);
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      return new PrismaClient({ adapter: fallbackAdapter });
    } catch (fallbackError) {
      console.error('Failed to initialize fallback Prisma adapter:', fallbackError);
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      return new PrismaClient({});
    }
  }
}

declare global {
  var prisma: undefined | PrismaClient
}

const prisma = globalThis.prisma ?? prismaClientSingleton()

export default prisma

if (process.env.NODE_ENV !== 'production') globalThis.prisma = prisma
