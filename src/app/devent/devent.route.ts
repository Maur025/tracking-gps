import { Router } from 'express';
import { deventPaths } from './devent-paths';
import { container } from 'tsyringe';
import DeventController from './devent.controller';

const { DEFAULT } = deventPaths;
const deventRouter = Router();

const { getAllInCache } = container.resolve(DeventController);

deventRouter.get(DEFAULT, getAllInCache);

export { deventRouter };
