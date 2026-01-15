import { useState, useEffect, useCallback } from 'react';
import * as Location from 'expo-location';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { PrayerTimes, Location as LocationType, HijriDate, Settings, NextPrayer, PrayerName } from '@/types';
import { DEFAULT_SETTINGS, DEFAULT_LOCATION } from '@/constants';

const SETTINGS_KEY = '@prayer_settings';

export function usePrayerTimes() {
  const [prayerTimes, setPrayerTimes] = useState<PrayerTimes | null>(null);
  const [location, setLocation] = useState<LocationType | null>(null);
  const [hijriDate, setHijriDate] = useState<HijriDate | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPrayerTimes = useCallback(async (lat: number, lon: number) => {
    try {
      const today = new Date();
      const date = `${today.getDate()}-${today.getMonth() + 1}-${today.getFullYear()}`;
      
      const response = await fetch(
        `https://api.aladhan.com/v1/timings/${date}?latitude=${lat}&longitude=${lon}&method=2`
      );
      const data = await response.json();
      
      if (data.code === 200) {
        setHijriDate(data.data.date.hijri);
        
        const cleanTime = (time: string) => time.replace(/\s*\([^)]*\)/g, '');
        
        setPrayerTimes({
          fajr: cleanTime(data.data.timings.Fajr),
          sunrise: cleanTime(data.data.timings.Sunrise),
          dhuhr: cleanTime(data.data.timings.Dhuhr),
          asr: cleanTime(data.data.timings.Asr),
          maghrib: cleanTime(data.data.timings.Maghrib),
          isha: cleanTime(data.data.timings.Isha),
        });
      } else {
        throw new Error('API error');
      }
    } catch (err) {
      setError('Impossible de charger les horaires');
      console.error(err);
    }
  }, []);

  const getLocation = useCallback(async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      
      if (status !== 'granted') {
        setLocation(DEFAULT_LOCATION);
        return DEFAULT_LOCATION;
      }

      const position = await Location.getCurrentPositionAsync({});
      const { latitude, longitude } = position.coords;

      try {
        const [reverseGeocode] = await Location.reverseGeocodeAsync({
          latitude,
          longitude,
        });
        
        const loc: LocationType = {
          lat: latitude,
          lon: longitude,
          city: reverseGeocode?.city || reverseGeocode?.subregion || 'Position actuelle',
          country: reverseGeocode?.country || '',
        };
        setLocation(loc);
        return loc;
      } catch {
        const loc: LocationType = {
          lat: latitude,
          lon: longitude,
          city: 'Position actuelle',
          country: '',
        };
        setLocation(loc);
        return loc;
      }
    } catch {
      setLocation(DEFAULT_LOCATION);
      return DEFAULT_LOCATION;
    }
  }, []);

  const initialize = useCallback(async () => {
    setLoading(true);
    const loc = await getLocation();
    await fetchPrayerTimes(loc.lat, loc.lon);
    setLoading(false);
  }, [getLocation, fetchPrayerTimes]);

  useEffect(() => {
    initialize();
  }, [initialize]);

  // Rafraîchir à minuit
  useEffect(() => {
    const checkMidnight = setInterval(() => {
      const now = new Date();
      if (now.getHours() === 0 && now.getMinutes() === 0 && now.getSeconds() < 2) {
        if (location) {
          fetchPrayerTimes(location.lat, location.lon);
        }
      }
    }, 1000);

    return () => clearInterval(checkMidnight);
  }, [location, fetchPrayerTimes]);

  return {
    prayerTimes,
    location,
    hijriDate,
    loading,
    error,
    refresh: initialize,
  };
}

export function useSettings() {
  const [settings, setSettings] = useState<Settings>(DEFAULT_SETTINGS);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const loadSettings = async () => {
      try {
        const saved = await AsyncStorage.getItem(SETTINGS_KEY);
        if (saved) {
          setSettings({ ...DEFAULT_SETTINGS, ...JSON.parse(saved) });
        }
      } catch (err) {
        console.error('Error loading settings:', err);
      }
      setLoaded(true);
    };
    loadSettings();
  }, []);

  const updateSettings = useCallback(async (newSettings: Partial<Settings>) => {
    const updated = { ...settings, ...newSettings };
    setSettings(updated);
    try {
      await AsyncStorage.setItem(SETTINGS_KEY, JSON.stringify(updated));
    } catch (err) {
      console.error('Error saving settings:', err);
    }
  }, [settings]);

  return { settings, updateSettings, loaded };
}

export function usePrayerCalculations(prayerTimes: PrayerTimes | null) {
  const parseTime = useCallback((timeStr: string): Date => {
    const [hours, minutes] = timeStr.split(':').map(Number);
    const date = new Date();
    date.setHours(hours, minutes, 0, 0);
    return date;
  }, []);

  const getNextPrayer = useCallback((): NextPrayer | null => {
    if (!prayerTimes) return null;

    const now = new Date();
    const prayers: PrayerName[] = ['fajr', 'dhuhr', 'asr', 'maghrib', 'isha'];
    
    for (const prayer of prayers) {
      const prayerTime = parseTime(prayerTimes[prayer]);
      if (prayerTime > now) {
        return { name: prayer, time: prayerTimes[prayer] };
      }
    }
    
    return { name: 'fajr', time: prayerTimes.fajr, tomorrow: true };
  }, [prayerTimes, parseTime]);

  const hasPassed = useCallback((timeStr: string): boolean => {
    return parseTime(timeStr) < new Date();
  }, [parseTime]);

  const getCountdown = useCallback((targetTime: string, isTomorrow = false): string => {
    const now = new Date();
    const target = parseTime(targetTime);
    
    if (isTomorrow) {
      target.setDate(target.getDate() + 1);
    }
    
    const diff = target.getTime() - now.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);
    
    if (hours > 0) {
      return `${hours}h ${minutes}m ${seconds}s`;
    }
    return `${minutes}m ${seconds}s`;
  }, [parseTime]);

  const getForbiddenTimes = useCallback(() => {
    if (!prayerTimes) return [];

    const sunrise = parseTime(prayerTimes.sunrise);
    const dhuhr = parseTime(prayerTimes.dhuhr);
    
    const afterSunrise = new Date(sunrise.getTime() + 15 * 60000);
    const beforeDhuhr = new Date(dhuhr.getTime() - 10 * 60000);
    const afterZenith = new Date(dhuhr.getTime() + 5 * 60000);
    
    const formatTime = (d: Date) => 
      `${d.getHours().toString().padStart(2, '0')}:${d.getMinutes().toString().padStart(2, '0')}`;
    
    return [
      {
        label: 'Lever du soleil',
        time: `${prayerTimes.sunrise} - ${formatTime(afterSunrise)}`,
      },
      {
        label: 'Zénith',
        time: `${formatTime(beforeDhuhr)} - ${formatTime(afterZenith)}`,
      },
      {
        label: 'Coucher du soleil',
        time: `~15min avant ${prayerTimes.maghrib}`,
      },
    ];
  }, [prayerTimes, parseTime]);

  return {
    getNextPrayer,
    hasPassed,
    getCountdown,
    getForbiddenTimes,
    parseTime,
  };
}
