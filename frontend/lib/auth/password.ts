import bcrypt from "bcryptjs";

const MIN_LENGTH = 12;

export type PasswordWarning = "12+" | "Lowercase" | "Uppercase" | "Number" | "Symbol" | "Not your email";

export function passwordIssues(password: string, email: string): PasswordWarning[] {
  const issues: PasswordWarning[] = [];
  if (password.length < MIN_LENGTH) issues.push("12+");
  if (!/[a-z]/.test(password)) issues.push("Lowercase");
  if (!/[A-Z]/.test(password)) issues.push("Uppercase");
  if (!/\d/.test(password)) issues.push("Number");
  if (!/[^A-Za-z0-9]/.test(password)) issues.push("Symbol");
  if (email && password.toLowerCase().includes(email.toLowerCase())) issues.push("Not your email");
  return issues;
}

export async function hashPassword(password: string) {
  return bcrypt.hash(password, 12);
}

export async function verifyPassword(password: string, hash: string) {
  return bcrypt.compare(password, hash);
}

// Compared against when the account does not exist so response timing is similar.
let dummyHash: Promise<string> | undefined;

export async function verifyDummyPassword(password: string) {
  dummyHash ??= bcrypt.hash("not-a-real-password-placeholder", 12);
  await bcrypt.compare(password, await dummyHash);
  return false;
}
