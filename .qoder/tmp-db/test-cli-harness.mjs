import { EventEmitter } from "node:events";
import nextEnv from "@next/env";
import bcrypt from "bcryptjs";
import { randomUUID } from "node:crypto";

nextEnv.loadEnvConfig(process.cwd());
process.env.DATABASE_URL ||= "postgres://test@localhost/test";
process.env.DATABASE_SSL = "disable";

const CR = String.fromCharCode(13);
const { createInterface: origCreateInterface } = await import("node:readline");
const realProcessStdin = process.stdin;
const NL = String.fromCharCode(10);
const realWrite = process.stdout.write.bind(process.stdout);
const report = (...a) => realWrite(a.map(String).join(" ") + NL);

const shim = await import("file:///D:/VPVM%20services/pumpsquare-website/.qoder/tmp-db/mem-pg.mjs");
const pool = new shim.default.Pool();
const client = await pool.connect();
globalThis.__harnessPool = pool;
globalThis.__harnessMode = true;
const { jars } = await import("file:///D:/VPVM%20services/pumpsquare-website/.qoder/tmp-db/headers-stub.mjs");

const fake = new EventEmitter();
fake.setRawMode = () => {};
fake.resume = () => {};
fake.pause = () => {};
fake.setEncoding = () => {};
fake.ref = () => {};
fake.unref = () => {};
fake.isTTY = true;
Object.defineProperty(process, "stdin", { value: fake, configurable: true });
// route readline's raw-mode keypress path back to the real terminal-free implementation
const readlineMod = await import("node:readline");
void origCreateInterface;

import { createInterface as __rlc } from "node:readline";
const __origQ = __rlc.prototype.question;
"" + __origQ;
let captured = "";
process.stdout.write = (chunk) => {
  captured += String(chunk);
  return true;
};
process.stderr.write = (chunk) => {
  captured += String(chunk);
  return true;
};

let exitResolve = null;
process.exit = () => exitResolve?.();

const scriptPath = "file:///D:/VPVM%20services/pumpsquare-website/frontend/.tmp-admin-harness.mjs";

async function run(label, argv, passwords, tty = true) {
  captured = "";
  Object.defineProperty(fake, "isTTY", { value: tty, configurable: true, writable: true });
  globalThis.__forceNonTTY = !tty;
  globalThis.__clientPool = client;
  process.argv = [process.execPath, "admin-create.mjs", ...argv, ...passwords];
  const exit = new Promise((r) => (exitResolve = r));
  await import(scriptPath + "?" + Math.random()).catch((e) => {
    captured += " " + e.message;
  });
  await Promise.race([exit, new Promise((r) => setTimeout(r, 1500))]);
  report(label + " =>", captured.trim().replace(/[ 	]+/g, " "));
}

await run("NONTTY", ["nontty@example.com", "NoTTY"], [], false);
await run("BOOTSTRAP", ["boss@example.com", "Boss"], ["S3cure-Admin-Pass!"]);

const hash = await bcrypt.hash("RootPass123!xyz", 12);
await pool.query(
  "insert into admin_users (id, email, name, role, password_hash) values ($1,$2,$3,$4,$5)",
  [randomUUID(), "root@example.com", "Root", "superadmin", hash],
);

await run("NO-ACTOR", ["sneaky@example.com", "Sneaky"], ["S3cure-Admin-Pass!"]);
await run("BAD-ACTOR", ["sneaky@example.com", "Sneaky", "--acting-as", "root@example.com"], ["wrong-actor-pass"]);
await run("WEAK", ["pm@example.com", "PM", "--acting-as", "boss@example.com"], ["S3cure-Admin-Pass!", "weak"]);
await run("SELF", ["root@example.com", "Root", "--acting-as", "root@example.com"], ["RootPass123!xyz", "S3cure-Admin-Pass!"]);
await run("AUTHORISED", ["pm@example.com", "PM", "--role", "product_manager", "--acting-as", "boss@example.com"], ["S3cure-Admin-Pass!", "RootPass123!xyz"]);
await run("PROMOTE", ["pm@example.com", "PM", "--role", "superadmin", "--acting-as", "boss@example.com"], ["S3cure-Admin-Pass!", "NewPass-123456!"]);
await run("DEMOTE", ["root@example.com", "Root", "--role", "read_only", "--acting-as", "pm@example.com"], ["NewPass-123456!", "S3cure-Admin-Pass!"]);

const { rows } = await pool.query("select email, role, is_active, password_hash from admin_users order by email");
for (const u of rows) {
  report("ROW:", u.email, u.role, u.is_active, String(u.password_hash).startsWith("$2") ? "hashed" : "PLAINTEXT!");
}

