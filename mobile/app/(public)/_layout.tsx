import { Stack } from 'expo-router';

/**
 * Public routes layout
 * These routes don't require authentication
 */
export default function PublicLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: '#FFFFFF' },
      }}
    >
      <Stack.Screen name="login" />
      <Stack.Screen name="signup" />
      <Stack.Screen name="invitation" />
    </Stack>
  );
}
