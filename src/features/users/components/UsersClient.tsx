"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { Button, Modal } from "@/design-system";
import { UserFormModal } from "./UserFormModal";
import { resetUserPassword, deleteUser } from "../actions";
import type { UserListItem } from "../types";

const th = "px-4 py-3 font-medium";
const td = "px-4 py-3";
const pill = "rounded-full px-2.5 py-1 text-xs font-semibold";

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
        <h1 className="font-serif text-2xl font-semibold text-neutral-900">
          {t("title")}
        </h1>
        <Button onClick={() => setOpen(true)}>{t("new")}</Button>
      </div>

      {error && <p className="text-sm text-error">{error}</p>}

      <div className="overflow-x-auto rounded-[var(--radius-lg)] border border-neutral-200 bg-white">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-neutral-200 text-neutral-500">
            <tr>
              <th className={th}>{t("colName")}</th>
              <th className={th}>{t("colEmail")}</th>
              <th className={th}>{t("colRole")}</th>
              <th className={th}>{t("colStatus")}</th>
              <th className={th} aria-label={tc("actions")} />
            </tr>
          </thead>
          <tbody>
            {users.length === 0 ? (
              <tr>
                <td
                  className="px-4 py-10 text-center text-neutral-400"
                  colSpan={5}
                >
                  {t("empty")}
                </td>
              </tr>
            ) : (
              users.map((u) => (
                <tr
                  key={u.id}
                  className="border-b border-neutral-100 last:border-0"
                >
                  <td className={`${td} font-medium text-neutral-900`}>
                    {u.name}
                  </td>
                  <td className={`${td} text-neutral-500`}>{u.email}</td>
                  <td className={td}>
                    <span
                      className={`${pill} ${
                        u.role === "admin"
                          ? "bg-gold-50 text-gold-700"
                          : "bg-neutral-100 text-neutral-500"
                      }`}
                    >
                      {u.role === "admin" ? t("roleAdmin") : t("roleUser")}
                    </span>
                  </td>
                  <td className={`${td} text-neutral-500`}>
                    {u.mustChangePassword ? t("mustChange") : t("active")}
                  </td>
                  <td className={td}>
                    <div className="flex justify-end gap-2">
                      <Button
                        size="sm"
                        variant="secondary"
                        disabled={pending}
                        onClick={() => onReset(u)}
                      >
                        {t("reset")}
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
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

      {open && <UserFormModal onClose={() => setOpen(false)} />}

      {resetInfo && (
        <Modal open onClose={() => setResetInfo(null)} title={t("tempTitle")}>
          <p className="text-sm text-neutral-600">
            {t("tempHint", { name: resetInfo.name })}
          </p>
          <p className="mt-3 select-all rounded-[var(--radius-md)] bg-neutral-50 px-4 py-3 text-center font-mono text-lg text-neutral-900">
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
