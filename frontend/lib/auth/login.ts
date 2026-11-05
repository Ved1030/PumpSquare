import "server-only";
import { adminQuery, adminQueryOne } from "@/lib/supabase/admin";
import { verifyDummyPassword, verifyPassword } from "@/lib/auth/password";
import { createSession, type AdminUser } from "@/lib/auth/session";
import { isAdminRole } from "@/lib/auth/roles";

const MAX_FAILURES = 5;

type AttemptRow = {
  failures: number;
  window_started_at: string;
  locked_until: string | null;
};

type LoginUserRow = {
  id: string;
  email: string;
  name: string;
  role: string;
  password_hash: string;
  is_active: boolean;
};

export type LoginResult =
  | { ok: true; user: AdminUser }
  | { ok: false; code: "LOCKED" | "INVALID" };

function attemptKey(email: string, ip: string) {
  return `login|${email.toLowerCase()}|${ip}`;
}

async function isLocked(key: string) {
  return adminQueryOne(async (client) => {
    const { data, error } = await client
      .from("admin_login_attempts")
      .select("failures, window_started_at, locked_until")
      .eq("identifier", key)
      .single();

    if (error) {
      if (error.code === "PGRST116") return { data: false, error: null };
      throw error;
    }

    if (!data) return { data: false, error: null };
    if (data.locked_until && new Date(data.locked_until).getTime() > Date.now()) return { data: true, error: null };

    if (data.locked_until) {
      await client.from("admin_login_attempts").delete().eq("identifier", key);
      return { data: false, error: null };
    }
    return { data: false, error: null };
  });
}

async function recordFailure(key: string) {
  return adminQuery(async (client) => {
    const { data, error } = await client
      .from("admin_login_attempts")
      .upsert(
        {
          identifier: key,
          failures: 1,
          window_started_at: new Date().toISOString(),
        },
        {
          onConflict: "identifier",
          ignoreDuplicates: false,
        }
      )
      .select("failures, window_started_at, locked_until")
      .single();

    if (error) throw error;

    if (data.failures >= MAX_FAILURES) {
      const { error: updateError } = await client
        .from("admin_login_attempts")
        .update({ locked_until: new Date(Date.now() + 15 * 60 * 1000).toISOString() })
        .eq("identifier", key);
      if (updateError) throw updateError;
      return { data: true, error: null };
    }
    return { data: false, error: null };
  });
}

export async function loginAdmin(
  email: string,
  password: string,
  ip: string,
): Promise<LoginResult> {
  const key = attemptKey(email, ip);

  if (await isLocked(key)) return { ok: false, code: "LOCKED" };

  const user = await adminQueryOne(async (client) => {
    const { data, error } = await client
      .from("admin_users")
      .select("id, email, name, role, password_hash, is_active")
      .ilike("email", email)
      .single();

    if (error) {
      if (error.code === "PGRST116") return { data: null, error: null };
      throw error;
    }
    return { data, error: null };
  });

  const valid = user
    ? await verifyPassword(password, user.password_hash)
    : await verifyDummyPassword(password);

  if (!user || !valid || !user.is_active || !isAdminRole(user.role)) {
    const locked = await recordFailure(key);
    return { ok: false, code: locked ? "LOCKED" : "INVALID" };
  }

  await adminQuery(async (client) => {
    const { error } = await client.from("admin_login_attempts").delete().eq("identifier", key);
    if (error) throw error;
    return { data: null, error: null };
  });

  await adminQuery(async (client) => {
    const { error } = await client
      .from("admin_users")
      .update({ last_login_at: new Date().toISOString() })
      .eq("id", user.id);
    if (error) throw error;
    return { data: null, error: null };
  });

  await createSession(user.id);

  return {
    ok: true,
    user: { id: user.id, email: user.email, name: user.name, role: user.role },
  };
}