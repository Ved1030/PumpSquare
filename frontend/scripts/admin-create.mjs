/**
 * Creates or promotes an admin account. Never accepts a password as an argument
 * (that would leak into shell history and the process list), and never logs it.
 *
 * First superadmin (one-time bootstrap, only when no superadmin exists yet):
 *   npm run admin:create -- you@pumpsquare.com "Your Name"
 *
 * Later runs require an existing superadmin to authorise the change:
 *   npm run admin:create -- someone@pumpsquare.com "Their Name" --role product_manager \
 *     --acting-as admin@pumpsquare.com
 * The acting superadmin's password is typed at the prompt and verified.
 */
import { randomUUID } from "node:crypto";
import { createInterface } from "node:readline";
import { stdin, stdout } from "node:process";
import nextEnv from "@next/env";
import bcrypt from "bcryptjs";
import pg from "pg";

nextEnv.loadEnvConfig(process.cwd());

const ROLES = ["superadmin", "product_manager", "read_only"];
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function usage(message) {
  if (message) console.error(`\nError: ${message}`);
  console.error(
    [
      "",
      "Usage:",
      '  npm run admin:create -- <email> "<full name>" [--role superadmin|product_manager|read_only] [--acting-as <existing superadmin email>]',
      "",
      "  First run (no superadmin exists): creates a superadmin. Role is forced to superadmin.",
      "  Later runs: require --acting-as with an active superadmin email and the password of that account.",
      "",
      "Passwords are typed at a hidden prompt; they are never passed as arguments.",
    ].join("\n"),
  );
  process.exit(message ? 1 : 0);
}

function parseArgs(argv) {
  const positional = [];
  const flags = { role: "superadmin", actingAs: null };

  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i];
    if (arg === "--role") flags.role = argv[++i];
    else if (arg === "--acting-as") flags.actingAs = argv[++i];
    else if (arg === "--help" || arg === "-h") usage();
    else if (arg.startsWith("--")) usage(`Unknown option ${arg}`);
    else positional.push(arg);
  }

  return { email: positional[0], name: positional[1], ...flags };
}

function readHidden(prompt, confirm = false) {
  return new Promise((resolve, reject) => {
    if (!stdin.isTTY) {
      reject(new Error("A terminal is required so the password can be hidden."));
      return;
    }

    stdout.write(prompt);
    const rl = createInterface({ input: stdin, output: stdout, terminal: true });
    rl._writeToOutput = (text) => {
      if (text.includes("\n") || text.includes("\r")) stdout.write("\n");
    };

    rl.question("", (answer) => {
      rl.close();
      if (!answer) {
        reject(new Error("Password cannot be empty."));
        return;
      }
      if (confirm) {
        stdout.write("Confirm password: ");
        const check = createInterface({ input: stdin, output: stdout, terminal: true });
        check._writeToOutput = (text) => {
          if (text.includes("\n") || text.includes("\r")) stdout.write("\n");
        };
        check.question("", (again) => {
          check.close();
          if (again !== answer) reject(new Error("Passwords did not match."));
          else resolve(answer);
        });
      } else {
        resolve(answer);
      }
    });
  });
}

function assertStrongPassword(password, email) {
  const problems = [];
  if (password.length < 12) problems.push("at least 12 characters");
  if (!/[a-z]/.test(password)) problems.push("a lowercase letter");
  if (!/[A-Z]/.test(password)) problems.push("an uppercase letter");
  if (!/\d/.test(password)) problems.push("a number");
  if (!/[^A-Za-z0-9]/.test(password)) problems.push("a symbol");
  if (password.toLowerCase().includes(email.toLowerCase())) problems.push("must not contain the email address");
  if (problems.length) throw new Error(`Password needs ${problems.join(", ")}.`);
}

async function main() {
  const { email, name, role, actingAs } = parseArgs(process.argv.slice(2));

  if (!email || !name) usage("Email and full name are required.");
  if (!EMAIL_RE.test(email)) usage("That email address is not valid.");
  if (!ROLES.includes(role)) usage(`Role must be one of: ${ROLES.join(", ")}`);

  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) usage("DATABASE_URL is not set.");

  const isLocal = /@(localhost|127\.0\.0\.1)[:/]/.test(connectionString);
  const pool = new pg.Pool({
    connectionString,
    ssl:
      process.env.DATABASE_SSL === "disable" || isLocal
        ? false
        : { rejectUnauthorized: process.env.DATABASE_SSL_NO_VERIFY !== "true" },
  });

  try {
    const { rows: tableRows } = await pool.query("select to_regclass('public.admin_users') as t");
    if (!tableRows[0].t) usage("Database tables are missing. Run `npm run db:migrate` first.");

    const { rows: superRows } = await pool.query(
      "select count(*)::int as n from admin_users where role = 'superadmin' and is_active = true",
    );
    const bootstrap = superRows[0].n === 0;

    let effectiveRole = role;
    let authorisedBy = "bootstrap";

    if (!bootstrap) {
      if (!actingAs) {
        usage(
          "A superadmin already exists. Re-run with --acting-as <superadmin email> so an authorised administrator approves this change.",
        );
      }
      const { rows: actorRows } = await pool.query(
        "select id, email, password_hash from admin_users where lower(email) = lower($1) and role = 'superadmin' and is_active = true",
        [actingAs],
      );
      const actor = actorRows[0];
      const actorPassword = await readHidden(`Password for ${actingAs}: `);
      if (!actor || !(await bcrypt.compare(actorPassword, actor.password_hash))) {
        throw new Error("Superadmin authentication failed. Name not created.");
      }
      authorisedBy = actor.email;
    } else if (role !== "superadmin") {
      console.log("No superadmin exists yet, so this account is created as superadmin.");
      effectiveRole = "superadmin";
    }

    const password = await readHidden("New admin password (hidden): ", true);
    assertStrongPassword(password, email);
    const passwordHash = await bcrypt.hash(password, 12);

    const { rows: existingRows } = await pool.query(
      "select id from admin_users where lower(email) = lower($1)",
      [email],
    );

    if (existingRows[0] && !bootstrap && email.toLowerCase() === actingAs?.toLowerCase()) {
      throw new Error("A superadmin cannot change their own role or password here. Use --acting-as with a different superadmin.");
    }

    if (existingRows[0]) {
      await pool.query(
        `update admin_users
         set name = $2, role = $3, password_hash = $4, is_active = true, updated_at = now()
         where id = $1`,
        [existingRows[0].id, name.trim(), effectiveRole, passwordHash],
      );
      await pool.query("delete from admin_sessions where user_id = $1", [existingRows[0].id]);
      console.log(`\nUpdated ${email} (${effectiveRole}). Existing sessions for this account were revoked.`);
    } else {
      await pool.query(
        `insert into admin_users (id, email, name, role, password_hash)
         values ($1, $2, $3, $4, $5)`,
        [randomUUID(), email.trim(), name.trim(), effectiveRole, passwordHash],
      );
      console.log(`\nCreated ${email} (${effectiveRole}).`);
    }

    console.log(`Authorised by: ${authorisedBy === "bootstrap" ? "first-run bootstrap" : authorisedBy}`);
    console.log("Sign in at /admin/login. Keep these credentials out of chat, email and source control.");
  } finally {
    await pool.end();
  }
}

main().catch((error) => {
  console.error(`\n${error.message}`);
  process.exit(1);
});
