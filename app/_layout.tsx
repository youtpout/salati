import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useKeepAwake } from 'expo-keep-awake';
import { useEffect } from 'react';
import { ImageBackground, StyleSheet, View } from 'react-native';
import { AppState, Platform } from 'react-native';
import * as NavigationBar from 'expo-navigation-bar';

export default function RootLayout() {
  // Empêcher la mise en veille
  useKeepAwake();

  const backgoundImage = require('@/assets/kaaba.jpg');
useEffect(() => {
    if (Platform.OS !== 'android') return;

    const hide = async () => {
      try {
        await NavigationBar.setVisibilityAsync('hidden');
        await NavigationBar.setBehaviorAsync('overlay-swipe');
        // optionnel
        await NavigationBar.setBackgroundColorAsync('#00000000');
      } catch {}
    };

    hide();

    const sub = AppState.addEventListener('change', (state) => {
      if (state === 'active') hide(); // Android peut la ré-afficher après pause
    });

    return () => sub.remove();
  }, []);

  return (
    <ImageBackground
      source={backgoundImage}
      style={styles.background}
      resizeMode="cover"
    >
      {/* Overlay optionnel pour lisibilité */}
      <View style={styles.overlay}>
        <StatusBar style="light" hidden translucent />
        <Stack
          screenOptions={{
            headerShown: false,
            contentStyle: { backgroundColor: 'transparent' }, // IMPORTANT
          }}
        />
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.35)', // ajuste ou supprime si inutile
  },
});
