import { inject, singleton } from 'tsyringe';
import DeventCache from './cache/devent-cache.js';
import { Response, Request } from 'express';
import { StatusCodes } from 'http-status-codes';

@singleton()
export default class DeventController {
	constructor(@inject(DeventCache) private readonly deventCache: DeventCache) {}

	public readonly getAllInCache = (req: Request, res: Response) => {
		res.status(StatusCodes.OK).json(this.deventCache.getAll());
	};
}
