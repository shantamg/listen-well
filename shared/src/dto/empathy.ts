/**
 * Empathy (Stage 2) DTOs
 *
 * Drafting, sharing, and validating empathy attempts.
 */

// ============================================================================
// Drafting
// ============================================================================

export interface EmpathyDraftDTO {
  id: string;
  content: string;
  version: number;
  readyToShare: boolean;
  updatedAt: string;
}

export interface SaveEmpathyDraftRequest {
  sessionId: string;
  content: string;
  readyToShare?: boolean;
}

export interface SaveEmpathyDraftResponse {
  draft: EmpathyDraftDTO;
  readyToShare: boolean;
}

export interface GetEmpathyDraftResponse {
  draft: EmpathyDraftDTO | null;
  canConsent: boolean;
  alreadyConsented: boolean;
}

// ============================================================================
// Consent to Share
// ============================================================================

export interface ConsentToShareEmpathyRequest {
  sessionId: string;
  draftId: string;
  finalContent?: string;
}

export interface EmpathyAttemptDTO {
  id: string;
  sourceUserId: string;
  content: string;
  sharedAt: string;
  consentRecordId: string;
}

export interface ConsentToShareEmpathyResponse {
  consented: boolean;
  consentedAt: string;
  waitingForPartner: boolean;
  partnerAttempt?: EmpathyAttemptDTO;
}

// ============================================================================
// Exchange & Validation
// ============================================================================

export interface GetPartnerEmpathyResponse {
  attempt: EmpathyAttemptDTO | null;
  waitingForPartner: boolean;
  validated: boolean;
  validatedAt: string | null;
  awaitingRevision: boolean;
}

export interface ValidateEmpathyRequest {
  sessionId: string;
  validated: boolean;
  feedback?: string;
  consentToShareFeedback?: boolean;
}

export interface ValidateEmpathyResponse {
  validated: boolean;
  validatedAt: string | null;
  feedbackShared: boolean;
  awaitingRevision: boolean;
  canAdvance: boolean;
  partnerValidated: boolean;
}
