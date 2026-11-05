import "server-only";
import { adminQuery, adminQueryOne } from "@/lib/supabase/admin";

export async function query<T>(text: string, values: unknown[] = []): Promise<T[]> {
  return adminQuery(async (client) => {
    const { data, error } = await client.rpc("execute_sql", { query: text, params: values });
    if (error) throw error;
    return { data: (data ?? []) as T[], error: null };
  });
}

export async function queryOne<T>(text: string, values: unknown[] = []): Promise<T | null> {
  return adminQueryOne(async (client) => {
    const { data, error } = await client.rpc("execute_sql", { query: text, params: values });
    if (error) throw error;
    return { data: (data as T[])[0] ?? null, error: null };
  });
}