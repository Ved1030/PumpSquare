// Throwaway in-memory stand-in for PostgreSQL covering only the statements this
// app issues. Local verification only — not part of the application.


const t = {
  admin_users: [],
  admin_sessions: [],
  admin_login_attempts: [],
  product_categories: [],
  products: [],
};

const clone = (v) => (v == null ? v : structuredClone(v));
const paramJson = (v) => (typeof v === "string" ? JSON.parse(v) : clone(v ?? []));

function sessionJoin(sql, params) {
  const [hash] = params;
  const out = [];
  for (const s of t.admin_sessions) {
    if (s.token_hash !== hash || s.expires_at <= new Date()) continue;
    const u = t.admin_users.find((x) => x.id === s.user_id && x.is_active);
    if (u) out.push({ id: u.id, email: u.email, name: u.name, role: u.role });
  }
  return out;
}

function productSelect(sql, params) {
  const out = [];
  for (const p of t.products) {
    if (/where p\.slug = \$1 and p\.status = 'published'/.test(sql) && !(p.slug === params[0] && p.status === "published")) continue;
    if (/where p\.slug = \$1(?! and)/.test(sql) && p.slug !== params[0]) continue;
    if (/where p\.id = \$1/.test(sql) && p.id !== params[0]) continue;
    if (/where p\.status = 'published'/.test(sql) && p.status !== "published") continue;
    const c = t.product_categories.find((x) => x.id === p.category_id);
    out.push({
      ...clone(p),
      category_slug: c?.slug ?? null,
      category_name: c?.name ?? null,
    });
  }
  if (/order by p\.name/.test(sql)) out.sort((a, b) => a.name.localeCompare(b.name));
  if (/order by p\.updated_at desc/.test(sql)) out.sort((a, b) => b.updated_at - a.updated_at);
  return out;
}

