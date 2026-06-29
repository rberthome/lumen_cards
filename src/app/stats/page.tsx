import { redirect } from "next/navigation";
import { getSession } from "@/features/auth";
import { getLearnerStats, StatsView } from "@/features/stats";
import { StudyHeader } from "@/features/study/components/StudyHeader";

export default async function StatsPage() {
  const session = await getSession();
  if (!session) redirect("/login");

  const stats = await getLearnerStats(session.userId);

  return (
    <div className="min-h-screen bg-background">
      <StudyHeader
        streakDays={stats.streakDays}
        isAdmin={session.role === "admin"}
      />
      <main className="mx-auto max-w-3xl px-6 py-10">
        <StatsView stats={stats} />
      </main>
    </div>
  );
}
