import { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useLocalSearchParams, useRouter, Stack } from 'expo-router';
import { ArrowRight, Save } from 'lucide-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

/**
 * Compact view screen
 * Stage 0 - Initial thoughts in compact format
 */
export default function CompactScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const [situation, setSituation] = useState('');
  const [feeling, setFeeling] = useState('');
  const [thought, setThought] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      // TODO: Save compact view to API
      await new Promise((resolve) => setTimeout(resolve, 500));
      console.log('Saved compact view:', { situation, feeling, thought });
    } catch (error) {
      console.error('Failed to save:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleContinueToChat = () => {
    router.push(`/session/${id}/chat`);
  };

  const isComplete = situation.trim() && feeling.trim() && thought.trim();

  return (
    <>
      <Stack.Screen
        options={{
          headerShown: true,
          title: 'Compact View',
          headerBackTitle: 'Session',
        }}
      />
      <SafeAreaView style={styles.container} edges={['bottom']}>
        <KeyboardAvoidingView
          style={styles.keyboardView}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
          <ScrollView style={styles.scrollView} contentContainerStyle={styles.content}>
            <Text style={styles.intro}>
              Let's start with a quick snapshot of what's happening. Fill in these
              three areas to capture the essence of your experience.
            </Text>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Situation</Text>
              <Text style={styles.hint}>
                What's happening? Describe the context briefly.
              </Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                placeholder="When I... / After... / During..."
                value={situation}
                onChangeText={setSituation}
                multiline
                numberOfLines={3}
                maxLength={500}
                textAlignVertical="top"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Feeling</Text>
              <Text style={styles.hint}>What emotions are you experiencing?</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                placeholder="I feel... / I'm feeling..."
                value={feeling}
                onChangeText={setFeeling}
                multiline
                numberOfLines={3}
                maxLength={500}
                textAlignVertical="top"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Thought</Text>
              <Text style={styles.hint}>
                What thoughts or beliefs come up?
              </Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                placeholder="I think... / I believe..."
                value={thought}
                onChangeText={setThought}
                multiline
                numberOfLines={3}
                maxLength={500}
                textAlignVertical="top"
              />
            </View>

            <View style={styles.actions}>
              <TouchableOpacity
                style={[styles.saveButton, isSaving && styles.buttonDisabled]}
                onPress={handleSave}
                disabled={isSaving}
              >
                <Save color="#007AFF" size={20} />
                <Text style={styles.saveButtonText}>
                  {isSaving ? 'Saving...' : 'Save Draft'}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.continueButton,
                  !isComplete && styles.buttonDisabled,
                ]}
                onPress={handleContinueToChat}
                disabled={!isComplete}
              >
                <Text style={styles.continueButtonText}>Continue to Chat</Text>
                <ArrowRight color="#FFFFFF" size={20} />
              </TouchableOpacity>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2F2F7',
  },
  keyboardView: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 16,
    gap: 20,
  },
  intro: {
    fontSize: 15,
    color: '#3C3C43',
    lineHeight: 22,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
  },
  inputGroup: {
    gap: 8,
  },
  label: {
    fontSize: 17,
    fontWeight: '600',
    color: '#000000',
  },
  hint: {
    fontSize: 14,
    color: '#8E8E93',
  },
  input: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#E5E5EA',
  },
  textArea: {
    minHeight: 80,
    paddingTop: 12,
  },
  actions: {
    gap: 12,
    marginTop: 8,
    paddingBottom: 24,
  },
  saveButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    gap: 8,
    borderWidth: 1,
    borderColor: '#007AFF',
  },
  saveButtonText: {
    fontSize: 17,
    fontWeight: '600',
    color: '#007AFF',
  },
  continueButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#007AFF',
    borderRadius: 12,
    padding: 16,
    gap: 8,
  },
  continueButtonText: {
    fontSize: 17,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  buttonDisabled: {
    opacity: 0.5,
  },
});
