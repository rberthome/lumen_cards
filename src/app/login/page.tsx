import { getTranslations } from "next-intl/server";
import { AuthShell } from "@/features/auth/components/AuthShell";
import { LoginForm } from "@/features/auth";

export default async function LoginPage() {
  const t = await getTranslations();
  return (
    <AuthShell
      title={t("app.name")}
      subtitle={t("auth.loginSubtitle")}
      footer={t("auth.invitationNote")}
    >
      <LoginForm />
    </AuthShell>
  );
}
