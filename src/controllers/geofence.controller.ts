import GeofenceCache from '@cache/geofence-cache';
import { inject, injectable } from 'tsyringe';
import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';

@injectable()
export default class GeofenceController {
	constructor(
		@inject(GeofenceCache) private readonly geofenceCache: GeofenceCache,
	) {}

	public readonly getAllInCache = (req: Request, res: Response): void => {
		res.status(StatusCodes.OK).json(this.geofenceCache.getAll());
	};
}
