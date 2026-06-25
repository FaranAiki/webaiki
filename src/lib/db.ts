import 'server-only';
import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import * as schema from './schema';
import { env } from './env';

const isProduction = process.env.NODE_ENV === 'production';
const connectionString = env.DIRECT_URL || env.DATABASE_URL;

/**
 * Initializes the PostgreSQL Connection Pool (Supabase).
 * 
 * I.S.: The module is invoked for the first time on the server, requiring a Pool configuration 
 *       to prevent connection leakage (opening too many connections).
 * F.S.: A dynamic `pool` is established where the maximum limit (`max`) is adjusted 
 *       based on the environment (production or development) to prevent query blockages.
 */
const globalForDb = globalThis as unknown as { conn: Pool | undefined };

const pool = globalForDb.conn ?? new Pool({
  connectionString,
  max: isProduction ? 5 : 10,
  connectionTimeoutMillis: 20000,
  idleTimeoutMillis: 30000,
  allowExitOnIdle: true,
  ssl: (isProduction || (connectionString && (connectionString.includes('supabase') || connectionString.includes('pooler')))) 
    ? { rejectUnauthorized: false } 
    : undefined
});

pool.on('error', (err) => {
  console.error('Unexpected error on idle client', err);
});

if (!isProduction) globalForDb.conn = pool;

export const db = drizzle(pool, { schema });
