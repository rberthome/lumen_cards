"use client";

import { useState, useTransition, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { Modal, Input, Select, Button } from "@/design-system";
import { createUser } from "../actions";

export function UserFormModal({ onClose }: { onClose: () => void }) {
  const t = useTranslations("users");
  const tc = useTranslations("common");
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [form, setForm] = useState({
    name: "",
    email: "",
    role: "user",
    password: "",
  });
  const [error, setError] = useState<string>();

  function set(field: keyof typeof form, value: string) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    startTransition(async () => {
      const res = await createUser(form);
      if (res.error) {
        setError(res.error);
        return;
      }
      onClose();
      router.refresh();
    });
  }

  return (
    <Modal open onClose={onClose} title={t("new")}>
      <form onSubmit={onSubmit} className="flex flex-col gap-4">
        <Input
          label={t("fieldName")}
          value={form.name}
          onChange={(e) => set("name", e.target.value)}
          required
        />
        <Input
          label={t("fieldEmail")}
          type="email"
          value={form.email}
          onChange={(e) => set("email", e.target.value)}
          required
        />
        <Select
          label={t("fieldRole")}
          value={form.role}
          onChange={(e) => set("role", e.target.value)}
          options={[
            { value: "user", label: t("roleUser") },
            { value: "admin", label: t("roleAdmin") },
          ]}
        />
        <Input
          label={t("fieldPassword")}
          value={form.password}
          onChange={(e) => set("password", e.target.value)}
          required
        />
        {error && <p className="text-sm text-incorrect">{error}</p>}
        <div className="mt-1 flex justify-end gap-3">
          <Button type="button" variant="secondary" onClick={onClose}>
            {tc("cancel")}
          </Button>
          <Button type="submit" disabled={pending}>
            {pending ? tc("saving") : tc("save")}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
