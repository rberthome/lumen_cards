"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { Button, Modal, Card, Badge, Icon } from "@/design-system";
import { UserFormModal } from "./UserFormModal";
import { resetUserPassword, deleteUser } from "../actions";
import type { UserListItem } from "../types";

const th =
  "px-4 py-3 text-xs font-semibold uppercase tracking-[0.06em] text-muted";
const td = "px-4 py-3";

export function UsersClient({ users }: { users: UserListItem[] }) {
  const t = useTranslations("users");
  const tc = useTranslations("common");
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [error, setError] = useState<string>();
  const [pending, startTransition] = useTransition();
  const [resetInfo, setResetInfo] = useState<{
    name: string;
    password: string;
  } | null>(null);

  function onReset(u: UserListItem) {
    setError(undefined);
    if (!confirm(t("resetConfirm", { name: u.name }))) return;
    startTransition(async () => {
      const res = await resetUserPassword(u.id);
      if (res.error) setError(res.error);
      else {
        if (res.tempPassword)
          setResetInfo({ name: u.name, password: res.tempPassword });
        router.refresh();
      }
    });
  }

  function onDelete(u: UserListItem) {
    setError(undefined);
    if (!confirm(t("deleteConfirm", { name: u.name }))) return;
    startTransition(async () => {
      const res = await deleteUser(u.id);
      if (res.error) setError(res.error);
      else router.refresh();
    });
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-serif text-2xl font-semibold text-foreground">
            {t("title")}
          </h1>
          <p className="mt-0.5 text-sm text-muted">{users.length}</p>
        </div>
        <Button onClick={() => setOpen(true)}>{t("new")}</Button>
      </div>

      {error && <p className="text-sm text-incorrect">{error}</p>}

      <Card padding="none" elevation="sm" className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-line bg-surface-2">
              <tr>
                <th className={th}>{t("colName")}</th>
                <th className={th}>{t("colRole")}</th>
                <th className={th}>{t("colStatus")}</th>
                <th className={th} aria-label={tc("actions")} />
              </tr>
            </thead>
            <tbody>
              {users.length === 0 ? (
                <tr>
                  <td className="px-4 py-10 text-center text-muted" colSpan={4}>
                    {t("empty")}
                  </td>
                </tr>
              ) : (
                users.map((u) => (
                  <tr key={u.id} className="border-b border-line last:border-0">
                    <td className={td}>
                      <div className="flex items-center gap-3">
                        <span className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-info-soft text-info">
                          <Icon name="graduation" size={16} />
                        </span>
                        <div className="min-w-0">
                          <div className="truncate font-medium text-foreground">
                            {u.name}
                          </div>
                          <div className="truncate text-xs text-muted">
                            {u.email}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className={td}>
                      <Badge variant={u.role === "admin" ? "free" : "neutral"}>
                        {u.role === "admin" ? t("roleAdmin") : t("roleUser")}
                      </Badge>
                    </td>
                    <td className={td}>
                      <Badge
                        variant={u.mustChangePassword ? "neutral" : "acquired"}
                      >
                        {u.mustChangePassword ? t("mustChange") : t("active")}
                      </Badge>
                    </td>
                    <td className={td}>
                      <div className="flex justify-end gap-2">
                        <Button
                          size="sm"
                          variant="ghost"
                          disabled={pending}
                          onClick={() => onReset(u)}
                        >
                          {t("reset")}
                        </Button>
                        <Button
                          size="sm"
                          variant="secondary"
                          disabled={pending}
                          onClick={() => onDelete(u)}
                        >
                          {tc("delete")}
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {open && <UserFormModal onClose={() => setOpen(false)} />}

      {resetInfo && (
        <Modal open onClose={() => setResetInfo(null)} title={t("tempTitle")}>
          <p className="text-sm text-muted">
            {t("tempHint", { name: resetInfo.name })}
          </p>
          <p className="mt-3 select-all rounded-[var(--radius-md)] border border-line bg-field px-4 py-3 text-center font-mono text-lg text-foreground">
            {resetInfo.password}
          </p>
          <div className="mt-4 flex justify-end">
            <Button onClick={() => setResetInfo(null)}>{t("close")}</Button>
          </div>
        </Modal>
      )}
    </div>
  );
}
