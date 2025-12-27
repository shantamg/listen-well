/**
 * Chat Screen
 *
 * AI conversation interface for a session.
 * Displays message history and allows sending new messages.
 */

import { useCallback } from 'react';
import { View, StyleSheet, ActivityIndicator, Text } from 'react-native';
import { useLocalSearchParams, Stack } from 'expo-router';
import { useMessages, useSendMessage } from '@/src/hooks/useMessages';
import { ChatInterface } from '@/src/components/ChatInterface';

// ============================================================================
// Component
// ============================================================================

export default function ChatScreen() {
  const { id: sessionId } = useLocalSearchParams<{ id: string }>();

  // Fetch messages for this session
  const {
    data: messagesData,
    isLoading: loadingMessages,
    error: messagesError,
  } = useMessages({ sessionId: sessionId! }, { enabled: !!sessionId });

  // Send message mutation
  const { mutate: sendMessage, isPending: isSending } = useSendMessage();

  const handleSendMessage = useCallback(
    (content: string) => {
      if (!sessionId) return;
      sendMessage({ sessionId, content });
    },
    [sessionId, sendMessage]
  );

  // Loading state
  if (loadingMessages) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#4F46E5" />
        <Text style={styles.loadingText}>Loading conversation...</Text>
      </View>
    );
  }

  // Error state
  if (messagesError) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>Failed to load messages</Text>
        <Text style={styles.errorDetail}>{messagesError.message}</Text>
      </View>
    );
  }

  const messages = messagesData?.messages ?? [];

  return (
    <>
      <Stack.Screen
        options={{
          headerShown: true,
          title: 'Chat',
          headerBackTitle: 'Session',
        }}
      />
      <View style={styles.container}>
        <ChatInterface
          messages={messages}
          onSendMessage={handleSendMessage}
          isLoading={isSending}
        />
      </View>
    </>
  );
}

// ============================================================================
// Styles
// ============================================================================

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 20,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#6B7280',
  },
  errorText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#EF4444',
    marginBottom: 8,
  },
  errorDetail: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
  },
});
