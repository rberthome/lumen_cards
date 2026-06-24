import React, { useRef, useEffect } from 'react';
import { View, Text, TouchableOpacity, Animated, ScrollView } from 'react-native';
import type { ReviewSessionCard, SessionProgress } from '../types';
import { styles } from './cardFlipStyles';

// AnimatedComponent<T> interface extends React.FC but TypeScript loses the call
// signature in some resolution paths — cast to FC to restore JSX compatibility.
const AnimatedView = Animated.View as React.FC<
  Animated.AnimatedProps<import('react-native').ViewProps>
>;

interface Props {
  card: ReviewSessionCard;
  phase: 'front' | 'back' | 'explanation';
  progress: SessionProgress;
  onReveal: () => void;
  onKnew: () => void;
  onDidntKnow: () => void;
  onContinue: () => void;
}

export function CardFlip({
  card,
  phase,
  progress,
  onReveal,
  onKnew,
  onDidntKnow,
  onContinue,
}: Props) {
  const flipAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (phase === 'back' || phase === 'explanation') {
      Animated.spring(flipAnim, {
        toValue: 1,
        useNativeDriver: true,
        tension: 60,
        friction: 8,
      }).start();
    } else {
      flipAnim.setValue(0);
    }
  }, [phase, flipAnim]);

  const frontRotate = flipAnim.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '180deg'] });
  const backRotate = flipAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['180deg', '360deg'],
  });

  const progressPct = ((progress.current - 1) / progress.total) * 100;

  return (
    <View style={styles.container}>
      <View style={styles.progressBar}>
        <View style={[styles.progressFill, { width: `${progressPct}%` }]} />
      </View>
      <Text style={styles.progressText}>
        {progress.current - 1} / {progress.total}
      </Text>

      <View style={styles.cardWrapper}>
        <AnimatedView
          style={[styles.card, styles.cardFront, { transform: [{ rotateY: frontRotate }] }]}
        >
          <ScrollView contentContainerStyle={styles.cardContent}>
            <Text style={styles.cardLabel}>Question</Text>
            <Text style={styles.cardText}>{card.front}</Text>
            {card.source && <Text style={styles.source}>{card.source}</Text>}
          </ScrollView>
        </AnimatedView>

        <AnimatedView
          style={[styles.card, styles.cardBack, { transform: [{ rotateY: backRotate }] }]}
        >
          <ScrollView contentContainerStyle={styles.cardContent}>
            <Text style={styles.cardLabel}>Réponse</Text>
            <Text style={styles.cardText}>{card.back}</Text>
            {phase === 'explanation' && card.explanation && (
              <View style={styles.explanation}>
                <Text style={styles.explanationLabel}>Explication</Text>
                <Text style={styles.explanationText}>{card.explanation}</Text>
              </View>
            )}
          </ScrollView>
        </AnimatedView>
      </View>

      {phase === 'front' && (
        <TouchableOpacity style={styles.revealBtn} onPress={onReveal}>
          <Text style={styles.revealText}>Révéler la réponse</Text>
        </TouchableOpacity>
      )}

      {phase === 'back' && (
        <View style={styles.actions}>
          <TouchableOpacity style={[styles.actionBtn, styles.actionNo]} onPress={onDidntKnow}>
            <Text style={styles.actionNoText}>✗ Je ne savais pas</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.actionBtn, styles.actionYes]} onPress={onKnew}>
            <Text style={styles.actionYesText}>✓ Je savais</Text>
          </TouchableOpacity>
        </View>
      )}

      {phase === 'explanation' && (
        <TouchableOpacity style={styles.continueBtn} onPress={onContinue}>
          <Text style={styles.continueText}>Continuer →</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}
