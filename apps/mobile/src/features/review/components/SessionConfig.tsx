import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { colors, spacing, typography } from '@/design-system/tokens';
import type { SessionSize } from '../types';

const SIZES: { label: string; value: SessionSize }[] = [
  { label: '5', value: 5 },
  { label: '10', value: 10 },
  { label: '20', value: 20 },
  { label: '∞ Tout', value: 'all' },
];

interface Props {
  selected: SessionSize;
  onSelect: (size: SessionSize) => void;
  onStart: () => void;
  deckTitle: string;
  dueToday: number;
}

export function SessionConfig({ selected, onSelect, onStart, deckTitle, dueToday }: Props) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{deckTitle}</Text>
      <Text style={styles.due}>{dueToday} cartes à réviser aujourd'hui</Text>

      <Text style={styles.label}>Combien de cartes ?</Text>
      <View style={styles.grid}>
        {SIZES.map((s) => (
          <TouchableOpacity
            key={String(s.value)}
            style={[styles.option, selected === s.value && styles.optionSelected]}
            onPress={() => onSelect(s.value)}
          >
            <Text style={[styles.optionText, selected === s.value && styles.optionTextSelected]}>
              {s.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <TouchableOpacity style={styles.startBtn} onPress={onStart}>
        <Text style={styles.startText}>Commencer la révision</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: spacing[6], justifyContent: 'center' },
  title: {
    fontSize: typography.fontSize['2xl'],
    fontWeight: typography.fontWeight.bold,
    color: colors.neutral[900],
    marginBottom: spacing[1],
    textAlign: 'center',
  },
  due: {
    fontSize: typography.fontSize.base,
    color: colors.neutral[500],
    textAlign: 'center',
    marginBottom: spacing[8],
  },
  label: {
    fontSize: typography.fontSize.sm,
    color: colors.neutral[600],
    marginBottom: spacing[3],
    fontWeight: typography.fontWeight.medium,
  },
  grid: { flexDirection: 'row', gap: spacing[2], marginBottom: spacing[8] },
  option: {
    flex: 1,
    paddingVertical: spacing[3],
    borderRadius: 12,
    borderWidth: 2,
    borderColor: colors.neutral[200],
    alignItems: 'center',
  },
  optionSelected: { borderColor: colors.gold[500], backgroundColor: colors.gold[50] },
  optionText: {
    fontSize: typography.fontSize.base,
    color: colors.neutral[600],
    fontWeight: typography.fontWeight.medium,
  },
  optionTextSelected: { color: colors.gold[700], fontWeight: typography.fontWeight.bold },
  startBtn: {
    backgroundColor: colors.gold[500],
    paddingVertical: spacing[4],
    borderRadius: 16,
    alignItems: 'center',
  },
  startText: {
    color: colors.neutral[0],
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.bold,
  },
});
