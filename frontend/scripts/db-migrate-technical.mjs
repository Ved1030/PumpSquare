import { readFile } from "node:fs/promises";
import path from "node:path";
import nextEnv from "@next/env";
import pg from "pg";

nextEnv.loadEnvConfig(process.cwd());

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  console.error("DATABASE_URL is not set.");
  process.exit(1);
}

const isLocal = /@(localhost|127\.0\.0\.1)[:/]/.test(connectionString);
const pool = new pg.Pool({
  connectionString,
  ssl:
    process.env.DATABASE_SSL === "disable" || isLocal
      ? false
      : { rejectUnauthorized: process.env.DATABASE_SSL_NO_VERIFY !== "true" },
});

// Same statements as the technical section of lib/db/schema.sql; every
// statement is idempotent so this is safe to re-run and keeps existing rows.
const schema = await readFile(path.join(process.cwd(), "lib/db/schema.sql"), "utf8");
const technical = schema.slice(schema.indexOf("-- Technical information tabs"));
await pool.query(technical);
console.log("Technical information tables are up to date.");
await pool.end();
