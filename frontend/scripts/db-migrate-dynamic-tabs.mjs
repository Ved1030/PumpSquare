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

// Same file as the Supabase SQL editor migration; every statement is
// idempotent and keeps existing rows.
const sql = await readFile(path.join(process.cwd(), "migration-dynamic-review-tabs.sql"), "utf8");
await pool.query(sql);
console.log("Product review tabs now support custom tabs.");
await pool.end();
