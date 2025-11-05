import { Router } from 'express';
import { vehiclePaths } from './vehicle-paths.js';
import { container } from 'tsyringe';
import VehicleController from './vehicle.controller.js';

const { DEFAULT } = vehiclePaths;
const vehicleRouter: Router = Router();

const { getAllInCache } = container.resolve(VehicleController);

vehicleRouter.get(DEFAULT, getAllInCache);

export { vehicleRouter };
