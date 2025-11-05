import { inject, singleton } from 'tsyringe';
import RuleCache from './cache/rule-cache.js';
import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';

@singleton()
export default class RuleController {
	constructor(@inject(RuleCache) private readonly ruleCache: RuleCache) {}

	public readonly getAllInCache = (req: Request, res: Response) => {
		res.status(StatusCodes.OK).json(this.ruleCache.getAll());
	};
}
