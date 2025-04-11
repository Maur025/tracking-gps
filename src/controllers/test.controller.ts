import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { Get, Route, Tags } from 'tsoa';

@Route('tests')
@Tags('Tests')
export default class TestController {
	@Get('/')
	public getTest(req: Request, res: Response): void {
		const data: object[] = [
			{ id: 1, nombre: 'prueba 1' },
			{ id: 2, nombre: 'prueba 2' },
			{ id: 3, nombre: 'prueba 3' },
		];

		res.status(StatusCodes.OK).json({
			status: 'success',
			message: 'Data retrieved successfully',
			data: data,
		});
	}
}
