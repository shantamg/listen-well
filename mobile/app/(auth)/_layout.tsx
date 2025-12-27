import { Redirect, Stack } from 'expo-router';

import { useAuth } from '@/src/hooks/useAuth';

/**
 * Auth group layout
 * Redirects to login if user is not authenticated
 */
export default function AuthLayout() {
  const { isAuthenticated, isLoading } = useAuth();

  // Show nothing while checking auth
  if (isLoading) {
    return null;
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return <Redirect href="/login" />;
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      {/* Tabs are the main navigation */}
      <Stack.Screen name="(tabs)" />

      {/* Session flow screens */}
      <Stack.Screen
        name="session/new"
        options={{
          presentation: 'modal',
          headerShown: true,
          title: 'New Session',
        }}
      />
      <Stack.Screen name="session/[id]" />

      {/* Person detail */}
      <Stack.Screen
        name="person/[id]"
        options={{
          headerShown: true,
          title: 'Person',
        }}
      />
    </Stack>
  );
}
