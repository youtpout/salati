import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Location, HijriDate } from '@/types';
import { COLORS } from '@/constants';

interface HeaderProps {
  location: Location | null;
  hijriDate: HijriDate | null;
  onSettingsPress: () => void;
}

export function Header({ location, hijriDate, onSettingsPress }: HeaderProps) {
  const today = new Date();
  
  const gregorianDate = today.toLocaleDateString('fr-FR', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const hijriDisplay = hijriDate
    ? `${hijriDate.day} ${hijriDate.month.ar} ${hijriDate.year}`
    : '';

  return (
    <View style={styles.container}>
      <View style={styles.dateSection}>
        <Text style={styles.gregorianDate}>{gregorianDate}</Text>
        {hijriDisplay && <Text style={styles.hijriDate}>{hijriDisplay}</Text>}
      </View>

      <TouchableOpacity style={styles.settingsButton} onPress={onSettingsPress}>
        <Text style={styles.settingsIcon}>⚙️</Text>
      </TouchableOpacity>

      <View style={styles.locationSection}>
        {location && (
          <>
            <Text style={styles.locationName}>{location.city}</Text>
            <Text style={styles.locationCountry}>{location.country}</Text>
          </>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 8,
    marginBottom: 16,
  },
  dateSection: {
    flex: 1,
  },
  gregorianDate: {
    fontSize: 16,
    color: COLORS.textSecondary,
    fontWeight: '300',
    textTransform: 'capitalize',
  },
  hijriDate: {
    fontSize: 20,
    color: COLORS.accentGold,
    marginTop: 4,
  },
  settingsButton: {
    backgroundColor: COLORS.bgCard,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 12,
    padding: 12,
  },
  settingsIcon: {
    fontSize: 24,
  },
  locationSection: {
    flex: 1,
    alignItems: 'flex-end',
  },
  locationName: {
    fontSize: 16,
    color: COLORS.textPrimary,
    fontWeight: '500',
  },
  locationCountry: {
    fontSize: 14,
    color: COLORS.textSecondary,
  },
});
