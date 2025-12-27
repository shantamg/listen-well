import { Router } from 'express';
import {
  createSession,
  getInvitation,
  acceptInvitation,
  declineInvitation,
  resendInvitation,
} from '../controllers/invitations';

const router = Router();

/**
 * @route POST /api/v1/sessions
 * @description Create a new session with an invitation
 * @access Private - requires authentication
 */
router.post('/sessions', createSession);

/**
 * @route GET /api/v1/invitations/:id
 * @description Get invitation details (public info for accepting/declining)
 * @access Public - but only returns limited info
 */
router.get('/invitations/:id', getInvitation);

/**
 * @route POST /api/v1/invitations/:id/accept
 * @description Accept an invitation and join the session
 * @access Private - requires authentication
 */
router.post('/invitations/:id/accept', acceptInvitation);

/**
 * @route POST /api/v1/invitations/:id/decline
 * @description Decline an invitation
 * @access Private - requires authentication
 */
router.post('/invitations/:id/decline', declineInvitation);

/**
 * @route POST /api/v1/invitations/:id/resend
 * @description Resend an invitation email
 * @access Private - requires authentication (only inviter)
 */
router.post('/invitations/:id/resend', resendInvitation);

export default router;
