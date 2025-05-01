import { Pool, neonConfig } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-serverless';
import ws from "ws";
import * as schema from "@shared/schema";

neonConfig.webSocketConstructor = ws;

if (!process.env.DATABASE_URL) {
  throw new Error(
    "DATABASE_URL must be set. Did you forget to provision a database?",
  );
}

// For production environments, configure connection pooling
const poolConfig = process.env.NODE_ENV === 'production' 
  ? { 
      connectionString: process.env.DATABASE_URL,
      max: 10, // Maximum number of clients in the pool
      idleTimeoutMillis: 30000 // Close idle clients after 30 seconds
    }
  : { connectionString: process.env.DATABASE_URL };

export const pool = new Pool(poolConfig);
export const db = drizzle(pool, { schema });