/* eslint-disable */
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
// Oh wait, we should use pg to connect directly since we want information_schema.
// I'll read process.env.DATABASE_URL from .env.local

import { Client } from 'pg';
import fs from 'fs';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const client = new Client({
  connectionString: process.env.DATABASE_URL
});

async function run() {
  await client.connect();
  const res = await client.query(`
    SELECT column_name, ordinal_position, data_type 
    FROM information_schema.columns 
    WHERE table_name = 'User' 
    ORDER BY ordinal_position;
  `);
  console.log(res.rows);
  await client.end();
}

run().catch(console.error);
