import GroupController from '@app/group/group.controller';
import { Router } from 'express';
import { container } from 'tsyringe';
import { groupPaths } from './group-paths';

const { DEFAULT } = groupPaths;

const router = Router();

const groupController = container.resolve(GroupController);

router.get(DEFAULT, groupController.getAllInCache);

export default router;
