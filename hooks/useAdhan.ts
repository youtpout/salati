import { useRef, useCallback, useEffect } from 'react';
import { useAudioPlayer, setAudioModeAsync } from 'expo-audio';
import { AdhanType, PrayerTimes, Settings, PrayerName } from '@/types';
import { ADHAN_SOURCES } from '@/constants';

export function useAdhan(
  prayerTimes: PrayerTimes | null,
  settings: Settings
) {
  const lastPlayedMinuteRef = useRef<number>(-1);

  // Créer le player avec la source initiale
  const player = useAudioPlayer(ADHAN_SOURCES[settings.selectedAdhan]);

  // Configurer le mode audio au montage
  useEffect(() => {
    setAudioModeAsync({
      playsInSilentMode: true,
    });
  }, []);

  // Mettre à jour la source quand l'adhan sélectionné change
  useEffect(() => {
    const newSource = ADHAN_SOURCES[settings.selectedAdhan];
    if (newSource) {
      player.replace(newSource);
    }
  }, [settings.selectedAdhan, player]);

  const playAdhan = useCallback(() => {
    try {
      player.seekTo(0);
      player.play();
    } catch (error) {
      console.error('Error playing adhan:', error);
    }
  }, [player]);

  const stopAdhan = useCallback(() => {
    player.pause();
    player.seekTo(0);
  }, [player]);

  // Vérifier l'heure de l'adhan toutes les secondes
  useEffect(() => {
    if (!prayerTimes) return;

    const checkAdhanTime = () => {
      const now = new Date();
      const currentMinute = now.getHours() * 60 + now.getMinutes();

      if (currentMinute === lastPlayedMinuteRef.current) return;

      const currentTime = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;

      const prayers: PrayerName[] = ['fajr', 'dhuhr', 'asr', 'maghrib', 'isha'];

      for (const prayer of prayers) {
        if (prayerTimes[prayer] === currentTime && settings.adhanEnabled[prayer]) {
          lastPlayedMinuteRef.current = currentMinute;
          playAdhan();
          break;
        }
      }
    };

    const interval = setInterval(checkAdhanTime, 1000);
    return () => clearInterval(interval);
  }, [prayerTimes, settings.adhanEnabled, playAdhan]);

  return { playAdhan, stopAdhan };
}