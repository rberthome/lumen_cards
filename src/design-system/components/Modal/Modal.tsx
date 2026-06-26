"use client";

import { useEffect, useRef, type ReactNode } from "react";

const FOCUSABLE =
  'a[href],button:not([disabled]),input:not([disabled]),textarea:not([disabled]),select:not([disabled]),[tabindex]:not([tabindex="-1"])';

export interface ModalProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
}

// Système de focus : focalise le 1er champ à l'ouverture, enferme le Tab,
// Échap pour fermer, restaure le focus précédent à la fermeture.
export function Modal({ open, onClose, title, children }: ModalProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const panel = ref.current;
    const previous = document.activeElement as HTMLElement | null;

    const focusables = () =>
      panel
        ? Array.from(panel.querySelectorAll<HTMLElement>(FOCUSABLE)).filter(
            (el) => el.offsetParent !== null,
          )
        : [];

    const list = focusables();
    const field = list.find((el) =>
      ["INPUT", "TEXTAREA", "SELECT"].includes(el.tagName),
    );
    (field ?? list[0] ?? panel)?.focus();

    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") {
        onClose();
        return;
      }
      if (e.key !== "Tab") return;
      const f = focusables();
      if (f.length === 0) return;
      const first = f[0];
      const last = f[f.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }

    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("keydown", onKey);
      previous?.focus?.();
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
      <div
        className="absolute inset-0 bg-[rgba(15,23,42,.55)]"
        onClick={onClose}
        aria-hidden
      />
      <div
        ref={ref}
        role="dialog"
        aria-modal="true"
        aria-label={title}
        tabIndex={-1}
        className="relative z-10 w-full max-w-md rounded-[var(--radius-lg)] bg-white p-7 shadow-[var(--shadow-lg)] focus:outline-none"
      >
        {title && (
          <h2 className="mb-5 font-serif text-xl font-semibold text-neutral-900">
            {title}
          </h2>
        )}
        {children}
      </div>
    </div>
  );
}
