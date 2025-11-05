import { inject, singleton } from 'tsyringe';
import PointInterestCache from './cache/point-interest-cache.js';
import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';

@singleton()
export default class PointInterestController {
	constructor(
		@inject(PointInterestCache)
		private readonly pointInterestCache: PointInterestCache,
	) {}

	public readonly getAllInCache = (req: Request, res: Response): void => {
		res.status(StatusCodes.OK).json(this.pointInterestCache.getAll());
	};
}
