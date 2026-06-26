"use client";

import { useRef, useState } from "react";
import { reviewMode } from "../scheduler";
import { recordResult } from "../submit";
import type { DueCard } from "../repository";
import type { SessionCard, ReviewResultSummary } from "../sessionTypes";

export type SessionPhase = "question" | "feedback" | "done";

const MAX_REQUEUE = 2;

function shuffle<T>(arr: T[]): T[] {
  return [...arr].sort(() => Math.random() - 0.5);
}

function toSessionCard(c: DueCard): SessionCard {
  const hasChoices = Boolean(c.wrongAnswer1);
  const mode = reviewMode(c.successCount, hasChoices);
  const choices =
    mode === "qcm"
      ? shuffle(
          [c.back, c.wrongAnswer1, c.wrongAnswer2, c.wrongAnswer3].filter(
            (x): x is string => Boolean(x),
          ),
        )
      : [];
  return {
    id: c.id,
    front: c.front,
    back: c.back,
    explanation: c.explanation,
    mode,
    choices,
  };
}

export function useReviewSession(initial: DueCard[]) {
  const [queue, setQueue] = useState<SessionCard[]>(() =>
    initial.map(toSessionCard),
  );
  const [index, setIndex] = useState(0);
  const [phase, setPhase] = useState<SessionPhase>("question");
  const [selected, setSelected] = useState<string | null>(null);
  const [correct, setCorrect] = useState(0);
  const [incorrect, setIncorrect] = useState(0);
  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState<ReviewResultSummary | null>(null);

  const answered = useRef<Set<number>>(new Set());
  const requeue = useRef<Map<number, number>>(new Map());
  const xpEarned = useRef(0);
  const streakDays = useRef(0);

  const total = initial.length;
  const current = queue[index];

  function advance(nextQueue: SessionCard[]) {
    if (index + 1 >= nextQueue.length) {
      setResult({ xpEarned: xpEarned.current, streakDays: streakDays.current });
      setPhase("done");
      return;
    }
    setQueue(nextQueue);
    setIndex(index + 1);
    setPhase("question");
    setSelected(null);
  }

  async function answer(knew: boolean) {
    const card = queue[index];
    const firstAttempt = !answered.current.has(card.id);

    let nextQueue = queue;
    if (!knew) {
      const rc = requeue.current.get(card.id) ?? 0;
      if (rc < MAX_REQUEUE) {
        nextQueue = [...queue, card];
        requeue.current.set(card.id, rc + 1);
      }
    }

    if (firstAttempt) {
      answered.current.add(card.id);
      if (knew) setCorrect((c) => c + 1);
      else setIncorrect((c) => c + 1);
      setBusy(true);
      try {
        const res = await recordResult(card.id, knew); // persiste immédiatement
        xpEarned.current += res.xp;
        streakDays.current = res.streakDays;
      } finally {
        setBusy(false);
      }
    }

    advance(nextQueue);
  }

  return {
    phase,
    current,
    selected,
    correct,
    incorrect,
    total,
    busy,
    progress: correct + incorrect,
    result,
    pickChoice: (choice: string) => {
      setSelected(choice);
      setPhase("feedback");
    },
    reveal: () => setPhase("feedback"),
    commitQcm: () => answer(selected === current.back),
    answer,
  };
}
