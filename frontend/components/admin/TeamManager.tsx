"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Plus, Power, RotateCcw, UserPlus } from "lucide-react";
import { ADMIN_ROLES, ROLE_LABELS, type AdminRole } from "@/lib/auth/roles";
import type { TeamMember } from "@/lib/auth/users";

const input = "w-full rounded-md border border-line bg-white px-3 py-2 text-sm focus:border-primary focus:outline-none";

export default function TeamManager({
  members,
  currentUserId,
}: {
  members: TeamMember[];
  currentUserId: string;
}) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [role, setRole] = useState<AdminRole>("product_manager");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  async function call(key: string, url: string, method: string, body?: unknown) {
    setBusy(key);
    setError(null);
    setNotice(null);
    try {
      const response = await fetch(url, {
        method,
        headers: body ? { "Content-Type": "application/json" } : undefined,
        body: body ? JSON.stringify(body) : undefined,
      });
      const data = (await response.json().catch(() => ({}))) as { ok?: boolean; message?: string };
      if (!response.ok || !data.ok) throw new Error(data.message ?? "Request failed.");
      return true;
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Request failed.");
      return false;
    } finally {
      setBusy(null);
    }
  }

  async function invite(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const ok = await call("invite", "/api/admin/users", "POST", { email, name, role, password });
    if (ok) {
      setEmail("");
      setName("");
      setPassword("");
      setNotice("Account created. Share the password with the user through a secure channel.");
      router.refresh();
    }
  }

  async function updateRole(member: TeamMember, nextRole: AdminRole) {
    const ok = await call(member.id, `/api/admin/users/${member.id}`, "PATCH", { role: nextRole });
    if (ok) router.refresh();
  }

  async function toggleActive(member: TeamMember) {
    const ok = await call(member.id, `/api/admin/users/${member.id}`, "PATCH", { isActive: !member.isActive });
    if (ok) router.refresh();
  }

  async function resetPassword(member: TeamMember) {
    const next = window.prompt(`New password for ${member.email} (min 12 characters). Existing sessions will be signed out.`);
    if (!next) return;
    const ok = await call(`${member.id}-pw`, `/api/admin/users/${member.id}`, "PATCH", { password: next });
    if (ok) {
      setNotice(`Password reset for ${member.email}.`);
      router.refresh();
    }
  }

  return (
    <div className="mt-6 grid gap-6 lg:grid-cols-3">
      <div className="overflow-x-auto rounded-xl border border-line bg-white lg:col-span-2">
        <table className="w-full min-w-[640px] text-left text-sm">
          <thead className="border-b border-line bg-slate-50 text-xs uppercase tracking-wider text-muted">
            <tr>
              <th scope="col" className="px-4 py-3 font-semibold">Member</th>
              <th scope="col" className="px-4 py-3 font-semibold">Role</th>
              <th scope="col" className="px-4 py-3 font-semibold">Last sign-in</th>
              <th scope="col" className="px-4 py-3 text-right font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line">
            {members.map((member) => {
              const isSelf = member.id === currentUserId;
              return (
                <tr key={member.id} className={member.isActive ? "" : "bg-slate-50/60"}>
                  <td className="px-4 py-3">
                    <p className="font-semibold text-ink">
                      {member.name} {isSelf ? <span className="text-xs font-normal text-muted">(you)</span> : null}
                    </p>
                    <p className="text-xs text-muted">{member.email}</p>
                    {!member.isActive ? (
                      <p className="mt-1 text-xs font-semibold text-red-600">Disabled</p>
                    ) : null}
                  </td>
                  <td className="px-4 py-3">
                    <select
                      value={member.role}
                      disabled={isSelf || busy === member.id}
                      onChange={(event) => updateRole(member, event.target.value as AdminRole)}
                      aria-label={`Role for ${member.name}`}
                      className="rounded-md border border-line bg-white px-2 py-1.5 text-sm disabled:bg-slate-100"
                    >
                      {ADMIN_ROLES.map((option) => (
                        <option key={option} value={option}>{ROLE_LABELS[option]}</option>
                      ))}
                    </select>
                  </td>
                  <td className="px-4 py-3 text-xs text-muted">
                    {member.lastLoginAt ? new Date(member.lastLoginAt).toLocaleString("en-GB") : "Never"}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end gap-1">
                      <button
                        type="button"
                        onClick={() => resetPassword(member)}
                        disabled={isSelf || busy !== null}
                        className="rounded-md p-2 text-muted hover:bg-slate-100 hover:text-primary disabled:opacity-40"
                        aria-label={`Reset password for ${member.name}`}
                      >
                        <RotateCcw aria-hidden="true" className="size-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => toggleActive(member)}
                        disabled={isSelf || busy !== null}
                        className="rounded-md p-2 text-muted hover:bg-slate-100 hover:text-primary disabled:opacity-40"
                        aria-label={member.isActive ? `Disable ${member.name}` : `Enable ${member.name}`}
                      >
                        <Power aria-hidden="true" className="size-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <form onSubmit={invite} className="h-fit rounded-xl border border-line bg-white p-5">
        <h2 className="flex items-center gap-2 font-display text-base font-bold text-primary-deep">
          <UserPlus aria-hidden="true" className="size-4 text-primary" />
          Add account
        </h2>
        <div className="mt-4 space-y-3">
          <div>
            <label htmlFor="member-name" className="text-sm font-semibold text-ink">Full name</label>
            <input id="member-name" value={name} onChange={(event) => setName(event.target.value)} className={`mt-1.5 ${input}`} required />
          </div>
          <div>
            <label htmlFor="member-email" className="text-sm font-semibold text-ink">Email</label>
            <input id="member-email" type="email" value={email} onChange={(event) => setEmail(event.target.value)} className={`mt-1.5 ${input}`} required />
          </div>
          <div>
            <label htmlFor="member-role" className="text-sm font-semibold text-ink">Role</label>
            <select id="member-role" value={role} onChange={(event) => setRole(event.target.value as AdminRole)} className={`mt-1.5 ${input}`}>
              {ADMIN_ROLES.map((option) => (
                <option key={option} value={option}>{ROLE_LABELS[option]}</option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="member-password" className="text-sm font-semibold text-ink">Temporary password</label>
            <input
              id="member-password"
              type="password"
              autoComplete="new-password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className={`mt-1.5 ${input}`}
              minLength={12}
              required
            />
            <p className="mt-1 text-xs text-muted">At least 12 characters. They should change it after sign-in.</p>
          </div>
        </div>

        {error ? <p role="alert" className="mt-3 text-sm font-medium text-red-600">{error}</p> : null}
        {notice ? <p role="status" className="mt-3 text-sm font-medium text-emerald-700">{notice}</p> : null}

        <button
          type="submit"
          disabled={busy !== null}
          className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-md bg-primary px-4 py-2.5 text-sm font-semibold text-white hover:bg-primary-dark disabled:opacity-60"
        >
          {busy === "invite" ? <Loader2 aria-hidden="true" className="size-4 animate-spin" /> : <Plus aria-hidden="true" className="size-4" />}
          Create account
        </button>
      </form>
    </div>
  );
}
