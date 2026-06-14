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
    // @ts-ignore
    return new PrismaClient({});
  }

  if (connectionString.toLowerCase() === 'base' || connectionString.trim() === 'base') {
     console.error('CRITICAL: DATABASE_URL is literally set to "base". Please check Vercel environment variables.');
     // Do not return here, let it try and fail with a better error
  }

  if (isProduction) {
    try {
      const urlSource = process.env.DIRECT_URL ? 'DIRECT_URL' : 
                        process.env.DATABASE_URL ? 'DATABASE_URL' : 
                        process.env.POSTGRES_URL_NON_POOLING ? 'POSTGRES_URL_NON_POOLING' : 'OTHER';

      console.log(`Prisma Source: ${urlSource}`);
      const hostPart = connectionString.split('@')[1] || connectionString.split('://')[1] || connectionString;
      const host = hostPart.split(/[:\/\?]/)[0];
      console.log(`Prisma Host: ${host}`);
    } catch {
      // ignore logging error
    }
  }

  // Try to use the adapter for better performance in serverless
  try {
    const poolConfig: PoolConfig = {
      connectionString,
      max: isProduction ? 1 : 10,
      connectionTimeoutMillis: 10000, // Increased timeout
      idleTimeoutMillis: 30000,
    };

    if (isProduction || connectionString.includes('supabase') || connectionString.includes('pooler')) {
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
