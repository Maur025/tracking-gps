import ErrorResponse from '@models/dto/error-response';
import TrackingResponse from '@models/dto/response/tracking-response';
import TrackService from '@services/track.service';
import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { connect } from '@socket/client/socket-track-client';
import { Route, Tags } from 'tsoa';
import MultiResponse from '@models/dto/multi-response';
import ApiResponse from '@models/dto/api-response';
import TestCmd from 'command/test.cmd';

@Route('tests')
@Tags('Tests')
export default class TestController {
	public getTest = (req: Request, res: Response): void => {
		const service = new TrackService();
		const testCmd = new TestCmd();

		testCmd
			.withRequest({
				testId: 'prueba',
				price: 25,
				name: 'ESTO ES UNA PRUEBA',
			})
			.execute();

		service.getAll({ size: 100 }).subscribe({
			next: (response: ApiResponse<TrackingResponse>) => {
				res.status(StatusCodes.OK).json(
					MultiResponse.builder<TrackingResponse>()
						.code(StatusCodes.OK)
						.data([...(response.content as TrackingResponse[])])
						.build()
				);
			},
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
