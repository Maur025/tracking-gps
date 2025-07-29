import { Router } from 'express';
import { vehiclePaths } from './vehicle-paths';
import { container } from 'tsyringe';
import VehicleController from './vehicle.controller';

const { DEFAULT } = vehiclePaths;
const vehicleRouter = Router();

const { getAllInCache } = container.resolve(VehicleController);

vehicleRouter.get(DEFAULT, getAllInCache);

export { vehicleRouter };
