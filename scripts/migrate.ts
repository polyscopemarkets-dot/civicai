import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });
import { migrate } from "drizzle-orm/node-postgres/migrator";
import { db, getPool } from "../src/lib/db";
import path from "path";

async function main() {
  console.log("Running migrations...");
  await migrate(db, {
    migrationsFolder: path.join(process.cwd(), "src/lib/db/migrations"),
  });
  console.log("Migrations complete.");
  await getPool().end();
  process.exit(0);
}

main().catch((err) => {
  console.error("Migration failed:", err);
  process.exit(1);
});
