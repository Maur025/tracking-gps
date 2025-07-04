import { Router } from 'express';
import testRouter from '@app/test-app/test.routes';
import geofenceRouter from '@app/geofence/geofence.routes';
import groupRouter from '@app/group/group.routes';

const router = Router();

router.use('/groups', groupRouter);
router.use('/geofences', geofenceRouter);
router.use('/test', testRouter);

export default router;
