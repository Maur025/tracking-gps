import { Router } from 'express';
import { channelPaths } from './channel-paths';
import { container } from 'tsyringe';
import ChannelController from './channel.controller';

const { DEFAULT } = channelPaths;
const channelRouter = Router();

const { getAllInCache } = container.resolve(ChannelController);

channelRouter.get(DEFAULT, getAllInCache);

export { channelRouter };
