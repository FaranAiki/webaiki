import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import * as schema from './schema';

const isProduction = process.env.NODE_ENV === 'production';
const connectionString = process.env.DIRECT_URL || process.env.DATABASE_URL || 'postgresql://invalid_placeholder';

const pool = new Pool({
  connectionString,
  max: isProduction ? 1 : 10,
  connectionTimeoutMillis: 10000,
  idleTimeoutMillis: 30000,
  ssl: (isProduction || (connectionString && (connectionString.includes('supabase') || connectionString.includes('pooler')))) 
    ? { rejectUnauthorized: false } 
    : undefined
});

export const db = drizzle(pool, { schema });
