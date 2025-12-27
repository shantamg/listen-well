import { Stack } from 'expo-router';

/**
 * Session detail layout
 * Stack navigator for session views
 */
export default function SessionLayout() {
  return (
    <Stack screenOptions={{ headerShown: true }}>
      <Stack.Screen
        name="index"
        options={{
          title: 'Session',
          headerBackTitle: 'Back',
        }}
      />
      <Stack.Screen
        name="chat"
        options={{
          title: 'Chat',
          headerBackTitle: 'Session',
        }}
      />
      <Stack.Screen
        name="compact"
        options={{
          title: 'Compact View',
          headerBackTitle: 'Session',
        }}
      />
      <Stack.Screen
        name="empathy"
        options={{
          title: 'Empathy Map',
          headerBackTitle: 'Session',
        }}
      />
      <Stack.Screen
        name="needs"
        options={{
          title: 'Needs',
          headerBackTitle: 'Session',
        }}
      />
      <Stack.Screen
        name="strategies"
        options={{
          title: 'Strategies',
          headerBackTitle: 'Session',
        }}
      />
    </Stack>
  );
}
