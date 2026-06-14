import { Pool, PoolConfig } from 'pg'
import { PrismaPg } from '@prisma/adapter-pg'
import { PrismaClient } from '../generated/prisma/client'

const prismaClientSingleton = (): PrismaClient => {
  // Try all possible database connection variables
  const connectionString = process.env.DIRECT_URL || 
                           process.env.DATABASE_URL || 
                           process.env.POSTGRES_URL_NON_POOLING || 
                           process.env.POSTGRES_PRISMA_URL ||
                           process.env.POSTGRES_URL;

  const isProduction = process.env.NODE_ENV === 'production';

  if (!connectionString || connectionString.trim() === '' || connectionString === 'undefined') {
    if (isProduction) {
      console.error("Critical: No database connection string found in environment variables.");
    }
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore - Prisma 7 requires arguments that might not be visible to TS in all environments
    return new PrismaClient({});
  }

  // Diagnostic for the "at base" error
  if (connectionString.toLowerCase() === 'base') {
     console.error('Critical: Connection string is literally the word "base". Check your Vercel Environment Variables.');
  } else if (connectionString.toLowerCase().includes('base') && !connectionString.includes('.')) {
     console.error(`Warning: Connection string "${connectionString}" looks like a placeholder. Host detected as "base".`);
  }

  if (isProduction) {
    try {
      console.log(`Prisma Source: ${process.env.DIRECT_URL ? 'DIRECT_URL' : process.env.DATABASE_URL ? 'DATABASE_URL' : 'OTHER'}`);
      const hostPart = connectionString.split('@')[1] || connectionString.split('://')[1] || connectionString;
      const host = hostPart.split(/[:\/\?]/)[0];
      console.log(`Prisma Host: ${host}`);
    } catch {
      // ignore logging error
    }
  }

  try {
    const poolConfig: PoolConfig = {
      connectionString,
      max: isProduction ? 1 : 10,
      connectionTimeoutMillis: 5000,
      idleTimeoutMillis: 30000,
    };

    // Supabase and many cloud providers require SSL in production
    if (isProduction || connectionString.includes('supabase.co') || connectionString.includes('pooler.supabase.com')) {
      poolConfig.ssl = { rejectUnauthorized: false };
    }

    const pool = new Pool(poolConfig);

    pool.on('error', (err) => {
      console.error('Unexpected error on idle pg client:', err.message);
    });

    const adapter = new PrismaPg(pool);
    return new PrismaClient({ adapter });
  } catch (error) {
    console.error('Failed to initialize Prisma with adapter:', error instanceof Error ? error.message : String(error));
    // Fallback to standard Prisma connection if adapter fails to even initialize
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore - Prisma 7 generated client might have incompatible types
    return new PrismaClient({ datasources: { db: { url: connectionString } } });
  }
}

declare global {
  var prisma: undefined | PrismaClient
}

const prisma = globalThis.prisma ?? prismaClientSingleton()

export default prisma

if (process.env.NODE_ENV !== 'production') globalThis.prisma = prisma

