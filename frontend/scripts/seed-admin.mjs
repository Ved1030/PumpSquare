import { randomUUID } from "node:crypto";
import nextEnv from "@next/env";
import bcrypt from "bcryptjs";
import { createClient } from "@supabase/supabase-js";

nextEnv.loadEnvConfig(process.cwd());

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!url || !serviceRoleKey) {
  console.error("NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY must be set.");
  process.exit(1);
}

const supabase = createClient(url, serviceRoleKey, {
  auth: { persistSession: false, autoRefreshToken: false },
});

const DEV_ADMIN = {
  email: "admin@pumpsquare.com",
  name: "Dev Admin",
  password: "Admin@123456",
  role: "superadmin",
};

async function main() {
  try {
    const { data: tableCheck, error: tableError } = await supabase
      .from("admin_users")
      .select("id", { count: "exact", head: true });

    if (tableError) {
      console.error("Database tables are missing. Run the Supabase schema SQL first.");
      console.error(tableError.message);
      process.exit(1);
    }

    const { data: existing, error: existingError } = await supabase
      .from("admin_users")
      .select("id")
      .ilike("email", DEV_ADMIN.email)
      .single();

    if (existingError && existingError.code !== "PGRST116") {
      throw existingError;
    }

    const passwordHash = await bcrypt.hash(DEV_ADMIN.password, 12);

    if (existing) {
      const { error: updateError } = await supabase
        .from("admin_users")
        .update({
          name: DEV_ADMIN.name,
          role: DEV_ADMIN.role,
          password_hash: passwordHash,
          is_active: true,
          updated_at: new Date().toISOString(),
        })
        .eq("id", existing.id);

      if (updateError) throw updateError;

      await supabase.from("admin_sessions").delete().eq("user_id", existing.id);
      console.log(`\nUpdated dev admin: ${DEV_ADMIN.email}`);
    } else {
      const { error: insertError } = await supabase.from("admin_users").insert({
        id: randomUUID(),
        email: DEV_ADMIN.email,
        name: DEV_ADMIN.name,
        role: DEV_ADMIN.role,
        password_hash: passwordHash,
      });

      if (insertError) throw insertError;
      console.log(`\nCreated dev admin: ${DEV_ADMIN.email}`);
    }

    console.log("Credentials:");
    console.log(`  Email:    ${DEV_ADMIN.email}`);
    console.log(`  Password: ${DEV_ADMIN.password}`);
    console.log("\nSign in at http://localhost:3000/admin/login");
  } catch (error) {
    console.error(`\n${error instanceof Error ? error.message : error}`);
    process.exit(1);
  }
}

main();