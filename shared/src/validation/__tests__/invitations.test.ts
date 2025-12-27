/**
 * Invitations Validation Tests
 */

import {
  acceptInvitationParamsSchema,
  resendInvitationRequestSchema,
  invitationStatusCheckSchema,
} from '../invitations';

describe('acceptInvitationParamsSchema', () => {
  it('accepts valid CUID', () => {
    const result = acceptInvitationParamsSchema.safeParse({
      invitationId: 'clxxxxxxxxxxxxxxxxxx123',
    });
    expect(result.success).toBe(true);
  });

  it('rejects invalid CUID', () => {
    const result = acceptInvitationParamsSchema.safeParse({
      invitationId: 'not-a-cuid',
    });
    expect(result.success).toBe(false);
  });

  it('rejects missing invitationId', () => {
    const result = acceptInvitationParamsSchema.safeParse({});
    expect(result.success).toBe(false);
  });
});

describe('resendInvitationRequestSchema', () => {
  it('accepts valid CUID', () => {
    const result = resendInvitationRequestSchema.safeParse({
      invitationId: 'clxxxxxxxxxxxxxxxxxx123',
    });
    expect(result.success).toBe(true);
  });

  it('rejects invalid CUID', () => {
    const result = resendInvitationRequestSchema.safeParse({
      invitationId: 'not-a-cuid',
    });
    expect(result.success).toBe(false);
  });
});

describe('invitationStatusCheckSchema', () => {
  it('accepts valid statuses', () => {
    expect(invitationStatusCheckSchema.safeParse('pending').success).toBe(true);
    expect(invitationStatusCheckSchema.safeParse('accepted').success).toBe(true);
    expect(invitationStatusCheckSchema.safeParse('expired').success).toBe(true);
    expect(invitationStatusCheckSchema.safeParse('declined').success).toBe(true);
  });

  it('rejects invalid status', () => {
    expect(invitationStatusCheckSchema.safeParse('INVALID').success).toBe(false);
  });
});
