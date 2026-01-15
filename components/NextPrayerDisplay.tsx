import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { NextPrayer } from '@/types';
import { PRAYER_NAMES, COLORS } from '@/constants';

interface NextPrayerDisplayProps {
  nextPrayer: NextPrayer;
  getCountdown: (time: string, tomorrow?: boolean) => string;
}

export function NextPrayerDisplay({ nextPrayer, getCountdown }: NextPrayerDisplayProps) {
  const [countdown, setCountdown] = useState('');

  useEffect(() => {
    const updateCountdown = () => {
      setCountdown(getCountdown(nextPrayer.time, nextPrayer.tomorrow));
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, [nextPrayer, getCountdown]);

  return (
    <View style={styles.container}>
      <View style={styles.glowOverlay} />
      
      <Text style={styles.label}>
        Prochaine prière{nextPrayer.tomorrow ? ' (demain)' : ''}
      </Text>
      
      <Text style={styles.name}>
        {PRAYER_NAMES[nextPrayer.name].fr}
      </Text>
      
      <Text style={styles.time}>
        {nextPrayer.time}
      </Text>
      
      <Text style={styles.countdown}>
        Dans <Text style={styles.countdownHighlight}>{countdown}</Text>
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
     alignSelf: 'center',
    backgroundColor: COLORS.bgCard,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 24,
    padding: 6,
    paddingHorizontal: 20,
    alignItems: 'center',
    position: 'relative',
    overflow: 'hidden',
  },
  glowOverlay: {
    position: 'absolute',
    top: -100,
    left: -100,
    right: -100,
    bottom: -100,
    backgroundColor: COLORS.accentGold,
    opacity: 0.03,
    borderRadius: 1000,
  },
  label: {
    fontSize: 14,
    color: COLORS.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 3,
    marginBottom: 3,
  },
  name: {
    fontSize: 48,
    fontWeight: '700',
    color: COLORS.accentGold,
    marginBottom: 3,
    textShadowColor: COLORS.accentGold,
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 20,
  },
  time: {
    fontSize: 64,
    fontWeight: '700',
    color: COLORS.textPrimary,
    letterSpacing: 2,
    marginBottom: 6,
  },
  countdown: {
    fontSize: 20,
    color: COLORS.textSecondary,
  },
  countdownHighlight: {
    color: COLORS.accentEmerald,
    fontWeight: '600',
  },
});
