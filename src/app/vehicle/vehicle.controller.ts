import { inject, singleton } from 'tsyringe';
import VehicleCache from './cache/vehicle-cache';
import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';

@singleton()
export default class VehicleController {
	constructor(
		@inject(VehicleCache) private readonly vehicleCache: VehicleCache,
	) {}

	public readonly getAllInCache = (req: Request, res: Response) => {
		res.status(StatusCodes.OK).json(this.vehicleCache.getAll());
	};
}
