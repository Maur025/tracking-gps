import GeofenceController from '@app/geofence/geofence.controller.js';
import { Router } from 'express';
import { container } from 'tsyringe';
import { geofencePaths } from './geofence-paths.js';

const { DEFAULT } = geofencePaths;

const geofenceRouter: Router = Router();

const geofenceController = container.resolve(GeofenceController);

geofenceRouter.get(DEFAULT, geofenceController.getAllInCache);
geofenceRouter.get('/report', geofenceController.getReport);
geofenceRouter.get('/report/pdfmake', geofenceController.getReportPdfMake);

export { geofenceRouter };
