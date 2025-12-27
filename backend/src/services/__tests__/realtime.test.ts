import {
  publishSessionEvent,
  notifyPartner,
  isUserPresent,
  getSessionChannelName,
  resetAblyClient,
  SessionEvent,
} from '../realtime';
import * as pushService from '../push';

// Mock the push service
jest.mock('../push', () => ({
  sendPushNotification: jest.fn().mockResolvedValue(true),
}));

// Mock Ably
const mockPublish = jest.fn().mockResolvedValue(undefined);
const mockPresenceGet = jest.fn().mockResolvedValue({ items: [] });

jest.mock('ably', () => {
  const MockRest = jest.fn().mockImplementation(() => ({
    channels: {
      get: jest.fn().mockReturnValue({
        publish: mockPublish,
        presence: {
          get: mockPresenceGet,
        },
      }),
    },
  }));

  return {
    __esModule: true,
    default: {
      Rest: MockRest,
    },
    Rest: MockRest,
  };
});

describe('Realtime Service', () => {
  const testSessionId = 'session-123';
  const testUserId = 'user-456';
  const testPartnerId = 'partner-789';

  beforeEach(() => {
    jest.clearAllMocks();
    resetAblyClient();
    // Reset ABLY_API_KEY for each test
    delete process.env.ABLY_API_KEY;
  });

  afterAll(() => {
    delete process.env.ABLY_API_KEY;
  });

  describe('getSessionChannelName', () => {
    it('returns correct channel name format', () => {
      const channelName = getSessionChannelName('test-session');
      expect(channelName).toBe('beheard:session:test-session');
    });
  });

  describe('publishSessionEvent', () => {
    it('logs event when Ably is not configured (mock mode)', async () => {
      const consoleSpy = jest.spyOn(console, 'log').mockImplementation();

      await publishSessionEvent(testSessionId, 'partner.signed_compact', {
        userId: testUserId,
      });

      expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringContaining('[Realtime Mock]'),
        expect.objectContaining({
          event: 'partner.signed_compact',
        })
      );

      consoleSpy.mockRestore();
    });

    it('publishes to Ably channel when configured', async () => {
      process.env.ABLY_API_KEY = 'test-api-key';
      resetAblyClient();

      await publishSessionEvent(testSessionId, 'partner.stage_completed', {
        stage: 2,
      });

      expect(mockPublish).toHaveBeenCalledWith(
        'partner.stage_completed',
        expect.objectContaining({
          sessionId: testSessionId,
          stage: 2,
          timestamp: expect.any(Number),
        })
      );
    });

    it('includes excludeUserId in event data when provided', async () => {
      process.env.ABLY_API_KEY = 'test-api-key';
      resetAblyClient();

      await publishSessionEvent(
        testSessionId,
        'agreement.proposed',
        { agreementId: 'agr-1' },
        testUserId
      );

      expect(mockPublish).toHaveBeenCalledWith(
        'agreement.proposed',
        expect.objectContaining({
          excludeUserId: testUserId,
          agreementId: 'agr-1',
        })
      );
    });

    it('handles all session event types', async () => {
      const events: SessionEvent[] = [
        'partner.signed_compact',
        'partner.stage_completed',
        'partner.advanced',
        'partner.empathy_shared',
        'partner.needs_shared',
        'partner.ranking_submitted',
        'agreement.proposed',
        'agreement.confirmed',
        'session.paused',
        'session.resumed',
        'session.resolved',
      ];

      for (const event of events) {
        await expect(
          publishSessionEvent(testSessionId, event, {})
        ).resolves.not.toThrow();
      }
    });
  });

  describe('isUserPresent', () => {
    it('returns false when Ably is not configured (mock mode)', async () => {
      const result = await isUserPresent(testSessionId, testUserId);
      expect(result).toBe(false);
    });

    it('returns true when user is in presence list', async () => {
      process.env.ABLY_API_KEY = 'test-api-key';
      resetAblyClient();

      mockPresenceGet.mockResolvedValueOnce({
        items: [
          { clientId: testUserId },
          { clientId: 'other-user' },
        ],
      });

      const result = await isUserPresent(testSessionId, testUserId);
      expect(result).toBe(true);
    });

    it('returns false when user is not in presence list', async () => {
      process.env.ABLY_API_KEY = 'test-api-key';
      resetAblyClient();

      mockPresenceGet.mockResolvedValueOnce({ items: [{ clientId: 'other-user' }] });

      const result = await isUserPresent(testSessionId, testUserId);
      expect(result).toBe(false);
    });

    it('returns false when presence check fails', async () => {
      process.env.ABLY_API_KEY = 'test-api-key';
      resetAblyClient();

      mockPresenceGet.mockRejectedValueOnce(new Error('Connection failed'));

      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();

      const result = await isUserPresent(testSessionId, testUserId);
      expect(result).toBe(false);
      expect(consoleSpy).toHaveBeenCalled();

      consoleSpy.mockRestore();
    });
  });

  describe('notifyPartner', () => {
    it('sends push notification when partner is offline (mock mode)', async () => {
      const mockSendPush = pushService.sendPushNotification as jest.Mock;

      await notifyPartner(testSessionId, testPartnerId, 'partner.empathy_shared', {
        empathyId: 'emp-1',
      });

      expect(mockSendPush).toHaveBeenCalledWith(
        testPartnerId,
        'partner.empathy_shared',
        { empathyId: 'emp-1' },
        testSessionId
      );
    });

    it('publishes to Ably when partner is online', async () => {
      process.env.ABLY_API_KEY = 'test-api-key';
      resetAblyClient();

      // Partner is present in channel
      mockPresenceGet.mockResolvedValueOnce({ items: [{ clientId: testPartnerId }] });

      const mockSendPush = pushService.sendPushNotification as jest.Mock;

      await notifyPartner(testSessionId, testPartnerId, 'partner.needs_shared', {
        needsCount: 3,
      });

      // Should publish to Ably, not send push
      expect(mockPublish).toHaveBeenCalled();
      expect(mockSendPush).not.toHaveBeenCalled();
    });

    it('sends push notification when partner is offline with Ably configured', async () => {
      process.env.ABLY_API_KEY = 'test-api-key';
      resetAblyClient();

      // Partner is NOT present
      mockPresenceGet.mockResolvedValueOnce({ items: [{ clientId: 'other-user' }] });

      const mockSendPush = pushService.sendPushNotification as jest.Mock;

      await notifyPartner(testSessionId, testPartnerId, 'session.paused', {});

      expect(mockSendPush).toHaveBeenCalledWith(
        testPartnerId,
        'session.paused',
        {},
        testSessionId
      );
    });
  });
});
