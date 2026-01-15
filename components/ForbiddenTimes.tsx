import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { ForbiddenTime } from '@/types';
import { COLORS } from '@/constants';

interface ForbiddenTimesProps {
  times: ForbiddenTime[];
}

export function ForbiddenTimesDisplay({ times }: ForbiddenTimesProps) {
  return (
    <View style={styles.container}>
      {times.map((ft, index) => (
        <View key={index} style={styles.item}>
          <Text style={styles.icon}>🚫</Text>
          <Text style={styles.text}>
            {ft.label}: {ft.time}
          </Text>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'center',
    flexWrap: 'wrap',
    gap: 24,
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
    borderRadius: 12,
    padding: 16,
    marginTop: 16,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  icon: {
    fontSize: 14,
  },
  text: {
    color: COLORS.danger,
    fontSize: 14,
  },
});
