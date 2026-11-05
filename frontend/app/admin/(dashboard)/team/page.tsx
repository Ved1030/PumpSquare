import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/auth/guard";
import { hasPermission } from "@/lib/auth/roles";
import { listTeam } from "@/lib/auth/users";
import AdminPageHeader from "@/components/admin/AdminPageHeader";
import TeamManager from "@/components/admin/TeamManager";

export const instant = false;

export default async function AdminTeamPage() {
  const user = await requireAdmin();
  if (!hasPermission(user.role, "users:manage")) redirect("/admin");

  const members = await listTeam();

  return (
    <div>
      <AdminPageHeader
        title="Team & access"
        description="Create accounts and set roles. There is no public sign-up: accounts only exist when a Superadmin creates them here or via the server CLI."
        role={user.role}
      />
      <TeamManager members={members} currentUserId={user.id} />
    </div>
  );
}
