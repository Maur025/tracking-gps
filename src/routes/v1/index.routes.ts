import { Router } from 'express';
import testRouter from '@routes/v1/test/test.routes';
import geofenceRouter from '@app/geofence/geofence.routes';
import groupRouter from '@routes/v1/group/group.routes';

const router = Router();

router.use('/groups', groupRouter);
router.use('/geofences', geofenceRouter);
router.use('/test', testRouter);

export default router;
