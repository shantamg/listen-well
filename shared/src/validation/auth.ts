/**
 * Auth Validation Schemas
 *
 * Zod schemas for authentication endpoints.
 * Note: Comprehensive auth contracts are in contracts/auth.ts
 */

// Re-export from contracts to avoid duplication
export {
  updatePushTokenRequestSchema,
  updatePushTokenResponseSchema,
  updateProfileRequestSchema,
  updateProfileResponseSchema,
  getMeResponseSchema,
  forgotPasswordRequestSchema,
  forgotPasswordResponseSchema,
  resetPasswordRequestSchema,
  resetPasswordResponseSchema,
  ablyTokenResponseSchema,
  userDTOSchema,
  type UpdatePushTokenRequestInput,
  type UpdateProfileRequestInput,
  type GetMeResponseInput,
  type ForgotPasswordRequestInput,
  type ResetPasswordRequestInput,
  type AblyTokenResponseInput,
} from '../contracts/auth';
