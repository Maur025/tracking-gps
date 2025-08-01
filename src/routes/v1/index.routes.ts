import { Router } from 'express';
import testRouter from '@app/test-app/test.routes';
import geofenceRouter from '@app/geofence/geofence.routes';
import groupRouter from '@app/group/group.routes';
import deviceRouter from '@app/device/device.routes';
import { vehicleRouter } from '@app/vehicle/vehicle.routes';
import { pointInterestRouter } from '@app/point-interest/point-interest.routes';

const router = Router();

router.use('/groups', groupRouter);
router.use('/geofences', geofenceRouter);
router.use('/devices', deviceRouter);
router.use('/tests', testRouter);
router.use('/vehicles', vehicleRouter);
router.use('/point-interests', pointInterestRouter);

export default router;
