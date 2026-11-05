import type { AdminRole } from "@/lib/auth/roles";
import { ROLE_LABELS } from "@/lib/auth/roles";

export default function AdminPageHeader({
  title,
  description,
  role,
}: {
  title: string;
  description?: string;
  role: AdminRole;
}) {
  return (
    <div>
      <h1 className="font-display text-2xl font-bold text-primary-deep">{title}</h1>
      {description ? <p className="mt-1 max-w-2xl text-sm text-muted">{description}</p> : null}
      <p className="mt-2 inline-flex rounded-full bg-primary-soft px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wider text-primary-deep">
        {ROLE_LABELS[role]}
      </p>
    </div>
  );
}
