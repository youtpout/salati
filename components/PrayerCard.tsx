import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { PrayerName } from '@/types';
import { PRAYER_NAMES, COLORS } from '@/constants';

interface PrayerCardProps {
  prayer: PrayerName;
  time: string;
  isActive: boolean;
  isPassed: boolean;
  hasAdhan: boolean;
  isShuruq?: boolean;
}

export function PrayerCard({
  prayer,
  time,
  isActive,
  isPassed,
  hasAdhan,
  isShuruq = false,
}: PrayerCardProps) {
  return (
    <View
      style={[
        styles.card,
        isPassed && styles.cardPassed,
        isActive && styles.cardActive,
        isShuruq && styles.cardShuruq,
      ]}
    >
      {hasAdhan && (
        <View style={styles.adhanIcon}>
          <Text style={styles.adhanIconText}>🔊</Text>
        </View>
      )}
      
      <Text style={[styles.name, (isShuruq || isPassed) && styles.textMuted]}>
        {PRAYER_NAMES[prayer].fr}
      </Text>
      
      <Text style={[styles.arabic, (isShuruq || isPassed) && styles.textMuted]}>
        {PRAYER_NAMES[prayer].ar}
      </Text>
      
      <Text style={[styles.time, (isShuruq || isPassed) && styles.timeMuted]}>
        {time}
      </Text>
      
      {isActive && <View style={styles.activeBar} />}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.bgCard,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    position: 'relative',
    overflow: 'hidden',
    minWidth: 140,
  },
  cardPassed: {
    opacity: 1,
  },
  cardActive: {
    borderColor: COLORS.accentGold,
    shadowColor: COLORS.accentGold,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 15,
    elevation: 8,
  },
  cardShuruq: {
    opacity: 0.7,
  },
  adhanIcon: {
    position: 'absolute',
    top: 8,
    right: 8,
  },
  adhanIconText: {
    fontSize: 14,
  },
  name: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.textPrimary,
    marginBottom: 4,
  },
  arabic: {
    fontSize: 16,
    color: COLORS.textMuted,
    marginBottom: 8,
  },
  time: {
    fontSize: 24,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  timeMuted: {
    color: COLORS.textSecondary,
  },
  textMuted: {
    color: COLORS.textMuted,
  },
  activeBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 3,
    backgroundColor: COLORS.accentGold,
  },
});
