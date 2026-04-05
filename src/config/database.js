import { neon, neonConfig } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-serverless';

const databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl) {
  throw new Error('DATABASE_URL is required');
}

if (process.env.NEON_LOCAL === 'true') {
  const host = process.env.NEON_LOCAL_HOST || 'neon-local';
  neonConfig.fetchEndpoint = `http://${host}:5432/sql`;
  neonConfig.useSecureWebSocket = false;
  neonConfig.poolQueryViaFetch = true;
}

const sql = neon(databaseUrl);
const db = drizzle(sql);

export default { db, sql };