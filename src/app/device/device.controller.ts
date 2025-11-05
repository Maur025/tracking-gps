import { inject, injectable } from 'tsyringe';
import DeviceCache from './cache/device-cache.js';
import { StatusCodes } from 'http-status-codes';
import { Request, Response } from 'express';

@injectable()
export default class DeviceController {
	constructor(@inject(DeviceCache) private readonly deviceCache: DeviceCache) {}

	public readonly getAllInCache = (req: Request, res: Response): void => {
		res.status(StatusCodes.OK).json(this.deviceCache.getAll());
	};
}
