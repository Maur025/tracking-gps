import { Router } from 'express';
import { devicePaths } from './device-paths';
import { container } from 'tsyringe';
import DeviceController from './device.controller';

const { DEFAULT } = devicePaths;
const router = Router();

const { getAllInCache } = container.resolve(DeviceController);

router.get(DEFAULT, getAllInCache);

export default router;
