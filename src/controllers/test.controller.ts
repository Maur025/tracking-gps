import ErrorResponse from '@models/dto/error-response';
import TrackingResponse from '@models/dto/response/tracking-response';
import TrackService from '@services/track.service';
import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { connect } from 'socket/client/socket-client';
import { Route, Tags } from 'tsoa';

@Route('tests')
@Tags('Tests')
export default class TestController {
	public getTest = (req: Request, res: Response): void => {
		const service = new TrackService();

		service.getAll({ size: 100 }).subscribe({
			next: (response: TrackingResponse) => {
				const data = response.content;

				res.status(StatusCodes.OK).json({
					status: 'success',
					message: 'Data retrieved successfully',
					data: data,
				});
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
