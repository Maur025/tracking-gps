import { Router } from 'express';
import GeofenceController from '../../controllers/geofence.controller';
import { container } from 'tsyringe';

const router = Router();

const geofenceController = container.resolve(GeofenceController);

router.get('/', geofenceController.getAllInCache);

export default router;
