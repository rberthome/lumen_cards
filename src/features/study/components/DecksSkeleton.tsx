// Squelette affiché pendant le streaming de la liste des decks (loading.tsx-like via Suspense).
export function DecksSkeleton() {
  return (
    <div className="flex flex-col gap-6">
      <div className="h-14 animate-pulse rounded-[var(--radius-lg)] bg-neutral-100" />
      <div className="grid gap-3 sm:grid-cols-2">
        {[0, 1, 2, 3].map((i) => (
          <div
            key={i}
            className="h-24 animate-pulse rounded-[var(--radius-lg)] bg-neutral-100"
          />
        ))}
      </div>
    </div>
  );
}
