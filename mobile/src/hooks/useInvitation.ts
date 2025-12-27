import { useEffect, useState, useCallback } from 'react';
import * as Linking from 'expo-linking';
import AsyncStorage from '@react-native-async-storage/async-storage';

const PENDING_INVITATION_KEY = 'pending_invitation';

/**
 * Parses invitation data from a deep link URL
 */
function parseInvitationFromUrl(url: string): string | null {
  try {
    const { path, queryParams } = Linking.parse(url);

    // Handle various URL formats:
    // - beheard://invitation/abc123
    // - beheard://invitation?id=abc123
    // - https://beheard.app/invitation/abc123
    // - https://beheard.app/invitation?id=abc123

    if (path?.startsWith('invitation/')) {
      // Path format: invitation/abc123
      const parts = path.split('/');
      if (parts.length >= 2 && parts[1]) {
        return parts[1];
      }
    }

    if (path === 'invitation' && queryParams?.id) {
      // Query param format: invitation?id=abc123
      return queryParams.id as string;
    }

    return null;
  } catch (error) {
    console.error('Failed to parse invitation URL:', error);
    return null;
  }
}

/**
 * Hook to handle invitation deep links
 *
 * When the app is opened with an invitation link, the invitation ID
 * is stored and can be retrieved after the user completes authentication.
 */
export function useInvitationLink() {
  const [invitationId, setInvitationId] = useState<string | null>(null);

  useEffect(() => {
    const handleUrl = async (event: { url: string }) => {
      const id = parseInvitationFromUrl(event.url);
      if (id) {
        console.log('[Invitation] Received invitation:', id);
        await AsyncStorage.setItem(PENDING_INVITATION_KEY, id);
        setInvitationId(id);
      }
    };

    // Listen for incoming URLs while app is running
    const subscription = Linking.addEventListener('url', handleUrl);

    // Check initial URL (app opened via deep link)
    Linking.getInitialURL().then((url) => {
      if (url) {
        handleUrl({ url });
      }
    });

    return () => {
      subscription.remove();
    };
  }, []);

  return invitationId;
}

/**
 * Get the pending invitation ID from storage
 * Call this after successful authentication to navigate to the invited session
 */
export async function getPendingInvitation(): Promise<string | null> {
  try {
    return await AsyncStorage.getItem(PENDING_INVITATION_KEY);
  } catch (error) {
    console.error('Failed to get pending invitation:', error);
    return null;
  }
}

/**
 * Clear the pending invitation from storage
 * Call this after successfully joining a session
 */
export async function clearPendingInvitation(): Promise<void> {
  try {
    await AsyncStorage.removeItem(PENDING_INVITATION_KEY);
  } catch (error) {
    console.error('Failed to clear pending invitation:', error);
  }
}

/**
 * Hook to manage pending invitations after authentication
 */
export function usePendingInvitation() {
  const [pendingInvitation, setPendingInvitation] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadPendingInvitation = async () => {
      try {
        const invitation = await getPendingInvitation();
        setPendingInvitation(invitation);
      } catch (error) {
        console.error('Failed to load pending invitation:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadPendingInvitation();
  }, []);

  const clearInvitation = useCallback(async () => {
    await clearPendingInvitation();
    setPendingInvitation(null);
  }, []);

  return {
    pendingInvitation,
    isLoading,
    clearInvitation,
  };
}

/**
 * Generate an invitation deep link URL
 */
export function createInvitationLink(invitationId: string): string {
  // Use Linking.createURL for proper scheme handling
  return Linking.createURL(`invitation/${invitationId}`);
}
