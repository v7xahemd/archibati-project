import { Pool, neonConfig } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-serverless';
import ws from "ws";
import * as schema from "@shared/schema";

neonConfig.webSocketConstructor = ws;

// Get database URL from environment, with Railway URL as fallback
const databaseUrl = process.env.DATABASE_URL || "postgresql://postgres:zKdrTbmvDILHCySpHOZDpxlECrfKttCv@junction.proxy.rlwy.net:45187/railway";

if (!databaseUrl) {
  throw new Error(
    "DATABASE_URL must be set. Did you forget to provision a database?",
  );
}

export const pool = new Pool({ connectionString: databaseUrl });
export const db = drizzle({ client: pool, schema });