import ErrorResponse from '@models/dto/error-response';
import TrackingResponse from '@models/dto/response/tracking-response';
import TrackService from '@services/track.service';
import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { connect } from '@socket/client/socket-track-client';
import { Route, Tags } from 'tsoa';
import ApiResponse from '@models/dto/api-response';
import TestCmd from '@command/test.cmd';
import MultiResponseBuilder from '@models/dto/multi-response-builder';
import { inject, injectable } from 'tsyringe';

@Route('tests')
@Tags('Tests')
@injectable()
export default class TestController {
	constructor(
		@inject(TrackService) private readonly trackService: TrackService,
		@inject(TestCmd) private readonly testCmd: TestCmd
	) {}

	public getTest = (req: Request, res: Response): void => {
		this.testCmd
			.withRequest({
				testId: 'prueba',
				price: 25,
				name: 'ESTO ES UNA PRUEBA',
			})
			.execute();

		this.trackService.getAll({ size: 100 }).subscribe({
			next: (response: ApiResponse<TrackingResponse>) =>
				MultiResponseBuilder.builder<TrackingResponse>()
					.res(res)
					.withResponse({
						code: StatusCodes.OK,
						message: 'SUCCESS',
						data: response as TrackingResponse[],
					})
					.restResponse(),
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
}
