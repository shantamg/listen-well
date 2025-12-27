import { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Plus, MessageSquare, Clock, ChevronRight } from 'lucide-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

/**
 * Mock session data for placeholder
 */
interface Session {
  id: string;
  title: string;
  personName: string;
  stage: number;
  lastActivity: string;
  status: 'active' | 'completed' | 'pending';
}

/**
 * Sessions tab screen
 * Lists all user's sessions
 */
export default function SessionsScreen() {
  const router = useRouter();
  const [refreshing, setRefreshing] = useState(false);
  const [sessions] = useState<Session[]>([]);

  const handleNewSession = () => {
    router.push('/session/new');
  };

  const handleSessionPress = (sessionId: string) => {
    router.push(`/session/${sessionId}`);
  };

  const onRefresh = async () => {
    setRefreshing(true);
    // TODO: Fetch sessions from backend
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setRefreshing(false);
  };

  const getStageLabel = (stage: number): string => {
    const stages = [
      'Compact',
      'Chatting',
      'Empathy Map',
      'Needs',
      'Strategies',
    ];
    return stages[stage] || 'Unknown';
  };

  const getStatusColor = (status: Session['status']): string => {
    switch (status) {
      case 'active':
        return '#34C759';
      case 'completed':
        return '#007AFF';
      case 'pending':
        return '#FF9500';
      default:
        return '#8E8E93';
    }
  };

  const renderSession = ({ item }: { item: Session }) => (
    <TouchableOpacity
      style={styles.sessionCard}
      onPress={() => handleSessionPress(item.id)}
    >
      <View style={styles.sessionIcon}>
        <MessageSquare color="#007AFF" size={24} />
      </View>
      <View style={styles.sessionContent}>
        <Text style={styles.sessionTitle} numberOfLines={1}>
          {item.title}
        </Text>
        <Text style={styles.sessionSubtitle}>
          With {item.personName} - {getStageLabel(item.stage)}
        </Text>
        <View style={styles.sessionMeta}>
          <Clock color="#8E8E93" size={12} />
          <Text style={styles.sessionTime}>{item.lastActivity}</Text>
          <View
            style={[
              styles.statusBadge,
              { backgroundColor: getStatusColor(item.status) + '20' },
            ]}
          >
            <Text
              style={[styles.statusText, { color: getStatusColor(item.status) }]}
            >
              {item.status}
            </Text>
          </View>
        </View>
      </View>
      <ChevronRight color="#C7C7CC" size={20} />
    </TouchableOpacity>
  );

  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      <View style={styles.emptyState}>
        <MessageSquare color="#8E8E93" size={64} />
        <Text style={styles.emptyTitle}>No Sessions Yet</Text>
        <Text style={styles.emptyDescription}>
          Start your first session to begin expressing yourself and being heard
        </Text>
        <TouchableOpacity style={styles.newSessionButton} onPress={handleNewSession}>
          <Plus color="#FFFFFF" size={20} />
          <Text style={styles.newSessionButtonText}>New Session</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      {sessions.length === 0 ? (
        renderEmptyState()
      ) : (
        <FlatList
          data={sessions}
          renderItem={renderSession}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          ItemSeparatorComponent={() => <View style={styles.separator} />}
        />
      )}

      {/* Floating action button for new session */}
      {sessions.length > 0 && (
        <TouchableOpacity style={styles.fab} onPress={handleNewSession}>
          <Plus color="#FFFFFF" size={28} />
        </TouchableOpacity>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2F2F7',
  },
  listContent: {
    padding: 16,
  },
  sessionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    gap: 12,
  },
  sessionIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#E5F0FF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  sessionContent: {
    flex: 1,
    gap: 4,
  },
  sessionTitle: {
    fontSize: 17,
    fontWeight: '600',
    color: '#000000',
  },
  sessionSubtitle: {
    fontSize: 14,
    color: '#3C3C43',
  },
  sessionMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 4,
  },
  sessionTime: {
    fontSize: 12,
    color: '#8E8E93',
    marginRight: 8,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
  },
  statusText: {
    fontSize: 11,
    fontWeight: '600',
    textTransform: 'capitalize',
  },
  separator: {
    height: 12,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    padding: 32,
  },
  emptyState: {
    alignItems: 'center',
    gap: 16,
  },
  emptyTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#000000',
  },
  emptyDescription: {
    fontSize: 16,
    color: '#8E8E93',
    textAlign: 'center',
    lineHeight: 22,
  },
  newSessionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#007AFF',
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: 12,
    gap: 8,
    marginTop: 8,
  },
  newSessionButtonText: {
    fontSize: 17,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  fab: {
    position: 'absolute',
    bottom: 24,
    right: 24,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#007AFF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
});
