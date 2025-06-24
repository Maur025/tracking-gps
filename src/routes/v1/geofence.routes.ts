import { Router } from 'express';
import GeofenceController from '../../controllers/geofence.controller';
import { container } from 'tsyringe';

const router = Router();

const geofenceController = container.resolve(GeofenceController);

router.get('/', geofenceController.getAllInCache);
router.get('/report', geofenceController.getReport);

export default router;
