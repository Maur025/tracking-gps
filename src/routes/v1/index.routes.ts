import { Router } from 'express';
import testRouter from '@routes/v1/test/test.routes';
import geofenceRouter from '@routes/v1/geofence/geofence.routes';

const router = Router();

router.use('/geofence', geofenceRouter);
router.use('/test', testRouter);

export default router;
