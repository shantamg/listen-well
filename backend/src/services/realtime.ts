import Ably from 'ably';
import { sendPushNotification } from './push';

/**
 * Session events for real-time communication between partners.
 * These events are published to Ably channels and/or sent as push notifications.
 */
export type SessionEvent =
  | 'partner.signed_compact'
  | 'partner.stage_completed'
  | 'partner.advanced'
  | 'partner.empathy_shared'
  | 'partner.needs_shared'
  | 'partner.ranking_submitted'
  | 'agreement.proposed'
  | 'agreement.confirmed'
  | 'session.paused'
  | 'session.resumed'
  | 'session.resolved';

/**
 * Event data payload type for session events.
 */
export interface SessionEventData {
  sessionId: string;
  userId?: string;
  stage?: number;
  timestamp: number;
  [key: string]: unknown;
}

/**
 * Ably client singleton.
 * Returns null if ABLY_API_KEY is not configured (for development/testing).
 */
function getAblyClient(): Ably.Rest | null {
  const apiKey = process.env.ABLY_API_KEY;
  if (!apiKey) {
    console.warn('[Realtime] ABLY_API_KEY not configured - realtime events will be mocked');
    return null;
  }
  return new Ably.Rest(apiKey);
}

// Lazy-initialized Ably client
let ablyClient: Ably.Rest | null | undefined;

function getAbly(): Ably.Rest | null {
  if (ablyClient === undefined) {
    ablyClient = getAblyClient();
  }
  return ablyClient;
}

/**
 * Reset the Ably client (useful for testing).
 */
export function resetAblyClient(): void {
  ablyClient = undefined;
}

/**
 * Publishes a session event to the Ably channel for the given session.
 * If Ably is not configured, the event is logged but not published.
 *
 * @param sessionId - The session ID to publish to
 * @param event - The event type to publish
 * @param data - The event data payload
 * @param excludeUserId - Optional user ID to exclude from receiving the event
 * @returns Promise<void>
 */
export async function publishSessionEvent(
  sessionId: string,
  event: SessionEvent,
  data: Record<string, unknown>,
  excludeUserId?: string
): Promise<void> {
  const ably = getAbly();

  const eventData: SessionEventData = {
    sessionId,
    timestamp: Date.now(),
    excludeUserId,
    ...data,
  };

  if (!ably) {
    // Mock mode: log the event
    console.log(`[Realtime Mock] Publishing to beheard:session:${sessionId}`, {
      event,
      data: eventData,
    });
    return;
  }

  try {
    const channel = ably.channels.get(`beheard:session:${sessionId}`);
    await channel.publish(event, eventData);
    console.log(`[Realtime] Published ${event} to session ${sessionId}`);
  } catch (error) {
    console.error(`[Realtime] Failed to publish ${event} to session ${sessionId}:`, error);
    throw error;
  }
}

/**
 * Checks if a user is present (online) in a session's presence channel.
 *
 * @param sessionId - The session ID
 * @param userId - The user ID to check
 * @returns Promise<boolean> - true if user is present
 */
export async function isUserPresent(sessionId: string, userId: string): Promise<boolean> {
  const ably = getAbly();

  if (!ably) {
    // Mock mode: assume user is not present (will trigger push notification)
    console.log(`[Realtime Mock] Checking presence for user ${userId} in session ${sessionId}`);
    return false;
  }

  try {
    const presenceChannel = ably.channels.get(`beheard:session:${sessionId}`);
    const presenceResult = await presenceChannel.presence.get();
    // Ably v2 returns a PaginatedResult, need to access .items
    const members = presenceResult.items || [];
    return members.some((m: Ably.PresenceMessage) => m.clientId === userId);
  } catch (error) {
    console.error(`[Realtime] Failed to check presence for user ${userId}:`, error);
    return false;
  }
}

/**
 * Notifies a partner of a session event.
 * If the partner is online (present in the Ably channel), the event is published.
 * If the partner is offline, a push notification is sent instead.
 *
 * @param sessionId - The session ID
 * @param partnerId - The partner's user ID
 * @param event - The event type
 * @param data - The event data payload
 */
export async function notifyPartner(
  sessionId: string,
  partnerId: string,
  event: SessionEvent,
  data: Record<string, unknown>
): Promise<void> {
  const partnerPresent = await isUserPresent(sessionId, partnerId);

  if (partnerPresent) {
    // Partner is online - publish to Ably channel
    await publishSessionEvent(sessionId, event, data);
  } else {
    // Partner is offline - send push notification
    await sendPushNotification(partnerId, event, data, sessionId);
  }
}

/**
 * Get the Ably channel name for a session.
 *
 * @param sessionId - The session ID
 * @returns The Ably channel name
 */
export function getSessionChannelName(sessionId: string): string {
  return `beheard:session:${sessionId}`;
}
