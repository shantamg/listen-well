import { Router } from 'express';
import { requireAuth } from '../middleware/auth';
import { recordEmotion, getEmotions, completeExercise } from '../controllers/emotions';

const router = Router();

/**
 * Emotional Barometer Routes
 * All routes require authentication
 */

// POST /api/v1/sessions/:id/emotions - Record emotional reading
router.post('/sessions/:id/emotions', requireAuth, recordEmotion);

// GET /api/v1/sessions/:id/emotions - Get emotion history
router.get('/sessions/:id/emotions', requireAuth, getEmotions);

// POST /api/v1/sessions/:id/exercises/complete - Log exercise completion
router.post('/sessions/:id/exercises/complete', requireAuth, completeExercise);

export default router;
