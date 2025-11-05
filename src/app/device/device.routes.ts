import { Router } from 'express';
import { devicePaths } from './device-paths.js';
import { container } from 'tsyringe';
import DeviceController from './device.controller.js';

const { DEFAULT } = devicePaths;
const deviceRouter: Router = Router();

const { getAllInCache } = container.resolve(DeviceController);

deviceRouter.get(DEFAULT, getAllInCache);

export { deviceRouter };
