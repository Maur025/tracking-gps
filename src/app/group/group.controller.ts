import { inject, injectable } from 'tsyringe';
import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { GroupCache } from './cache/group-cache';

@injectable()
export default class GroupController {
	constructor(@inject(GroupCache) private readonly groupCache: GroupCache) {}

	public readonly getAllInCache = (req: Request, res: Response): void => {
		res.status(StatusCodes.OK).json(this.groupCache.getAll());
	};
}
