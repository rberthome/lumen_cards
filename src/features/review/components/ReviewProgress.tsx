export function ReviewProgress({
  current,
  total,
  correct,
  incorrect,
}: {
  current: number;
  total: number;
  correct: number;
  incorrect: number;
}) {
  const pct = total > 0 ? Math.round((current / total) * 100) : 0;
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between text-sm text-neutral-500">
        <span>
          {current} / {total}
        </span>
        <div className="flex gap-3">
          <span className="text-[#15803D]">✓ {correct}</span>
          <span className="text-error">✗ {incorrect}</span>
        </div>
      </div>
      <div className="h-2 w-full overflow-hidden rounded-full bg-neutral-100">
        <div
          className="h-full rounded-full bg-gradient-to-r from-gold-400 to-gold-600 transition-all duration-300"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}
