import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';

import { useColorScheme } from '@/hooks/use-color-scheme';

export const unstable_settings = {
  anchor: '(tabs)',
};

import { WayfinderProvider } from '@/context/WayfinderContext';

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <WayfinderProvider>
      <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
        <Stack
          screenOptions={{
            headerShown: false,
            animation: 'slide_from_right',
          }}
        >
          <Stack.Screen name="index" />
          <Stack.Screen name="preferences" />
          <Stack.Screen name="routes" />
          <Stack.Screen name="custom" />
          <Stack.Screen name="final" />
        </Stack>
        <StatusBar style="auto" />
      </ThemeProvider>
    </WayfinderProvider>
  );
}
