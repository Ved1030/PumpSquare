export const ADMIN_ROLES = ["superadmin", "product_manager", "read_only"] as const;

export type AdminRole = (typeof ADMIN_ROLES)[number];

export const ROLE_LABELS: Record<AdminRole, string> = {
  superadmin: "Superadmin",
  product_manager: "Product Manager",
  read_only: "Read-only Admin",
};

export type AdminPermission =
  | "products:write"
  | "categories:write"
  | "files:upload"
  | "users:manage";

const PERMISSIONS: Record<AdminRole, AdminPermission[]> = {
  superadmin: ["products:write", "categories:write", "files:upload", "users:manage"],
  product_manager: ["products:write", "categories:write", "files:upload"],
  read_only: [],
};

export function hasPermission(role: AdminRole, permission: AdminPermission) {
  return PERMISSIONS[role].includes(permission);
}

export function isAdminRole(value: unknown): value is AdminRole {
  return typeof value === "string" && (ADMIN_ROLES as readonly string[]).includes(value);
}
