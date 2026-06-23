import 'server-only';
import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import * as schema from './schema';
import { env } from './env';

const isProduction = process.env.NODE_ENV === 'production';
const connectionString = env.DIRECT_URL || env.DATABASE_URL;

const pool = new Pool({
  connectionString,
  max: isProduction ? 5 : 10,
  connectionTimeoutMillis: 10000,
  idleTimeoutMillis: 30000,
  ssl: (isProduction || (connectionString && (connectionString.includes('supabase') || connectionString.includes('pooler')))) 
    ? { rejectUnauthorized: false } 
    : undefined
});

export const db = drizzle(pool, { schema });
