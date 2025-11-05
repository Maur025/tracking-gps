import { Router } from 'express';
import { rulePaths } from './rule-paths.js';
import { container } from 'tsyringe';
import RuleController from './rule.controller.js';

const { DEFAULT } = rulePaths;
const ruleRouter: Router = Router();

const { getAllInCache } = container.resolve(RuleController);

ruleRouter.get(DEFAULT, getAllInCache);

export { ruleRouter };
