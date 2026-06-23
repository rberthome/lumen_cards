import React, { useEffect } from 'react';
import { View, Text, ActivityIndicator, StyleSheet, SafeAreaView } from 'react-native';
import { colors, spacing, typography } from '@/design-system/tokens';
import { useReviewSession } from '../hooks/useReviewSession';
import { SessionConfig } from './SessionConfig';
import { CardFlip } from './CardFlip';
import { SessionResult } from './SessionResult';
import type { ReviewPhase } from '../store/reviewStore';

interface Props {
  deckId: number;
  deckTitle: string;
  dueToday: number;
  onClose: () => void;
}

function isCardPhase(phase: ReviewPhase): phase is 'front' | 'back' | 'explanation' {
  return phase === 'front' || phase === 'back' || phase === 'explanation';
}

export function ReviewScreen({ deckId, deckTitle, dueToday, onClose }: Props) {
  const {
    phase,
    currentCard,
    progress,
    sessionSize,
    setSessionSize,
    result,
    isLoading,
    isSubmitting,
    error,
    startSession,
    revealCard,
    answer,
    continueAfterExplanation,
    finishSession,
    reset,
  } = useReviewSession(deckId);

  useEffect(() => {
    if (phase === 'result' && !result && !isSubmitting) {
      finishSession();
    }
  }, [phase, result, isSubmitting, finishSession]);

  if (isLoading) {
    return (
      <SafeAreaView style={styles.center}>
        <ActivityIndicator size="large" color={colors.gold[500]} />
        <Text style={styles.loadingText}>Chargement des cartes…</Text>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={styles.center}>
        <Text style={styles.errorText}>Erreur lors du chargement</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.root}>
      {phase === 'config' && (
        <SessionConfig
          deckTitle={deckTitle}
          dueToday={dueToday}
          selected={sessionSize}
          onSelect={setSessionSize}
          onStart={startSession}
        />
      )}

      {isCardPhase(phase) && currentCard && (
        <CardFlip
          card={currentCard}
          phase={phase}
          progress={progress}
          onReveal={revealCard}
          onKnew={() => answer(true)}
          onDidntKnow={() => answer(false)}
          onContinue={continueAfterExplanation}
        />
      )}

      {phase === 'result' && (
        <>
          {isSubmitting || !result ? (
            <View style={styles.center}>
              <ActivityIndicator size="large" color={colors.gold[500]} />
              <Text style={styles.loadingText}>Calcul des résultats…</Text>
            </View>
          ) : (
            <SessionResult result={result} onRestart={() => reset()} onClose={onClose} />
          )}
        </>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.neutral[50] },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', gap: spacing[3] },
  loadingText: { color: colors.neutral[500], fontSize: typography.fontSize.base },
  errorText: { color: colors.semantic.error, fontSize: typography.fontSize.base },
});
