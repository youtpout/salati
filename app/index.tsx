import React, { useEffect, useState } from 'react';
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

const GRACE_MINUTES = 10;

function parseTodayTimeHHMM(timeHHMM: string) {
  const [hStr, mStr] = timeHHMM.split(':');
  const h = Number(hStr);
  const m = Number(mStr);
  const d = new Date();
  d.setHours(h, m, 0, 0);
  return d;
}

function addMinutes(date: Date, minutes: number) {
  return new Date(date.getTime() + minutes * 60_000);
}

export default function HomeScreen() {
  const { prayerTimes, location, hijriDate, loading, error } = usePrayerTimes();
  const { settings, updateSettings, loaded: settingsLoaded } = useSettings();
  const { hasPassed, getCountdown, getForbiddenTimes } = usePrayerCalculations(prayerTimes);
  const { playAdhan, stopAdhan } = useAdhan(prayerTimes, settings);

  const [settingsVisible, setSettingsVisible] = useState(false);


  // ✅ force un recalcul régulier (donc la card principale bouge)
  const [tick, setTick] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setTick((t) => t + 1), 60_000);
    return () => clearInterval(id);
  }, []);

  // ✅ Toujours calculer pareil (pas de hook), même si loading
  const prayersList: PrayerName[] = (() => {
    const list: PrayerName[] = ['fajr'];
    if (settings?.showShuruq) list.push('sunrise');
    list.push('dhuhr', 'asr', 'maghrib', 'isha');
    return list;
  })();

  // ✅ Liste pour la card principale : JAMAIS sunrise
  const mainCardOrder: PrayerName[] = ['fajr', 'dhuhr', 'asr', 'maghrib', 'isha'];

  // ✅ Next prayer avec "grace 10 min"
  const nextPrayer = (() => {
    void tick; // utilisé pour forcer le recalcul
    if (!prayerTimes) return null;

    const now = new Date();

    for (const p of mainCardOrder) {
      const tStr = prayerTimes[p];
      if (!tStr) continue;

      const t = parseTodayTimeHHMM(tStr);
      const switchAt = addMinutes(t, GRACE_MINUTES);

      // Tant qu'on n'a pas dépassé (heure + 10min), on reste sur cette prière
      if (now < switchAt) {
        return { name: p, time: tStr, tomorrow: false as const };
      }
    }

    // après isha + grace => demain fajr
    return { name: 'fajr' as const, time: prayerTimes.fajr, tomorrow: true as const };
  })();

  // Ensuite seulement, on peut faire les retours conditionnels
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

  const forbiddenTimes = getForbiddenTimes();

  return (
    <View style={styles.container}>
      <Header
        location={location}
        hijriDate={hijriDate}
        onSettingsPress={() => setSettingsVisible(true)}
      />

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {nextPrayer && (
          <NextPrayerDisplay nextPrayer={nextPrayer} getCountdown={getCountdown} />
        )}

        <View style={styles.prayerGrid}>
          {prayersList.map((prayer) => {
            const isShuruq = prayer === 'sunrise';
            const isPassed = hasPassed(prayerTimes[prayer]);
            const isActive = nextPrayer?.name === prayer && !nextPrayer.tomorrow;
            const hasAdhan =
              !isShuruq &&
              settings.adhanEnabled[prayer as keyof typeof settings.adhanEnabled];

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

        {settings.showForbiddenTimes && forbiddenTimes.length > 0 && (
          <ForbiddenTimesDisplay times={forbiddenTimes} />
        )}
      </ScrollView>

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
  container: { flex: 1, padding: 20 },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 16,
  },
  loadingText: { color: COLORS.textSecondary, fontSize: 16 },
  errorText: { color: COLORS.danger, fontSize: 18, fontWeight: '600' },
  errorSubtext: { color: COLORS.textSecondary, fontSize: 14 },
  content: { flexGrow: 1, gap: 16 },
  prayerGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 10,
  },
});
