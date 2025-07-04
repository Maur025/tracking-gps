import GeofenceController from '@app/geofence/geofence.controller';
import { Router } from 'express';
import { container } from 'tsyringe';
import { geofencePaths } from './geofence-paths';

const { DEFAULT } = geofencePaths;

const router = Router();

const geofenceController = container.resolve(GeofenceController);

router.get(DEFAULT, geofenceController.getAllInCache);
router.get('/report', geofenceController.getReport);
router.get('/report/pdfmake', geofenceController.getReportPdfMake);

export default router;
