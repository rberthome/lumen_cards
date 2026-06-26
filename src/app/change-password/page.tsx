import { AuthShell } from "@/features/auth/components/AuthShell";
import { ChangePasswordForm } from "@/features/auth";

export default function ChangePasswordPage() {
  return (
    <AuthShell
      title="Nouveau mot de passe"
      subtitle="Choisis un mot de passe pour sécuriser ton compte."
    >
      <ChangePasswordForm />
    </AuthShell>
  );
}
