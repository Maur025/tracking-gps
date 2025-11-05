import { Router } from 'express';
import { deventPaths } from './devent-paths.js';
import { container } from 'tsyringe';
import DeventController from './devent.controller.js';

const { DEFAULT } = deventPaths;
const deventRouter: Router = Router();

const { getAllInCache } = container.resolve(DeventController);

deventRouter.get(DEFAULT, getAllInCache);

export { deventRouter };
