import { describe, it, expect } from "vitest";
import {
  INTERVAL_DAYS,
  MAX_LEVEL,
  addDays,
  nextSchedule,
  reviewMode,
  isDue,
} from "../scheduler";

const NOW = new Date("2026-06-01T12:00:00.000Z");
const daysBetween = (a: Date, b: Date) =>
  Math.round((a.getTime() - b.getTime()) / (24 * 60 * 60 * 1000));

describe("nextSchedule — réussite", () => {
  it("première réussite : palier 0 → 1, due dans 1 jour", () => {
    const s = nextSchedule({ level: 0, successCount: 0 }, true, NOW);
    expect(s.level).toBe(1);
    expect(s.successCount).toBe(1);
    expect(daysBetween(s.nextReviewAt, NOW)).toBe(INTERVAL_DAYS[0]);
  });

  it("suit la progression d'intervalles 1/3/7/21/60", () => {
    const observed: number[] = [];
    let state = { level: 0, successCount: 0 };
    for (let i = 0; i < INTERVAL_DAYS.length; i++) {
      const s = nextSchedule(state, true, NOW);
      observed.push(daysBetween(s.nextReviewAt, NOW));
      state = { level: s.level, successCount: s.successCount };
    }
    expect(observed).toEqual([...INTERVAL_DAYS]);
  });

  it("plafonne au dernier palier (60 j)", () => {
    const s = nextSchedule({ level: MAX_LEVEL, successCount: 9 }, true, NOW);
    expect(s.level).toBe(MAX_LEVEL);
    expect(daysBetween(s.nextReviewAt, NOW)).toBe(INTERVAL_DAYS[MAX_LEVEL]);
  });
});

describe("nextSchedule — échec", () => {
  it("retombe au palier 0, due immédiatement, successCount conservé", () => {
    const s = nextSchedule({ level: 3, successCount: 5 }, false, NOW);
    expect(s.level).toBe(0);
    expect(s.successCount).toBe(5);
    expect(s.nextReviewAt.getTime()).toBe(NOW.getTime());
  });
});

describe("reviewMode", () => {
  it("QCM sous le seuil quand la carte a des choix", () => {
    expect(reviewMode(0, true)).toBe("qcm");
    expect(reviewMode(2, true)).toBe("qcm");
  });
  it("réponse libre au seuil et au-delà", () => {
    expect(reviewMode(3, true)).toBe("free");
    expect(reviewMode(10, true)).toBe("free");
  });
  it("toujours libre sans mauvaises réponses", () => {
    expect(reviewMode(0, false)).toBe("free");
  });
});

describe("isDue", () => {
  it("due si jamais révisée", () => {
    expect(isDue(null, NOW)).toBe(true);
  });
  it("due si l'échéance est passée", () => {
    expect(isDue(addDays(NOW, -1), NOW)).toBe(true);
  });
  it("pas due si l'échéance est future", () => {
    expect(isDue(addDays(NOW, 1), NOW)).toBe(false);
  });
});
