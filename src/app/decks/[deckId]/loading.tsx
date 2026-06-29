import { Skeleton } from "@/design-system";

export default function Loading() {
  return (
    <div className="min-h-screen">
      <div className="border-b border-line bg-surface">
        <div className="mx-auto flex max-w-3xl items-center gap-3.5 px-6 py-3">
          <Skeleton className="h-9 w-9" />
          <Skeleton className="h-6 w-48" />
        </div>
      </div>
      <main className="mx-auto flex max-w-3xl flex-col gap-7 px-6 py-7">
        <Skeleton className="h-40 w-full" />
        <Skeleton className="h-14 w-full" />
        <div className="flex flex-col gap-2.5">
          {[0, 1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-[72px] w-full" />
          ))}
        </div>
      </main>
    </div>
  );
}
