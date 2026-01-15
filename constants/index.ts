import { PrayerInfo, AdhanType } from '@/types';

export const PRAYER_NAMES: Record<string, PrayerInfo> = {
  fajr: { fr: 'Fajr', ar: 'الفجر' },
  sunrise: { fr: 'Shuruq', ar: 'الشروق' },
  dhuhr: { fr: 'Dhuhr', ar: 'الظهر' },
  asr: { fr: 'Asr', ar: 'العصر' },
  maghrib: { fr: 'Maghrib', ar: 'المغرب' },
  isha: { fr: 'Isha', ar: 'العشاء' },
};

// URLs pour streaming audio (fichiers distants)
export const ADHAN_SOURCES: Record<AdhanType, number> = {
  makkah: require('@/assets/sounds/adhan-makkah.mp3'),
  madinah: require('@/assets/sounds/adhan-madinah.mp3'),
  alaqsa: require('@/assets/sounds/adhan-alaqsa.mp3'),
  mishary: require('@/assets/sounds/adhan-mishary.mp3'),
  egypt: require('@/assets/sounds/adhan-egypt.mp3'),
};

export const ADHAN_LABELS: Record<AdhanType, string> = {
  makkah: 'Makkah',
  madinah: 'Madinah',
  alaqsa: 'Al-Aqsa',
  mishary: 'Mishary Rashid',
  egypt: 'Égypte',
};

export const COLORS = {
  bgPrimary: '#0a1628',
  bgSecondary: '#0f2137',
  bgCard: '#152a42',
  accentGold: '#d4af37',
  accentEmerald: '#10b981',
  textPrimary: '#f8fafc',
  textSecondary: '#94a3b8',
  textMuted: '#64748b',
  border: 'rgba(212, 175, 55, 0.2)',
  danger: '#ef4444',
};

export const DEFAULT_SETTINGS = {
  showShuruq: true,
  showForbiddenTimes: true,
  selectedAdhan: 'makkah' as AdhanType,
  adhanEnabled: {
    fajr: true,
    dhuhr: true,
    asr: true,
    maghrib: true,
    isha: true,
  },
};

export const DEFAULT_LOCATION = {
  lat: 43.6047,
  lon: 1.4442,
  city: 'Toulouse',
  country: 'France',
};
