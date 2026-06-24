import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { studyApi } from '../api/studyApi';
import { useReviewStore } from '../store/reviewStore';

export function useReview(deckId: number) {
  const store = useReviewStore();
  const router = useRouter();
  const loadingSession = ref(false);
  const submitting = ref(false);
  const error = ref<string | null>(null);

  async function startSession() {
    loadingSession.value = true;
    error.value = null;
    try {
      const limit = store.sessionSize === 'all' ? undefined : store.sessionSize;
      const { data } = await studyApi.getSession(deckId, limit);
      store.startSession(data.id, data.cards);
    } catch {
      error.value = 'errors.generic';
    } finally {
      loadingSession.value = false;
    }
  }

  async function submitAndFinish() {
    if (!store.sessionId || store.reviewLog.length === 0) return;
    submitting.value = true;
    try {
      const { data } = await studyApi.submitReview({
        session_id: store.sessionId,
        items: store.reviewLog,
        total_duration_ms: Date.now() - store.sessionStartTime,
      });
      store.setResult(data);
    } catch {
      error.value = 'errors.generic';
    } finally {
      submitting.value = false;
    }
  }

  function goBack() {
    store.reset();
    router.push(`/app/decks/${deckId}`);
  }

  return { store, loadingSession, submitting, error, startSession, submitAndFinish, goBack };
}
