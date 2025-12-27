import { useEffect } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StyleSheet } from 'react-native';

import { AuthContext, useAuthProvider } from '@/src/hooks/useAuth';

// Prevent splash screen from auto-hiding
SplashScreen.preventAutoHideAsync();

/**
 * Root layout component
 * Provides authentication context and global providers
 */
export default function RootLayout() {
  const auth = useAuthProvider();

  const [fontsLoaded, fontError] = useFonts({
    // Add custom fonts here if needed
  });

  useEffect(() => {
    if ((fontsLoaded || fontError) && !auth.isLoading) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, fontError, auth.isLoading]);

  // Show nothing while loading fonts or auth
  if ((!fontsLoaded && !fontError) || auth.isLoading) {
    return null;
  }

  return (
    <GestureHandlerRootView style={styles.container}>
      <SafeAreaProvider>
        <AuthContext.Provider value={auth}>
          <Stack screenOptions={{ headerShown: false }}>
            {/* Public routes - no auth required */}
            <Stack.Screen name="(public)" />

            {/* Auth-required routes */}
            <Stack.Screen name="(auth)" />

            {/* 404 handler */}
            <Stack.Screen name="+not-found" options={{ headerShown: true }} />
          </Stack>
          <StatusBar style="auto" />
        </AuthContext.Provider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
