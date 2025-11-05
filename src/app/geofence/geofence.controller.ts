import GeofenceCache from '@app/geofence/cache/geofence-cache.js';
import { inject, injectable } from 'tsyringe';
import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { geofenceReport } from '@app/geofence/report/pdf-kit/geofence-report.js';
import { geofencePdfMake } from '@app/geofence/report/pdf-make/geofence-pdf-make.js';

@injectable()
export default class GeofenceController {
	constructor(
		@inject(GeofenceCache) private readonly geofenceCache: GeofenceCache,
	) {}

	public readonly getAllInCache = (req: Request, res: Response): void => {
		res.status(StatusCodes.OK).json(this.geofenceCache.getAll());
	};

	public readonly getReport = (req: Request, res: Response) => {
		geofenceReport(res);
	};

	public readonly getReportPdfMake = (req: Request, res: Response) => {
		geofencePdfMake(res);
	};
}
