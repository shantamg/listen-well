import { Router } from 'express';
import authRoutes from './auth';
import emotionsRoutes from './emotions';

const router = Router();

// Mount all route modules
router.use('/auth', authRoutes);
router.use(emotionsRoutes);

// Health check endpoint
router.get('/health', (_, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

export default router;
