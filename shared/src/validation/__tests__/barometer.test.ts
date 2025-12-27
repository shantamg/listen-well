/**
 * Barometer Validation Tests
 */

import {
  recordBarometerRequestSchema,
  exerciseCompleteRequestSchema,
  getBarometerHistoryQuerySchema,
} from '../barometer';

describe('recordBarometerRequestSchema', () => {
  it('accepts valid intensity', () => {
    const result = recordBarometerRequestSchema.safeParse({
      intensity: 5,
    });
    expect(result.success).toBe(true);
  });

  it('accepts intensity with context', () => {
    const result = recordBarometerRequestSchema.safeParse({
      intensity: 7,
      context: 'Feeling frustrated',
    });
    expect(result.success).toBe(true);
  });

  it('rejects intensity below 1', () => {
    const result = recordBarometerRequestSchema.safeParse({
      intensity: 0,
    });
    expect(result.success).toBe(false);
  });

  it('rejects intensity above 10', () => {
    const result = recordBarometerRequestSchema.safeParse({
      intensity: 11,
    });
    expect(result.success).toBe(false);
  });

  it('rejects context over 500 chars', () => {
    const result = recordBarometerRequestSchema.safeParse({
      intensity: 5,
      context: 'x'.repeat(501),
    });
    expect(result.success).toBe(false);
  });
});

describe('exerciseCompleteRequestSchema', () => {
  it('accepts breathing exercise', () => {
    const result = exerciseCompleteRequestSchema.safeParse({
      exerciseType: 'breathing',
      intensityAfter: 3,
      durationSeconds: 120,
    });
    expect(result.success).toBe(true);
  });

  it('accepts grounding exercise', () => {
    const result = exerciseCompleteRequestSchema.safeParse({
      exerciseType: 'grounding',
      intensityAfter: 4,
      durationSeconds: 60,
    });
    expect(result.success).toBe(true);
  });

  it('accepts pause exercise', () => {
    const result = exerciseCompleteRequestSchema.safeParse({
      exerciseType: 'pause',
      intensityAfter: 5,
      durationSeconds: 300,
    });
    expect(result.success).toBe(true);
  });

  it('rejects invalid exercise type', () => {
    const result = exerciseCompleteRequestSchema.safeParse({
      exerciseType: 'invalid',
      intensityAfter: 3,
      durationSeconds: 120,
    });
    expect(result.success).toBe(false);
  });

  it('rejects negative duration', () => {
    const result = exerciseCompleteRequestSchema.safeParse({
      exerciseType: 'breathing',
      intensityAfter: 3,
      durationSeconds: -10,
    });
    expect(result.success).toBe(false);
  });
});

describe('getBarometerHistoryQuerySchema', () => {
  it('accepts empty query with defaults', () => {
    const result = getBarometerHistoryQuerySchema.safeParse({});
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.limit).toBe(20);
    }
  });

  it('accepts sessionId filter', () => {
    const result = getBarometerHistoryQuerySchema.safeParse({
      sessionId: 'session-123',
    });
    expect(result.success).toBe(true);
  });

  it('accepts before timestamp', () => {
    const result = getBarometerHistoryQuerySchema.safeParse({
      before: '2024-01-01T00:00:00.000Z',
    });
    expect(result.success).toBe(true);
  });

  it('rejects limit over 100', () => {
    const result = getBarometerHistoryQuerySchema.safeParse({
      limit: 200,
    });
    expect(result.success).toBe(false);
  });
});
