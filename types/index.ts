export type PrayerName = 'fajr' | 'sunrise' | 'dhuhr' | 'asr' | 'maghrib' | 'isha';

export interface PrayerTimes {
  fajr: string;
  sunrise: string;
  dhuhr: string;
  asr: string;
  maghrib: string;
  isha: string;
}

export interface PrayerInfo {
  fr: string;
  ar: string;
}

export interface Location {
  lat: number;
  lon: number;
  city: string;
  country: string;
}

export interface HijriDate {
  day: string;
  month: {
    ar: string;
    en: string;
  };
  year: string;
}

export interface Settings {
  showShuruq: boolean;
  showForbiddenTimes: boolean;
  selectedAdhan: AdhanType;
  adhanEnabled: {
    fajr: boolean;
    dhuhr: boolean;
    asr: boolean;
    maghrib: boolean;
    isha: boolean;
  };
}

export type AdhanType = 'makkah' | 'madinah' | 'alaqsa' | 'mishary' | 'egypt';

export interface NextPrayer {
  name: PrayerName;
  time: string;
  tomorrow?: boolean;
}

export interface ForbiddenTime {
  label: string;
  time: string;
}