const { loginAdmin } = await import("file:///D:/VPVM%20services/pumpsquare-website/frontend/lib/auth/login.ts?" + Math.random());
report("OLD-PW-AFTER-RESET:", (await loginAdmin("pm@example.com", "S3cure-Admin-Pass!", "10.0.0.1")).code);
report("NEW-PW-AFTER-RESET:", (await loginAdmin("pm@example.com", "NewPass-123456!", "10.0.0.1")).ok);
report("BAD-PW:", (await loginAdmin("pm@example.com", "wrong", "10.0.1.1")).code);
for (let i = 0; i < 6; i++) await loginAdmin("pm@example.com", "wrong", "10.0.0.9");
report("LOCKED-AFTER-5:", (await loginAdmin("pm@example.com", "NewPass-123456!", "10.0.0.9")).code);
report("OTHER-IP-UNAFFECTED:", (await loginAdmin("root@example.com", "S3cure-Admin-Pass!", "10.0.0.10")).ok);
report("UNKNOWN-USER:", (await loginAdmin("ghost@example.com", "whatever", "10.0.0.12")).code);

await loginAdmin("root@example.com", "S3cure-Admin-Pass!", "3.3.3.3");
const { getSessionUser } = await import("file:///D:/VPVM%20services/pumpsquare-website/frontend/lib/auth/session.ts");
const opts = jars.get("psq_admin_session")?.options ?? {};
report("COOKIE-OPTS:", Object.entries(opts).map(([k, v]) => k + "=" + (v instanceof Date ? "date" : v)).join(","));
report("SESSION:", (await getSessionUser())?.email);
jars.set("psq_admin_session", "forged-token");
report("FORGED:", await getSessionUser());

const { hasPermission } = await import("file:///D:/VPVM%20services/pumpsquare-website/frontend/lib/auth/roles.ts?" + Math.random());
report(
  "PERMS:",
  ["superadmin", "product_manager", "read_only"]
    .map((r) => r + "[" + ["products:write", "categories:write", "files:upload", "users:manage"].filter((p) => hasPermission(r, p)).join("|") + "]")
    .join(" "),
);
// ---- product management through the real modules ----
const svc = await import("file:///D:/VPVM%20services/pumpsquare-website/frontend/lib/products-server.ts");
const pub = await import("file:///D:/VPVM%20services/pumpsquare-website/frontend/lib/product-catalogue.ts");
await svc.createCategory({ name: "Industrial", slug: "industrial" });
await svc.createCategory({ name: "Marine", slug: "marine" });
const cats = await svc.getAdminCategories();
report("DEBUG-CATS:", JSON.stringify(cats));
report("CATEGORIES:", cats.map((c) => c.slug + ":" + c.productCount).join(" "));
const base = {
  name: "Metering Gear Pump",
  slug: "metering-gear-pump",
  categoryId: cats[0].id,
  summary: "Small metering pump",
  description: "Description",
  imageUrl: "",
  datasheetUrl: "",
  datasheetName: "",
  series: ["A"],
  features: [],
  applications: [],
  specifications: [{ key: "Flow", value: "10 L/h" }],
  materials: [],
};
const draft = await svc.createProduct({ ...base }, "draft");
report("DEBUG-ROW:", JSON.stringify(await pool.query("select id, slug, status from products")));
report("CREATE-DRAFT:", draft.slug);
report("PUBLIC-HIDES-DRAFT:", JSON.stringify(await pub.getPublishedCatalogue()), "detail:", JSON.stringify(await svc.getPublishedProduct("metering-gear-pump")), "admin:", JSON.stringify(await svc.getAdminProductBySlug("metering-gear-pump")));
report("DEBUG-STATUS:", JSON.stringify(await svc.setProductStatus(draft.id, "published")));
report("DEBUG-ROW2:", JSON.stringify(await pool.query("select id, slug, status from products")));
report("PUBLISHED-VISIBLE:", (await pub.getPublishedCatalogue()).some((p) => p.slug === "metering-gear-pump"), "detail:", !!(await svc.getPublishedProduct("metering-gear-pump")));
await svc.updateProduct(draft.id, { ...base, name: "Metering Gear Pump X", summary: "Updated" });
report("EDIT-REFLECTED:", (await svc.getPublishedProduct(draft.slug))?.name);
await svc.setProductStatus(draft.id, "draft");
report("UNPUBLISH-HIDDEN:", (await pub.getPublishedCatalogue()).some((p) => p.slug === "metering-gear-pump"), "detail:", await svc.getPublishedProduct("metering-gear-pump"));
try {
  await svc.createProduct({ ...base, name: "Dup" }, "draft");
  report("DUPLICATE-SLUG: NOT REJECTED");
} catch (e) {
  report("DUPLICATE-SLUG:", e.constructor.name);
}
try {
  await svc.updateProduct(draft.id, { ...base, imageUrl: "https://evil.example.com/x.png" }, { image_url: null, datasheet_url: null });
  report("FOREIGN-URL: NOT REJECTED");
} catch (e) {
  report("FOREIGN-URL:", e.constructor.name);
}
const parsed = svc.productInputSchema.safeParse({ ...base, slug: "Bad Slug", summary: "x".repeat(301) });
report("VALIDATION:", parsed.success, parsed.success ? "" : Object.keys(parsed.error.issues.length ? { issues: 1 } : {}).length);
await svc.deleteProduct(draft.id);
report("DELETE:", await svc.getAdminProductBySlug(draft.slug));
try {
  await svc.deleteCategory(cats[0].id);
  report("CATEGORY-DELETE: ok (products detached)", cats.length, (await svc.getAdminCategories()).length);
} catch (e) {
  report("CATEGORY-DELETE-ERR:", e.constructor.name);
}
report("DONE");
