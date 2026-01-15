import { useRef, useCallback, useEffect } from 'react';
import { useAudioPlayer, setAudioModeAsync } from 'expo-audio';
import { AdhanType, PrayerTimes, Settings, PrayerName } from '@/types';
import { ADHAN_SOURCES } from '@/constants';

export function useAdhan(
  prayerTimes: PrayerTimes | null,
  settings: Settings
) {
  const lastPlayedMinuteRef = useRef<number>(-1);
  const currentAdhanRef = useRef<AdhanType>(settings.selectedAdhan);
  
  // Créer le player avec l'URL de l'adhan sélectionné
  const player = useAudioPlayer({ uri: ADHAN_SOURCES[settings.selectedAdhan] });

  // Mettre à jour la source quand l'adhan change
  useEffect(() => {
    if (currentAdhanRef.current !== settings.selectedAdhan) {
      currentAdhanRef.current = settings.selectedAdhan;
      player.replace({ uri: ADHAN_SOURCES[settings.selectedAdhan] });
    }
  }, [settings.selectedAdhan, player]);

  // Configurer le mode audio au montage
  useEffect(() => {
    setAudioModeAsync({
      playsInSilentMode: true,
    });
  }, []);

  const playAdhan = useCallback(async (adhanType?: AdhanType) => {
    try {
      // Si on veut jouer un adhan différent temporairement
      if (adhanType && adhanType !== currentAdhanRef.current) {
        player.replace({ uri: ADHAN_SOURCES[adhanType] });
      }
      
      // Remettre au début et jouer
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
      
      // Ne pas vérifier la même minute deux fois
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
