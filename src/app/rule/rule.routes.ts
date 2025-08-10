import { Router } from 'express';
import { rulePaths } from './rule-paths';
import { container } from 'tsyringe';
import RuleController from './rule.controller';

const { DEFAULT } = rulePaths;
const ruleRouter = Router();

const { getAllInCache } = container.resolve(RuleController);

ruleRouter.get(DEFAULT, getAllInCache);

export { ruleRouter };
