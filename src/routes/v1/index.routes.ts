import { Router } from 'express';
import { vehicleRouter } from '@app/vehicle/vehicle.routes.js';
import { pointInterestRouter } from '@app/point-interest/point-interest.routes.js';
import { ruleRouter } from '@app/rule/rule.routes.js';
import { deventRouter } from '@app/devent/devent.route.js';
import { groupRouter } from '@app/group/group.routes.js';
import { geofenceRouter } from '@app/geofence/geofence.routes.js';
import { deviceRouter } from '@app/device/device.routes.js';
import { testRouter } from '@app/test-app/test.routes.js';

const v1Router: Router = Router();

v1Router.use('/groups', groupRouter);
v1Router.use('/geofences', geofenceRouter);
v1Router.use('/devices', deviceRouter);
v1Router.use('/tests', testRouter);
v1Router.use('/vehicles', vehicleRouter);
v1Router.use('/point-interests', pointInterestRouter);
v1Router.use('/rules', ruleRouter);
v1Router.use('/devents', deventRouter);

export { v1Router };
