import { Router } from 'express';
import { pointInterestPaths } from './point-interest-paths';
import { container } from 'tsyringe';
import PointInterestController from './point-interest.controller';
const { DEFAULT } = pointInterestPaths;
const pointInterestRouter = Router();

const { getAllInCache } = container.resolve(PointInterestController);

pointInterestRouter.get(DEFAULT, getAllInCache);

export { pointInterestRouter };
