import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import {
  usePrayerTimes,
  useSettings,
  usePrayerCalculations,
  useAdhan,
} from '@/hooks';
import {
  Header,
  NextPrayerDisplay,
  PrayerCard,
  ForbiddenTimesDisplay,
  SettingsModal,
} from '@/components';
import { PrayerName } from '@/types';
import { COLORS } from '@/constants';

export default function HomeScreen() {
  const { prayerTimes, location, hijriDate, loading, error } = usePrayerTimes();
  const { settings, updateSettings, loaded: settingsLoaded } = useSettings();
  const { getNextPrayer, hasPassed, getCountdown, getForbiddenTimes } = usePrayerCalculations(prayerTimes);
  const { playAdhan, stopAdhan } = useAdhan(prayerTimes, settings);
  
  const [settingsVisible, setSettingsVisible] = useState(false);

  if (loading || !settingsLoaded) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={COLORS.accentGold} />
        <Text style={styles.loadingText}>Chargement des horaires de prière...</Text>
      </View>
    );
  }

  if (error || !prayerTimes) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.errorText}>Erreur lors du chargement</Text>
        <Text style={styles.errorSubtext}>Veuillez vérifier votre connexion</Text>
      </View>
    );
  }

  const nextPrayer = getNextPrayer();
  const forbiddenTimes = getForbiddenTimes();

  // Construire la liste des prières
  const prayersList: PrayerName[] = ['fajr'];
  if (settings.showShuruq) {
    prayersList.push('sunrise');
  }
  prayersList.push('dhuhr', 'asr', 'maghrib', 'isha');

  return (
    <View style={styles.container}>
      <Header
        location={location}
        hijriDate={hijriDate}
        onSettingsPress={() => setSettingsVisible(true)}
      />

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Prochaine prière */}
        {nextPrayer && (
          <NextPrayerDisplay
            nextPrayer={nextPrayer}
            getCountdown={getCountdown}
          />
        )}

        {/* Grille des prières */}
        <View style={styles.prayerGrid}>
          {prayersList.map((prayer) => {
            const isShuruq = prayer === 'sunrise';
            const isPassed = hasPassed(prayerTimes[prayer]);
            const isActive = nextPrayer?.name === prayer && !nextPrayer.tomorrow;
            const hasAdhan = !isShuruq && settings.adhanEnabled[prayer as keyof typeof settings.adhanEnabled];

            return (
              <PrayerCard
                key={prayer}
                prayer={prayer}
                time={prayerTimes[prayer]}
                isActive={isActive}
                isPassed={isPassed}
                hasAdhan={hasAdhan}
                isShuruq={isShuruq}
              />
            );
          })}
        </View>

        {/* Heures interdites */}
        {settings.showForbiddenTimes && forbiddenTimes.length > 0 && (
          <ForbiddenTimesDisplay times={forbiddenTimes} />
        )}
      </ScrollView>

      {/* Modal Paramètres */}
      <SettingsModal
        visible={settingsVisible}
        settings={settings}
        onClose={() => setSettingsVisible(false)}
        onUpdateSettings={updateSettings}
        onTestAdhan={playAdhan}
        onStopAdhan={stopAdhan}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.bgPrimary,
    padding: 20,
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: COLORS.bgPrimary,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 16,
  },
  loadingText: {
    color: COLORS.textSecondary,
    fontSize: 16,
  },
  errorText: {
    color: COLORS.danger,
    fontSize: 18,
    fontWeight: '600',
  },
  errorSubtext: {
    color: COLORS.textSecondary,
    fontSize: 14,
  },
  content: {
    flexGrow: 1,
    gap: 16,
  },
  prayerGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 10,
  },
});