import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useKeepAwake } from 'expo-keep-awake';
import { ImageBackground, StyleSheet, View } from 'react-native';

export default function RootLayout() {
  // Empêcher la mise en veille
  useKeepAwake();

  const backgoundImage = require('@/assets/kaaba.jpg');

  return (
    <ImageBackground
      source={backgoundImage}
      style={styles.background}
      resizeMode="cover"
    >
      {/* Overlay optionnel pour lisibilité */}
      <View style={styles.overlay}>
        <StatusBar style="light" hidden />
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
