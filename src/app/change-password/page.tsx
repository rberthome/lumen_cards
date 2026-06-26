import { getTranslations } from "next-intl/server";
import { AuthShell } from "@/features/auth/components/AuthShell";
import { ChangePasswordForm } from "@/features/auth";

export default async function ChangePasswordPage() {
  const t = await getTranslations("auth");
  return (
    <AuthShell title={t("changeTitle")} subtitle={t("changeSubtitle")}>
      <ChangePasswordForm />
    </AuthShell>
  );
}
