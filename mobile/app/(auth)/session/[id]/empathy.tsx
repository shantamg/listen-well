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
import { ArrowRight, Save, Eye, Ear, Heart, Brain } from 'lucide-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

/**
 * Empathy map screen
 * Stage 2 - Map out empathy perspective
 */
export default function EmpathyScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const [seeing, setSeeing] = useState('');
  const [hearing, setHearing] = useState('');
  const [feeling, setFeeling] = useState('');
  const [thinking, setThinking] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const empathyQuadrants = [
    {
      key: 'seeing',
      icon: Eye,
      title: 'Seeing',
      description: 'What do you observe in this situation?',
      placeholder: 'I see... / I notice...',
      value: seeing,
      onChange: setSeeing,
    },
    {
      key: 'hearing',
      icon: Ear,
      title: 'Hearing',
      description: 'What words or sounds are present?',
      placeholder: 'I hear... / They say...',
      value: hearing,
      onChange: setHearing,
    },
    {
      key: 'feeling',
      icon: Heart,
      title: 'Feeling',
      description: 'What emotions and physical sensations arise?',
      placeholder: 'I feel... / My body...',
      value: feeling,
      onChange: setFeeling,
    },
    {
      key: 'thinking',
      icon: Brain,
      title: 'Thinking',
      description: 'What thoughts and beliefs come up?',
      placeholder: 'I think... / I believe...',
      value: thinking,
      onChange: setThinking,
    },
  ];

  const handleSave = async () => {
    setIsSaving(true);
    try {
      // TODO: Save empathy map to API
      await new Promise((resolve) => setTimeout(resolve, 500));
      console.log('Saved empathy map:', { seeing, hearing, feeling, thinking });
    } catch (error) {
      console.error('Failed to save:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleContinue = () => {
    router.push(`/session/${id}/needs`);
  };

  const isComplete = seeing.trim() && hearing.trim() && feeling.trim() && thinking.trim();

  return (
    <>
      <Stack.Screen
        options={{
          headerShown: true,
          title: 'Empathy Map',
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
              Now let's explore your experience from different angles. This empathy
              map helps you understand your experience more fully.
            </Text>

            {empathyQuadrants.map((quadrant) => (
              <View key={quadrant.key} style={styles.quadrantCard}>
                <View style={styles.quadrantHeader}>
                  <View style={styles.quadrantIcon}>
                    <quadrant.icon color="#007AFF" size={20} />
                  </View>
                  <View style={styles.quadrantTitleContainer}>
                    <Text style={styles.quadrantTitle}>{quadrant.title}</Text>
                    <Text style={styles.quadrantDescription}>
                      {quadrant.description}
                    </Text>
                  </View>
                </View>
                <TextInput
                  style={styles.input}
                  placeholder={quadrant.placeholder}
                  value={quadrant.value}
                  onChangeText={quadrant.onChange}
                  multiline
                  numberOfLines={3}
                  maxLength={500}
                  textAlignVertical="top"
                />
              </View>
            ))}

            <View style={styles.actions}>
              <TouchableOpacity
                style={[styles.saveButton, isSaving && styles.buttonDisabled]}
                onPress={handleSave}
                disabled={isSaving}
              >
                <Save color="#007AFF" size={20} />
                <Text style={styles.saveButtonText}>
                  {isSaving ? 'Saving...' : 'Save Progress'}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.continueButton,
                  !isComplete && styles.buttonDisabled,
                ]}
                onPress={handleContinue}
                disabled={!isComplete}
              >
                <Text style={styles.continueButtonText}>Continue to Needs</Text>
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
    gap: 16,
  },
  intro: {
    fontSize: 15,
    color: '#3C3C43',
    lineHeight: 22,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
  },
  quadrantCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    gap: 12,
  },
  quadrantHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  quadrantIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#E5F0FF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  quadrantTitleContainer: {
    flex: 1,
  },
  quadrantTitle: {
    fontSize: 17,
    fontWeight: '600',
    color: '#000000',
  },
  quadrantDescription: {
    fontSize: 14,
    color: '#8E8E93',
    marginTop: 2,
  },
  input: {
    backgroundColor: '#F2F2F7',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    minHeight: 80,
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
