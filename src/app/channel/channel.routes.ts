import { Router } from 'express';
import { channelPaths } from './channel-paths.js';
import { container } from 'tsyringe';
import ChannelController from './channel.controller.js';

const { DEFAULT } = channelPaths;
const channelRouter: Router = Router();

const { getAllInCache } = container.resolve(ChannelController);

channelRouter.get(DEFAULT, getAllInCache);

export { channelRouter };
