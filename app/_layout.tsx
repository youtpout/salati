import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useKeepAwake } from 'expo-keep-awake';

export default function RootLayout() {
  // Empêcher la mise en veille
  useKeepAwake();

  return (
    <>
      <StatusBar style="light" hidden />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: '#0a1628' },
        }}
      />
    </>
  );
}
