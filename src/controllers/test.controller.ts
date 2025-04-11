import TrackingResponse from '@models/dto/response/tracking-response';
import TrackService from '@services/track.service';
import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { Get, Route, Tags } from 'tsoa';

@Route('tests')
@Tags('Tests')
export default class TestController {
	@Get('/')
	public getTest(req: Request, res: Response): void {
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
			error: error => {
				console.error('OCURRIO UN ERROR EN EL CONSUMO DEL SERVICIO', error);
			},
		});
	}
}
