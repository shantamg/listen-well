/**
 * SessionCard Component
 *
 * Displays a session summary with partner info, current stage, and action status.
 * Supports both regular and hero card variants for visual hierarchy.
 */

import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import type { SessionSummaryDTO } from '@listen-well/shared';
import { STAGE_NAMES } from '@listen-well/shared';

// ============================================================================
// Types
// ============================================================================

interface SessionCardProps {
  /** The session data to display */
  session: SessionSummaryDTO;
  /** Whether to display as a hero card (larger, more prominent) */
  isHero?: boolean;
}

// ============================================================================
// Component
// ============================================================================

/**
 * SessionCard displays a summary of a session.
 *
 * Features:
 * - Partner name display
 * - Current stage indicator
 * - Action needed badge and text
 * - Hero variant for most urgent session
 * - Navigates to session detail on press
 */
export function SessionCard({ session, isHero = false }: SessionCardProps) {
  const router = useRouter();

  const currentStage = session.myProgress.stage;
  const actionNeeded = session.selfActionNeeded.length > 0;
  const waitingForPartner = session.partnerActionNeeded.length > 0;

  const handlePress = () => {
    router.push(`/session/${session.id}`);
  };

  return (
    <TouchableOpacity
      testID={isHero ? 'hero-card' : 'session-card'}
      style={[
        styles.card,
        isHero && styles.heroCard,
        actionNeeded && styles.actionCard,
      ]}
      onPress={handlePress}
      activeOpacity={0.7}
      accessibilityRole="button"
      accessibilityLabel={`Session with ${session.partner.name || 'Partner'}`}
      accessibilityHint="Tap to view session details"
    >
      <View style={styles.header}>
        <Text
          style={[
            styles.partnerName,
            isHero && styles.heroPartnerName,
          ]}
          numberOfLines={1}
        >
          {session.partner.name || 'Partner'}
        </Text>
        {actionNeeded && (
          <View
            testID="action-badge"
            style={[
              styles.badge,
              isHero && styles.heroBadge,
            ]}
            accessibilityLabel="Action needed"
          />
        )}
      </View>

      <Text
        style={[
          styles.stage,
          isHero && styles.heroStage,
        ]}
      >
        {STAGE_NAMES[currentStage]}
      </Text>

      {actionNeeded && (
        <Text
          style={[
            styles.actionText,
            isHero && styles.heroActionText,
          ]}
        >
          Your turn
        </Text>
      )}

      {!actionNeeded && waitingForPartner && (
        <Text
          style={[
            styles.waitingText,
            isHero && styles.heroWaitingText,
          ]}
        >
          Waiting for partner
        </Text>
      )}

      {isHero && (
        <View style={styles.heroFooter}>
          <Text style={styles.heroHint}>Tap to continue</Text>
        </View>
      )}
    </TouchableOpacity>
  );
}

// ============================================================================
// Styles
// ============================================================================

const styles = StyleSheet.create({
  // Base card styles
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },

  // Action needed card (subtle highlight)
  actionCard: {
    borderLeftWidth: 3,
    borderLeftColor: '#4F46E5',
  },

  // Hero card variant
  heroCard: {
    backgroundColor: '#4F46E5',
    padding: 24,
    marginBottom: 20,
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
    borderLeftWidth: 0,
  },

  // Header with name and badge
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },

  // Partner name
  partnerName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    flex: 1,
    marginRight: 8,
  },
  heroPartnerName: {
    color: '#FFFFFF',
    fontSize: 22,
    fontWeight: '700',
  },

  // Action badge
  badge: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#EF4444',
  },
  heroBadge: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#FCD34D',
  },

  // Stage name
  stage: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 4,
  },
  heroStage: {
    color: '#E0E7FF',
    fontSize: 16,
    marginTop: 8,
  },

  // Action text
  actionText: {
    fontSize: 14,
    color: '#4F46E5',
    fontWeight: '600',
    marginTop: 12,
  },
  heroActionText: {
    color: '#FCD34D',
    fontSize: 16,
    marginTop: 16,
  },

  // Waiting text
  waitingText: {
    fontSize: 14,
    color: '#9CA3AF',
    marginTop: 12,
  },
  heroWaitingText: {
    color: '#A5B4FC',
    fontSize: 16,
    marginTop: 16,
  },

  // Hero footer
  heroFooter: {
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.2)',
  },
  heroHint: {
    fontSize: 14,
    color: '#C7D2FE',
    textAlign: 'center',
  },
});

export default SessionCard;
