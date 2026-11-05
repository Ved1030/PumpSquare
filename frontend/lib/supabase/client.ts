import "server-only";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";

declare global {
  var __supabasePublic: SupabaseClient | undefined;
}

export function getPublicSupabase(): SupabaseClient {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !anonKey) {
    throw new Error("Supabase public credentials not configured (NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY).");
  }

  if (!globalThis.__supabasePublic) {
    globalThis.__supabasePublic = createClient(url, anonKey, {
      auth: { persistSession: false, autoRefreshToken: false },
    });
  }

  return globalThis.__supabasePublic;
}