/**
 * ChatInput Component
 *
 * Text input with send button for composing chat messages.
 * Includes character limit indicator and disabled state handling.
 */

import { useState, useCallback } from 'react';
import { View, TextInput, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { Send } from 'lucide-react-native';

// ============================================================================
// Types
// ============================================================================

interface ChatInputProps {
  onSend: (message: string) => void;
  disabled?: boolean;
  placeholder?: string;
  maxLength?: number;
  showCharacterCount?: boolean;
}

// ============================================================================
// Constants
// ============================================================================

const DEFAULT_MAX_LENGTH = 2000;
const CHARACTER_WARNING_THRESHOLD = 0.8;

// ============================================================================
// Component
// ============================================================================

export function ChatInput({
  onSend,
  disabled = false,
  placeholder = 'Type a message...',
  maxLength = DEFAULT_MAX_LENGTH,
  showCharacterCount = false,
}: ChatInputProps) {
  const [input, setInput] = useState('');

  const canSend = input.trim().length > 0 && !disabled;
  const characterRatio = input.length / maxLength;
  const showWarning = characterRatio >= CHARACTER_WARNING_THRESHOLD;

  const handleSend = useCallback(() => {
    if (!canSend) return;
    const message = input.trim();
    setInput('');
    onSend(message);
  }, [input, canSend, onSend]);

  const handleChangeText = useCallback((text: string) => {
    setInput(text);
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.inputWrapper}>
        <TextInput
          style={styles.input}
          value={input}
          onChangeText={handleChangeText}
          placeholder={placeholder}
          placeholderTextColor="#9CA3AF"
          multiline
          maxLength={maxLength}
          editable={!disabled}
          testID="chat-input"
        />
        {showCharacterCount && (
          <Text style={[styles.characterCount, showWarning && styles.characterCountWarning]}>
            {input.length}/{maxLength}
          </Text>
        )}
      </View>
      <TouchableOpacity
        testID="send-button"
        style={[styles.sendButton, !canSend && styles.sendButtonDisabled]}
        onPress={handleSend}
        disabled={!canSend}
        activeOpacity={0.7}
      >
        <Send color={canSend ? '#4F46E5' : '#9CA3AF'} size={20} />
      </TouchableOpacity>
    </View>
  );
}

// ============================================================================
// Styles
// ============================================================================

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    padding: 12,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    backgroundColor: '#FFFFFF',
  },
  inputWrapper: {
    flex: 1,
    position: 'relative',
  },
  input: {
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 10,
    fontSize: 16,
    maxHeight: 120,
    color: '#1F2937',
    backgroundColor: '#FFFFFF',
  },
  characterCount: {
    position: 'absolute',
    right: 12,
    bottom: -16,
    fontSize: 10,
    color: '#9CA3AF',
  },
  characterCountWarning: {
    color: '#EF4444',
  },
  sendButton: {
    padding: 10,
    marginLeft: 4,
  },
  sendButtonDisabled: {
    opacity: 0.5,
  },
});
