import { Router } from 'express';
import v1Routes from '@routes/v1/index.routes';

const router = Router();

router.use('/v1', v1Routes);

export default router;
