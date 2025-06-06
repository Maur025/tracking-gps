import TrackingResponse from '@models/dto/response/tracking-response';
import TrackService from '@services/track.service';
import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { connect } from '@socket/client/socket-track-client';
import { inject, injectable } from 'tsyringe';
import {
	ApiResponse,
	ErrorResponse,
	MultiResponseBuilder,
} from '@maur025/core-model-data';
import DeviceCache from '@cache/device-cache';
import RouteCache from '@cache/route-cache';

@injectable()
export default class TestController {
	constructor(
		@inject(TrackService) private readonly trackService: TrackService,
		@inject(DeviceCache) private readonly deviceCache: DeviceCache,
		@inject(RouteCache) private readonly routeCache: RouteCache
	) {}

	public getTest = (req: Request, res: Response): void => {
		this.trackService.getAllPaginated({ size: 10 }).subscribe({
			next: (response: ApiResponse<TrackingResponse>) =>
				MultiResponseBuilder.builder<TrackingResponse>()
					.res(res)
					.withResponse({
						code: StatusCodes.OK,
						message: 'SUCCESS',
						data: response.content as TrackingResponse[],
					})
					.send(),
			error: (error: ErrorResponse) => {
				res.status(StatusCodes.REQUEST_TIMEOUT).json({
					detail: error.status ?? error.cause?.code,
					message: error.cause?.message ?? error.message,
					code: StatusCodes.INTERNAL_SERVER_ERROR,
				});
			},
		});
	};

	public readonly getTestTwo = (req: Request, res: Response): void => {
		res.status(StatusCodes.OK).json([{ name: 'test name' }]);
	};

	public readonly testSocket = (req: Request, res: Response): void => {
		connect();

		res.status(StatusCodes.OK).json({ message: 'Successfull' });
	};

	public readonly currentDevices = (req: Request, res: Response): void => {
		res.status(StatusCodes.OK).json(this.deviceCache.getAll());
	};

	public readonly currentRoutes = (req: Request, res: Response): void => {
		res.status(StatusCodes.OK).json(this.routeCache.getAll());
	};
}
