import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import * as schema from "./schema";

let _pool: Pool | null = null;

export function getPool(): Pool {
  if (!_pool) {
    _pool = new Pool({ connectionString: process.env.DATABASE_URL });
  }
  return _pool;
}

let _db: ReturnType<typeof drizzle<typeof schema>> | null = null;

export function getDb() {
  if (!_db) {
    _db = drizzle(getPool(), { schema });
  }
  return _db;
}

// Eager singleton for Next.js API routes (env is already loaded)
export const db = {
  get select() { return getDb().select.bind(getDb()); },
  get insert() { return getDb().insert.bind(getDb()); },
  get update() { return getDb().update.bind(getDb()); },
  get delete() { return getDb().delete.bind(getDb()); },
  get execute() { return getDb().execute.bind(getDb()); },
};
