import { Pool, neonConfig } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-serverless';
import ws from "ws";
import * as schema from "@shared/schema";

// Configuration nécessaire pour Neon Database sur Render
neonConfig.webSocketConstructor = ws;

// Vérification de la présence de l'URL de la base de données
if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL is required for database connection");
}

// Configuration de la connexion avec support SSL pour Render
const config = {
  connectionString: process.env.DATABASE_URL,
  ssl: true, // Toujours utiliser SSL sur Render
  max: 20, // Nombre maximum de clients dans le pool
  idleTimeoutMillis: 30000, // Temps d'inactivité avant de fermer une connexion
  connectionTimeoutMillis: 2000, // Temps maximum pour établir une connexion
};

export const pool = new Pool(config);

// Gestion des erreurs de connexion
pool.on('error', (err) => {
  console.error('Unexpected error on idle database client', err);
  process.exit(-1);
});

// Initialisation de Drizzle avec le pool configuré
export const db = drizzle({ client: pool, schema });
