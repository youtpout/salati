# 🕌 Salati - Prayer Times App

Application React Native (Expo SDK 54) affichant les horaires de prière, optimisée pour tablette en mode plein écran.

## ✨ Fonctionnalités

- 🕐 Affichage des 5 prières quotidiennes + Shuruq (optionnel)
- ⏱️ Compte à rebours en temps réel vers la prochaine prière
- 🔊 Adhan automatique à l'heure de chaque prière (configurable)
- 📍 Géolocalisation automatique pour les horaires locaux
- 📅 Date grégorienne et hégirien
- 🚫 Affichage des heures interdites pour la prière
- 💤 **Écran toujours allumé** (keep-awake)
- 🌙 Thème sombre élégant

## 🚀 Installation

### Prérequis

- Node.js 20+ (ou 22/24 avec le flag `--no-experimental-strip-types`)
- npm ou yarn
- Expo CLI

### Setup

```bash
# Installer les dépendances
npm install

# Lancer l'application
npm start

# Ou avec Node 24+
npx --node-options="--no-experimental-strip-types" expo start
```

### Sur tablette/téléphone

1. Installer l'app **Expo Go** depuis le Play Store ou App Store
2. Scanner le QR code affiché dans le terminal
3. L'app se lance automatiquement

## 📱 Build pour production

### Android (APK/AAB)

```bash
# Avec EAS Build (recommandé)
npm install -g eas-cli
eas login
eas build --platform android

# Build local
npx expo run:android
```

### iOS

```bash
eas build --platform ios
```

## 🔧 Configuration

### Paramètres disponibles

Dans l'app, appuyer sur ⚙️ pour accéder aux paramètres :

| Option | Description |
|--------|-------------|
| Afficher le Shuruq | Montre/cache le lever du soleil |
| Heures interdites | Affiche les périodes où la prière est déconseillée |
| Choix de l'Adhan | 5 adhans différents (Makkah, Madinah, Al-Aqsa...) |
| Adhan par prière | Active/désactive l'adhan pour chaque prière |

## 📁 Structure du projet

```
salati/
├── app/
│   ├── _layout.tsx      # Layout avec keep-awake
│   └── index.tsx        # Page principale
├── components/
│   ├── Header.tsx
│   ├── NextPrayerDisplay.tsx
│   ├── PrayerCard.tsx
│   ├── ForbiddenTimes.tsx
│   └── SettingsModal.tsx
├── hooks/
│   ├── usePrayerTimes.ts  # Logique horaires + géoloc
│   └── useAdhan.ts        # Gestion audio (expo-audio)
├── constants/
│   └── index.ts          # Couleurs, constantes
├── types/
│   └── index.ts          # Types TypeScript
├── app.json              # Config Expo
└── package.json
```

## 🔊 Fichiers audio locaux (optionnel)

Pour utiliser des fichiers audio locaux au lieu des URLs :

1. Placer les fichiers dans `assets/sounds/`
2. Modifier `constants/index.ts` :

```typescript
export const ADHAN_SOURCES: Record<AdhanType, any> = {
  makkah: require('@/assets/sounds/adhan-makkah.mp3'),
  // ...
};
```

3. Modifier `hooks/useAdhan.ts` pour utiliser `require()` au lieu de `{ uri: ... }`

## 🌐 API utilisée

- **Horaires de prière** : [Aladhan API](https://aladhan.com/prayer-times-api)
- **Géocodage inverse** : Expo Location

## 📝 Mode Kiosque (tablette dédiée)

L'app utilise `expo-keep-awake` qui empêche la mise en veille tant que l'app est au premier plan.

Pour un vrai mode kiosque sur Android :
- Activer le mode développeur
- Utiliser une app launcher kiosque ou le mode pinned app

## 📄 Licence

MIT

 <a href='https://fr.pngtree.com/freebackground/the-holy-kaaba-and-surrounding-masjid-al-haram_16494512.html'>photos fond gratuites de fr.pngtree.com/</a>