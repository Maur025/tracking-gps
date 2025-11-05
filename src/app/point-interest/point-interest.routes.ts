import { Router } from 'express';
import { pointInterestPaths } from './point-interest-paths.js';
import { container } from 'tsyringe';
import PointInterestController from './point-interest.controller.js';

const { DEFAULT } = pointInterestPaths;
const pointInterestRouter: Router = Router();

const { getAllInCache } = container.resolve(PointInterestController);

pointInterestRouter.get(DEFAULT, getAllInCache);

export { pointInterestRouter };
