import { Suspense } from "react";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { getSession } from "@/features/auth";
import { StudyHeader } from "@/features/study/components/StudyHeader";
import { DueDecksList } from "@/features/study/components/DueDecksList";
import { DecksSkeleton } from "@/features/study/components/DecksSkeleton";

export default async function Home() {
  const session = await getSession();
  if (!session) redirect("/login");

  const user = await db.user.findUnique({ where: { id: session.userId } });

  return (
    <div className="min-h-screen">
      <StudyHeader
        streakDays={user?.streakDays ?? 0}
        isAdmin={session.role === "admin"}
      />
      <main className="mx-auto max-w-3xl px-6 py-10">
        <Suspense fallback={<DecksSkeleton />}>
          <DueDecksList userId={session.userId} />
        </Suspense>
      </main>
    </div>
  );
}
