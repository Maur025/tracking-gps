import { Router } from 'express';
import testRouter from '@routes/v1/test.routes';

const router = Router();

router.use('/test', testRouter);

export default router;
