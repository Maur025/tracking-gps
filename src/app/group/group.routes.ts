import GroupController from '@app/group/group.controller.js';
import { Router } from 'express';
import { container } from 'tsyringe';
import { groupPaths } from './group-paths.js';

const { DEFAULT } = groupPaths;

const groupRouter: Router = Router();

const groupController = container.resolve(GroupController);

groupRouter.get(DEFAULT, groupController.getAllInCache);

export { groupRouter };
