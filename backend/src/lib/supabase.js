import { createClient } from "@supabase/supabase-js";
import { env } from "../config/env.js";

let adminClient = null;
let publicClient = null;

export function getSupabaseAdmin() {
  if (!adminClient) {
    adminClient = createClient(env.SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY, {
      auth: { persistSession: false, autoRefreshToken: false },
    });
  }
  return adminClient;
}

export function getSupabasePublic() {
  if (!publicClient) {
    publicClient = createClient(env.SUPABASE_URL, env.SUPABASE_ANON_KEY, {
      auth: { persistSession: false, autoRefreshToken: false },
    });
  }
  return publicClient;
}