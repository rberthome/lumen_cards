import { ref, watch, nextTick, onBeforeUnmount, type Ref } from 'vue';

const FOCUSABLE_SELECTOR = [
  'a[href]',
  'button:not([disabled])',
  'textarea:not([disabled])',
  'input:not([disabled])',
  'select:not([disabled])',
  '[tabindex]:not([tabindex="-1"])',
].join(', ');

const FIELD_TAGS = ['INPUT', 'TEXTAREA', 'SELECT'];

interface FocusTrapOptions {
  /** Appelé quand l'utilisateur presse Échap pendant que le piège est actif. */
  onEscape?: () => void;
}

/**
 * Système de focus pour les conteneurs modaux : à l'activation focalise le premier
 * champ saisissable (sinon le premier élément focusable), enferme le Tab dans le
 * conteneur, ferme sur Échap et restaure le focus précédent à la désactivation.
 */
export function useFocusTrap(active: Ref<boolean>, options: FocusTrapOptions = {}) {
  const container = ref<HTMLElement | null>(null);
  let previouslyFocused: HTMLElement | null = null;

  function getFocusable(): HTMLElement[] {
    if (!container.value) return [];
    return Array.from(
      container.value.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR),
    ).filter((el) => el.offsetParent !== null);
  }

  function focusInitial() {
    const focusable = getFocusable();
    const firstField = focusable.find((el) => FIELD_TAGS.includes(el.tagName));
    (firstField ?? focusable[0] ?? container.value)?.focus();
  }

  function onKeydown(e: KeyboardEvent) {
    if (e.key === 'Escape') {
      options.onEscape?.();
      return;
    }
    if (e.key !== 'Tab') return;

    const focusable = getFocusable();
    if (focusable.length === 0) {
      e.preventDefault();
      return;
    }
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    const activeEl = document.activeElement;

    if (e.shiftKey && (activeEl === first || activeEl === container.value)) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && activeEl === last) {
      e.preventDefault();
      first.focus();
    }
  }

  function deactivate() {
    document.removeEventListener('keydown', onKeydown);
    previouslyFocused?.focus?.();
    previouslyFocused = null;
  }

  watch(active, async (isActive) => {
    if (isActive) {
      previouslyFocused = document.activeElement as HTMLElement | null;
      document.addEventListener('keydown', onKeydown);
      await nextTick();
      focusInitial();
    } else {
      deactivate();
    }
  });

  onBeforeUnmount(() => {
    document.removeEventListener('keydown', onKeydown);
  });

  return { container };
}
