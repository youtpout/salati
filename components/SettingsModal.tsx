import React from 'react';
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Switch,
} from 'react-native';
import { Settings, AdhanType, PrayerName } from '@/types';
import { COLORS, ADHAN_LABELS, PRAYER_NAMES } from '@/constants';

interface SettingsModalProps {
  visible: boolean;
  settings: Settings;
  onClose: () => void;
  onUpdateSettings: (settings: Partial<Settings>) => void;
  onTestAdhan: () => void;
  onStopAdhan: () => void;
}

export function SettingsModal({
  visible,
  settings,
  onClose,
  onUpdateSettings,
  onTestAdhan,
  onStopAdhan,
}: SettingsModalProps) {
  const toggleAdhanForPrayer = (prayer: PrayerName) => {
    onUpdateSettings({
      adhanEnabled: {
        ...settings.adhanEnabled,
        [prayer]: !settings.adhanEnabled[prayer],
      },
    });
  };

  const adhanTypes: AdhanType[] = ['makkah', 'madinah', 'alaqsa', 'mishary', 'egypt'];
  const prayers: PrayerName[] = ['fajr', 'dhuhr', 'asr', 'maghrib', 'isha'];

  return (
    <Modal
      visible={visible}
      animationType="fade"
      transparent
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.panel}>
          <View style={styles.header}>
            <Text style={styles.title}>Paramètres</Text>
            <TouchableOpacity style={styles.closeButton} onPress={onClose}>
              <Text style={styles.closeIcon}>✕</Text>
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.content}>
            {/* Affichage */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Affichage</Text>

              <View style={styles.settingRow}>
                <Text style={styles.settingLabel}>Afficher le Shuruq</Text>
                <Switch
                  value={settings.showShuruq}
                  onValueChange={(value) => onUpdateSettings({ showShuruq: value })}
                  trackColor={{ false: COLORS.bgCard, true: COLORS.accentEmerald }}
                  thumbColor={COLORS.textPrimary}
                />
              </View>

              <View style={styles.settingRow}>
                <Text style={styles.settingLabel}>Heures interdites</Text>
                <Switch
                  value={settings.showForbiddenTimes}
                  onValueChange={(value) => onUpdateSettings({ showForbiddenTimes: value })}
                  trackColor={{ false: COLORS.bgCard, true: COLORS.accentEmerald }}
                  thumbColor={COLORS.textPrimary}
                />
              </View>
            </View>

            {/* Adhan */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Adhan</Text>

              <Text style={styles.settingLabel}>Choix de l'Adhan</Text>
              <View style={styles.adhanSelector}>
                {adhanTypes.map((type) => (
                  <TouchableOpacity
                    key={type}
                    style={[
                      styles.adhanOption,
                      settings.selectedAdhan === type && styles.adhanOptionSelected,
                    ]}
                    onPress={() => onUpdateSettings({ selectedAdhan: type })}
                  >
                    <Text
                      style={[
                        styles.adhanOptionText,
                        settings.selectedAdhan === type && styles.adhanOptionTextSelected,
                      ]}
                    >
                      {ADHAN_LABELS[type]}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              <View style={styles.testButtons}>
                <TouchableOpacity style={styles.testButton} onPress={onTestAdhan}>
                  <Text style={styles.testButtonText}>🔊 Tester</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.testButton, styles.stopButton]}
                  onPress={onStopAdhan}
                >
                  <Text style={styles.stopButtonText}>⏹ Arrêter</Text>
                </TouchableOpacity>
              </View>

              <Text style={[styles.settingLabel, { marginTop: 20 }]}>
                Activer l'Adhan pour :
              </Text>
              <View style={styles.prayerToggles}>
                {prayers.map((prayer) => (
                  <View key={prayer} style={styles.prayerToggle}>
                    <Text style={styles.prayerToggleLabel}>
                      {PRAYER_NAMES[prayer].fr}
                    </Text>
                    <Switch
                      value={settings.adhanEnabled[prayer]}
                      onValueChange={() => toggleAdhanForPrayer(prayer)}
                      trackColor={{ false: COLORS.bgCard, true: COLORS.accentEmerald }}
                      thumbColor={COLORS.textPrimary}
                    />
                  </View>
                ))}
              </View>
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  panel: {
    backgroundColor: COLORS.bgSecondary,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 24,
    width: '90%',
    maxWidth: 500,
    maxHeight: '80%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 24,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: COLORS.accentGold,
  },
  closeButton: {
    padding: 8,
  },
  closeIcon: {
    fontSize: 24,
    color: COLORS.textSecondary,
  },
  content: {
    padding: 24,
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 12,
    color: COLORS.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 2,
    marginBottom: 16,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
  },
  settingLabel: {
    fontSize: 16,
    color: COLORS.textPrimary,
  },
  adhanSelector: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 12,
  },
  adhanOption: {
    backgroundColor: COLORS.bgCard,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  adhanOptionSelected: {
    borderColor: COLORS.accentGold,
    backgroundColor: 'rgba(212, 175, 55, 0.1)',
  },
  adhanOptionText: {
    color: COLORS.textSecondary,
    fontSize: 14,
  },
  adhanOptionTextSelected: {
    color: COLORS.accentGold,
    fontWeight: '600',
  },
  testButtons: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 16,
  },
  testButton: {
    backgroundColor: COLORS.accentGold,
    borderRadius: 8,
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  testButtonText: {
    color: COLORS.bgPrimary,
    fontWeight: '600',
  },
  stopButton: {
    backgroundColor: COLORS.bgCard,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  stopButtonText: {
    color: COLORS.textPrimary,
  },
  prayerToggles: {
    marginTop: 12,
    gap: 8,
  },
  prayerToggle: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: COLORS.bgCard,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  prayerToggleLabel: {
    fontSize: 15,
    color: COLORS.textPrimary,
  },
});
