/**
 * Session Validation Schemas
 *
 * Zod schemas for validating session-related API requests.
 * Note: More complete schemas are in contracts/sessions.ts.
 * This file provides standalone validation utilities.
 */

import { z } from 'zod';
import { SessionStatus, Stage, StageStatus } from '../enums';

// ============================================================================
// Session Status & Stage Enums as Zod
// ============================================================================

export const sessionStatusSchema = z.nativeEnum(SessionStatus);
export const stageSchema = z.nativeEnum(Stage);
export const stageStatusSchema = z.nativeEnum(StageStatus);

// ============================================================================
// Stage Progress Validation
// ============================================================================

export const stageProgressSchema = z.object({
  stage: stageSchema,
  status: stageStatusSchema,
  startedAt: z.string().datetime().nullable(),
  completedAt: z.string().datetime().nullable(),
});

export type StageProgressInput = z.infer<typeof stageProgressSchema>;
