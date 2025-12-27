/**
 * ChatInterface Component
 *
 * Complete chat interface combining message list, typing indicator, and input.
 * Handles auto-scroll to bottom on new messages and keyboard avoidance.
 */

import { useRef, useEffect, useCallback } from 'react';
import {
  View,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  ListRenderItem,
} from 'react-native';
import type { MessageDTO } from '@listen-well/shared';
import { ChatBubble, ChatBubbleMessage } from './ChatBubble';
import { TypingIndicator } from './TypingIndicator';
import { ChatInput } from './ChatInput';

// ============================================================================
// Types
// ============================================================================

interface ChatInterfaceProps {
  messages: MessageDTO[];
  onSendMessage: (content: string) => void;
  isLoading?: boolean;
  disabled?: boolean;
}

// ============================================================================
// Component
// ============================================================================

export function ChatInterface({
  messages,
  onSendMessage,
  isLoading = false,
  disabled = false,
}: ChatInterfaceProps) {
  const flatListRef = useRef<FlatList<MessageDTO>>(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (messages.length > 0) {
      // Small delay to ensure layout is complete
      const timer = setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [messages.length]);

  // Also scroll when loading state changes (typing indicator appears)
  useEffect(() => {
    if (isLoading) {
      const timer = setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [isLoading]);

  const renderMessage: ListRenderItem<MessageDTO> = useCallback(({ item }) => {
    const bubbleMessage: ChatBubbleMessage = {
      id: item.id,
      role: item.role,
      content: item.content,
      timestamp: item.timestamp,
    };
    return <ChatBubble message={bubbleMessage} />;
  }, []);

  const keyExtractor = useCallback((item: MessageDTO) => item.id, []);

  const renderFooter = useCallback(() => {
    if (!isLoading) return null;
    return <TypingIndicator />;
  }, [isLoading]);

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={90}
    >
      <FlatList
        ref={flatListRef}
        data={messages}
        keyExtractor={keyExtractor}
        renderItem={renderMessage}
        contentContainerStyle={styles.messageList}
        ListFooterComponent={renderFooter}
        showsVerticalScrollIndicator={false}
        testID="chat-message-list"
      />
      <ChatInput onSend={onSendMessage} disabled={disabled || isLoading} />
    </KeyboardAvoidingView>
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
  messageList: {
    paddingVertical: 16,
    flexGrow: 1,
  },
});
