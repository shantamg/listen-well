import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import {
  MessageSquare,
  FileText,
  Heart,
  Target,
  Lightbulb,
  Share2,
  ChevronRight,
} from 'lucide-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

/**
 * Session dashboard screen
 * Overview of session with navigation to different stages
 */
export default function SessionDashboardScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();

  // Mock session data
  const session = {
    id,
    title: 'Sample Session',
    description: 'This is a placeholder session for navigation testing',
    stage: 0,
    personName: 'Alex',
    createdAt: new Date().toISOString(),
  };

  const stages = [
    {
      id: 'compact',
      icon: FileText,
      title: 'Compact View',
      description: 'Initial thoughts in compact format',
      stage: 0,
    },
    {
      id: 'chat',
      icon: MessageSquare,
      title: 'AI Chat',
      description: 'Explore your feelings with AI guidance',
      stage: 1,
    },
    {
      id: 'empathy',
      icon: Heart,
      title: 'Empathy Map',
      description: 'Map out the empathy perspective',
      stage: 2,
    },
    {
      id: 'needs',
      icon: Target,
      title: 'Needs',
      description: 'Identify underlying needs',
      stage: 3,
    },
    {
      id: 'strategies',
      icon: Lightbulb,
      title: 'Strategies',
      description: 'Develop action strategies',
      stage: 4,
    },
  ];

  const handleStagePress = (stageId: string) => {
    router.push(`/session/${id}/${stageId}`);
  };

  const handleInvite = () => {
    // TODO: Implement invite flow
  };

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.content}>
        {/* Session header */}
        <View style={styles.header}>
          <Text style={styles.title}>{session.title}</Text>
          {session.description && (
            <Text style={styles.description}>{session.description}</Text>
          )}
          {session.personName && (
            <View style={styles.personBadge}>
              <Text style={styles.personLabel}>Sharing with</Text>
              <Text style={styles.personName}>{session.personName}</Text>
            </View>
          )}
        </View>

        {/* Session stages */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Session Stages</Text>
          <View style={styles.stagesContainer}>
            {stages.map((stage, index) => {
              const isActive = session.stage >= stage.stage;
              const isCurrent = session.stage === stage.stage;

              return (
                <TouchableOpacity
                  key={stage.id}
                  style={[
                    styles.stageCard,
                    isActive && styles.stageCardActive,
                    isCurrent && styles.stageCardCurrent,
                  ]}
                  onPress={() => handleStagePress(stage.id)}
                >
                  <View
                    style={[
                      styles.stageIcon,
                      isActive && styles.stageIconActive,
                    ]}
                  >
                    <stage.icon
                      color={isActive ? '#007AFF' : '#8E8E93'}
                      size={24}
                    />
                  </View>
                  <View style={styles.stageContent}>
                    <Text
                      style={[
                        styles.stageTitle,
                        isActive && styles.stageTitleActive,
                      ]}
                    >
                      {stage.title}
                    </Text>
                    <Text style={styles.stageDescription}>
                      {stage.description}
                    </Text>
                  </View>
                  <ChevronRight
                    color={isActive ? '#007AFF' : '#C7C7CC'}
                    size={20}
                  />
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* Actions */}
        <View style={styles.section}>
          <TouchableOpacity style={styles.inviteButton} onPress={handleInvite}>
            <Share2 color="#007AFF" size={20} />
            <Text style={styles.inviteButtonText}>Invite Someone to Listen</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2F2F7',
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 16,
    gap: 24,
  },
  header: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    gap: 8,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: '#000000',
  },
  description: {
    fontSize: 15,
    color: '#3C3C43',
    lineHeight: 22,
  },
  personBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 8,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#E5E5EA',
  },
  personLabel: {
    fontSize: 14,
    color: '#8E8E93',
  },
  personName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#007AFF',
  },
  section: {
    gap: 12,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: '600',
    color: '#000000',
  },
  stagesContainer: {
    gap: 8,
  },
  stageCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    gap: 12,
    opacity: 0.6,
  },
  stageCardActive: {
    opacity: 1,
  },
  stageCardCurrent: {
    borderWidth: 2,
    borderColor: '#007AFF',
  },
  stageIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#F2F2F7',
    justifyContent: 'center',
    alignItems: 'center',
  },
  stageIconActive: {
    backgroundColor: '#E5F0FF',
  },
  stageContent: {
    flex: 1,
  },
  stageTitle: {
    fontSize: 17,
    fontWeight: '600',
    color: '#8E8E93',
  },
  stageTitleActive: {
    color: '#000000',
  },
  stageDescription: {
    fontSize: 14,
    color: '#8E8E93',
    marginTop: 2,
  },
  inviteButton: {
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
  inviteButtonText: {
    fontSize: 17,
    fontWeight: '600',
    color: '#007AFF',
  },
});