async function run(sql, params = []) {
  const s = sql.replace(/\s+/g, " ").trim();
  const now = new Date();
  const p = params;

  if (/^select id, slug, status from products/.test(s))
    return t.products.map((x) => ({ id: x.id, slug: x.slug, status: x.status }));

  // ---------- schema ----------
  if (/^(create|alter|drop)/i.test(s)) return [];
  if (/to_regclass/.test(s)) return [{ t: "admin_users" }];

  // ---------- admin_users ----------
  if (/count\(\*\)::int as n from admin_users where role = 'superadmin'/.test(s))
    return [{ n: t.admin_users.filter((u) => u.role === "superadmin" && u.is_active).length }];
  if (/from admin_users where lower\(email\) = lower\(\$1\).* and role = 'superadmin'/.test(s)) {
    const u = t.admin_users.find((x) => x.email.toLowerCase() === p[0].toLowerCase() && x.role === "superadmin" && x.is_active);
    return u ? [clone(u)] : [];
  }
  if (/from admin_users where lower\(email\) = lower\(\$1\)/.test(s)) {
    const u = t.admin_users.find((x) => x.email.toLowerCase() === p[0].toLowerCase());
    return u ? [clone(u)] : [];
  }
  if (/^insert into admin_users/.test(s)) {
    t.admin_users.push({
      id: p[0], email: p[1], name: p[2], role: p[3], password_hash: p[4],
      is_active: true, created_at: now, updated_at: now, last_login_at: null,
    });
    return [];
  }
  if (/^update admin_users set name = \$2, role = \$3, password_hash = \$4/.test(s)) {
    const u = t.admin_users.find((x) => x.id === p[0]);
    Object.assign(u, { name: p[1], role: p[2], password_hash: p[3], is_active: true, updated_at: now });
    return [];
  }
  if (/^update admin_users set last_login_at/.test(s)) {
    const u = t.admin_users.find((x) => x.id === p[0]);
    if (u) u.last_login_at = now;
    return [];
  }
  if (/^select id, email, name, role, is_active, last_login_at, created_at from admin_users order by/.test(s))
    return t.admin_users.map(clone);
  if (/^select role, is_active from admin_users where id = \$1/.test(s))
    return t.admin_users.filter((u) => u.id === p[0]).map((u) => ({ role: u.role, is_active: u.is_active }));
  if (/^select count\(\*\)::int as n from admin_users where role = 'superadmin' and is_active = true/.test(s))
    return [{ n: t.admin_users.filter((u) => u.role === "superadmin" && u.is_active).length }];
  if (/^update admin_users set /.test(s)) {
    const u = t.admin_users.find((x) => x.id === p[0]);
    let i = 1;
    if (/role = \$/.test(s)) u.role = p[i++];
    if (/is_active = \$/.test(s)) u.is_active = p[i++];
    if (/password_hash = \$/.test(s)) u.password_hash = p[i++];
    u.updated_at = now;
    return [];
  }

  if (/^select email, role, is_active, password_hash from admin_users/.test(s))
    return t.admin_users.map((u) => ({ email: u.email, role: u.role, is_active: u.is_active, password_hash: u.password_hash }));
  if (/^select id from admin_users where lower(email)/.test(s))
    return t.admin_users.filter((u) => u.email.toLowerCase() === p[0].toLowerCase()).map((u) => ({ id: u.id }));
  if (/^select id, email, password_hash from admin_users/.test(s))
    return t.admin_users.filter((u) => u.email.toLowerCase() === p[0].toLowerCase() && u.role === "superadmin" && u.is_active).map((u) => ({ id: u.id, email: u.email, password_hash: u.password_hash }));

  // ---------- sessions ----------
  if (/^insert into admin_sessions/.test(s)) {
    t.admin_sessions.push({ token_hash: p[0], user_id: p[1], created_at: now, expires_at: p[2] });
    return [];
  }
  if (/^delete from admin_sessions where expires_at < now\(\)/.test(s)) {
    t.admin_sessions = t.admin_sessions.filter((x) => x.expires_at > now);
    return [];
  }
  if (/^delete from admin_sessions where token_hash/.test(s)) {
    t.admin_sessions = t.admin_sessions.filter((x) => x.token_hash !== p[0]);
    return [];
  }
  if (/^delete from admin_sessions where user_id/.test(s)) {
    t.admin_sessions = t.admin_sessions.filter((x) => x.user_id !== p[0]);
    return [];
  }
  if (/join admin_users u on u.id = s.user_id/.test(s)) return sessionJoin(s, p);

  // ---------- login attempts ----------
  if (/^select failures, window_started_at, locked_until from admin_login_attempts where identifier/.test(s)) {
    const r = t.admin_login_attempts.find((x) => x.identifier === p[0]);
    return r ? [{ failures: r.failures, window_started_at: r.window_started_at, locked_until: r.locked_until }] : [];
  }
  if (/^delete from admin_login_attempts where identifier/.test(s)) {
    t.admin_login_attempts = t.admin_login_attempts.filter((x) => x.identifier !== p[0]);
    return [];
  }
  if (/^insert into admin_login_attempts/.test(s)) {
    let r = t.admin_login_attempts.find((x) => x.identifier === p[0]);
    const windowOld = r && r.window_started_at < new Date(now.getTime() - 15 * 60 * 1000);
    if (!r) {
      r = { identifier: p[0], failures: 0, window_started_at: now, locked_until: null };
      t.admin_login_attempts.push(r);
    }
    if (windowOld) {
      r.failures = 1;
      r.window_started_at = now;
      r.locked_until = null;
    } else {
      r.failures += 1;
      if (r.failures >= p[1]) r.locked_until = new Date(now.getTime() + 15 * 60 * 1000);
    }
    return [{ failures: r.failures, window_started_at: r.window_started_at, locked_until: r.locked_until }];
  }

  // ---------- products ----------
  if (/^select p\.[a-z_]+, p\.slug|^select p\.id, p\.slug|^select p\.slug/.test(s)) return productSelect(s, p);
  if (/^select slug from products where status = 'published'/.test(s))
    return t.products.filter((x) => x.status === "published").map((x) => ({ slug: x.slug })).sort((a, b) => a.slug.localeCompare(b.slug));
  if (/^insert into products/.test(s)) {
    if (t.products.some((x) => x.slug === p[1])) {
      const e = new Error("duplicate key"); e.code = "23505"; throw e;
    }
    t.products.push({
      id: p[0], slug: p[1], name: p[2], category_id: p[3], status: p[4],
      summary: p[5], description: p[6], image_url: p[7], datasheet_url: p[8], datasheet_name: p[9],
      series: p[10], features: p[11], applications: p[12],
      specifications: paramJson(p[13]), materials: paramJson(p[14]),
      published_at: p[4] === "published" ? now : null, created_at: now, updated_at: now,
    });
    return [{ slug: p[1] }];
  }
  if (/^update products set slug = \$2/.test(s)) {
    const row = t.products.find((x) => x.id === p[0]);
    if (!row) return [];
    if (t.products.some((x) => x.slug === p[1] && x.id !== p[0])) {
      const e = new Error("duplicate key"); e.code = "23505"; throw e;
    }
    const previous = { image_url: row.image_url, datasheet_url: row.datasheet_url };
    Object.assign(row, {
      slug: p[1], name: p[2], category_id: p[3], summary: p[4], description: p[5],
      image_url: p[6], datasheet_url: p[7], datasheet_name: p[8], series: p[9],
      features: p[10], applications: p[11], specifications: paramJson(p[12]),
      materials: paramJson(p[13]), updated_at: now,
    });
    return [{ slug: row.slug, image_url: row.image_url, datasheet_url: row.datasheet_url, ...previous }];
  }
  if (/^update products set status = \$2/.test(s) || /^update products set status = \$2, published_at = case/.test(s)) {
    const row = t.products.find((x) => x.id === p[0]);
    if (!row) return [];
    row.status = p[1];
    if (p[1] === "published" && !row.published_at) row.published_at = now;
    row.updated_at = now;
    return [{ id: row.id, slug: row.slug, status: row.status }];
  }
  if (/^delete from products where id/.test(s)) {
    const row = t.products.find((x) => x.id === p[0]);
    const out = row ? [{ slug: row.slug }] : [];
    t.products = t.products.filter((x) => x.id !== p[0]);
    return out;
  }
  if (/select image_url, datasheet_url from products where id/.test(s)) {
    const row = t.products.find((x) => x.id === p[0]);
    return row ? [{ image_url: row.image_url, datasheet_url: row.datasheet_url }] : [];
  }

  // ---------- categories ----------
  if (/^select c\.id, c\.slug, c\.name, count/.test(s)) {
    return [...t.product_categories]
      .sort((a, b) => a.sort_order - b.sort_order || a.name.localeCompare(b.name))
      .map((c) => ({ id: c.id, slug: c.slug, name: c.name, product_count: t.products.filter((x) => x.category_id === c.id).length }));
  }
  if (/^select slug, name from product_categories/.test(s))
    return [...t.product_categories].sort((a, b) => a.sort_order - b.sort_order || a.name.localeCompare(b.name)).map((c) => ({ slug: c.slug, name: c.name }));
  if (/^insert into product_categories/.test(s)) {
    const existing = t.product_categories.find((x) => x.slug === p[2]);
    if (existing) {
      existing.name = p[1];
      return [{ id: existing.id }];
    }
    if (t.product_categories.some((x) => x.slug === p[2])) {
      const e = new Error("duplicate key"); e.code = "23505"; throw e;
    }
    t.product_categories.push({ id: p[0], name: p[1], slug: p[2], sort_order: t.product_categories.length, created_at: now });
    return [{ id: p[0] }];
  }
  if (/^update product_categories set name/.test(s)) {
    if (t.product_categories.some((x) => x.slug === p[2] && x.id !== p[0])) {
      const e = new Error("duplicate key"); e.code = "23505"; throw e;
    }
    const c = t.product_categories.find((x) => x.id === p[0]);
    if (!c) return [];
    Object.assign(c, { name: p[1], slug: p[2] });
    return [{ id: c.id }];
  }
  if (/^delete from product_categories where id/.test(s)) {
    const c = t.product_categories.find((x) => x.id === p[0]);
    t.product_categories = t.product_categories.filter((x) => x.id !== p[0]);
    t.products.forEach((x) => { if (x.category_id === p[0]) x.category_id = null; });
    return c ? [{ id: c.id }] : [];
  }
  if (/^(begin|commit|rollback)$/i.test(s)) return [];

  throw new Error(`mem-pg: unsupported SQL → ${s.slice(0, 160)}`);
}

class MemPool {
  constructor() { this.totalCount = 0; }
  async query(sql, params) {
    const rows = await run(typeof sql === "string" ? sql : sql.text, params ?? []);
    return { rows: rows.map(clone), rowCount: rows.length };
  }
  async connect() {
    return { query: (sql, params) => this.query(sql, params), release() {} };
  }
  async end() {}
}

class MemClient extends MemPool {}

export default { Pool: MemPool, Client: MemClient, default: { Pool: MemPool } };
export { MemPool as Pool };
