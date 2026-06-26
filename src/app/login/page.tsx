import { AuthShell } from "@/features/auth/components/AuthShell";
import { LoginForm } from "@/features/auth";

export default function LoginPage() {
  return (
    <AuthShell title="LumenCards" subtitle="Accès sur invitation">
      <LoginForm />
    </AuthShell>
  );
}
