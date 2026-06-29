import { Progress } from "@/design-system";

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
  return (
    <div className="flex items-center gap-3.5">
      <Progress value={current} max={total} className="flex-1" />
      <div className="flex flex-shrink-0 gap-3.5 text-[13px] font-bold">
        <span className="text-correct">✓ {correct}</span>
        <span className="text-incorrect">✗ {incorrect}</span>
      </div>
      <span className="flex-shrink-0 text-[13px] text-muted">
        {current} / {total}
      </span>
    </div>
  );
}
