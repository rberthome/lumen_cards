import { Skeleton } from "@/design-system";

// Squelette affiché pendant le streaming de la liste des decks (via <Suspense>).
export function DecksSkeleton() {
  return (
    <div className="flex flex-col gap-8">
      <Skeleton className="h-28 w-full" />
      {[0, 1].map((section) => (
        <div key={section} className="flex flex-col gap-3">
          <Skeleton className="h-4 w-40" />
          {[0, 1, 2].map((i) => (
            <Skeleton key={i} className="h-[88px] w-full" />
          ))}
        </div>
      ))}
    </div>
  );
}
