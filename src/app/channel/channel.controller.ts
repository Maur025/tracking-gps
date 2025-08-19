import { inject, singleton } from 'tsyringe';
import ChannelCache from './cache/channel-cache';
import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';

@singleton()
export default class ChannelController {
	constructor(
		@inject(ChannelCache) private readonly channelCache: ChannelCache,
	) {}

	public readonly getAllInCache = (req: Request, res: Response): void => {
		res.status(StatusCodes.OK).json(this.channelCache.getAll());
	};
}
