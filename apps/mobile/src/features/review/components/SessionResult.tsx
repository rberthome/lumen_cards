import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { colors, spacing, typography, shadows } from '@/design-system/tokens';
import type { ReviewResultDto } from '@lumen_cards/types';

const LEVEL_LABELS: Record<string, string> = {
  apprentice: 'Apprenti',
  companion: 'Compagnon',
  master: 'Maître',
  grand_master: 'Grand Maître',
};

interface Props {
  result: ReviewResultDto;
  onRestart: () => void;
  onClose: () => void;
}

export function SessionResult({ result, onRestart, onClose }: Props) {
  const accuracyPct = Math.round(result.accuracy * 100);
  const durationSec = Math.round(result.duration_ms / 1000);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        {accuracyPct >= 80 ? 'Bravo, Frère !' : 'Continue sur cette voie'}
      </Text>
      <Text style={styles.level}>{LEVEL_LABELS[result.level] ?? result.level}</Text>

      <View style={styles.statsGrid}>
        <Stat label="Cartes révisées" value={String(result.cards_reviewed)} />
        <Stat label="Précision" value={`${accuracyPct}%`} highlight={accuracyPct >= 80} />
        <Stat label="XP gagnés" value={`+${result.xp_earned}`} highlight />
        <Stat label="Série" value={`${result.streak_days}j`} />
        <Stat label="Durée" value={`${durationSec}s`} />
      </View>

      <View style={styles.actions}>
        <TouchableOpacity style={styles.restartBtn} onPress={onRestart}>
          <Text style={styles.restartText}>Nouvelle session</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
          <Text style={styles.closeText}>Terminer</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

function Stat({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) {
  return (
    <View style={[styles.stat, highlight && styles.statHighlight]}>
      <Text style={[styles.statValue, highlight && styles.statValueHighlight]}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: spacing[6], justifyContent: 'center', alignItems: 'center' },
  title: {
    fontSize: typography.fontSize['3xl'],
    fontWeight: typography.fontWeight.bold,
    color: colors.neutral[900],
    textAlign: 'center',
    marginBottom: spacing[1],
  },
  level: {
    fontSize: typography.fontSize.base,
    color: colors.gold[600],
    fontWeight: typography.fontWeight.semibold,
    letterSpacing: 2,
    textTransform: 'uppercase',
    marginBottom: spacing[8],
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing[3],
    justifyContent: 'center',
    marginBottom: spacing[8],
    width: '100%',
  },
  stat: {
    backgroundColor: colors.neutral[50],
    borderRadius: 16,
    padding: spacing[4],
    alignItems: 'center',
    minWidth: 90,
    ...shadows.sm,
  },
  statHighlight: {
    backgroundColor: colors.gold[50],
    borderWidth: 1,
    borderColor: colors.gold[200],
  },
  statValue: {
    fontSize: typography.fontSize['2xl'],
    fontWeight: typography.fontWeight.bold,
    color: colors.neutral[900],
  },
  statValueHighlight: { color: colors.gold[700] },
  statLabel: {
    fontSize: typography.fontSize.xs,
    color: colors.neutral[500],
    marginTop: spacing[1],
  },
  actions: { width: '100%', gap: spacing[3] },
  restartBtn: {
    backgroundColor: colors.gold[500],
    paddingVertical: spacing[4],
    borderRadius: 16,
    alignItems: 'center',
  },
  restartText: {
    color: colors.neutral[0],
    fontWeight: typography.fontWeight.bold,
    fontSize: typography.fontSize.lg,
  },
  closeBtn: {
    paddingVertical: spacing[4],
    borderRadius: 16,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: colors.neutral[200],
  },
  closeText: {
    color: colors.neutral[600],
    fontWeight: typography.fontWeight.medium,
    fontSize: typography.fontSize.base,
  },
});
