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
import { RequestValidate } from '@models/interface/request-validate.interface';
import type { TestSchema } from '@schemas/controller/test.schema';
import ZodSwaggerGenerator from '@src/docs/swagger/zod-swagger-generator';
import { testPdfKit } from '@report/test-pdfkit';
import { exampleTestPublisher } from '@kafka/publishers/example-test-publisher';
import { TrackingResponse } from '@schemas/dto/response/track/tracking-response';

@injectable()
export default class TestController {
	constructor(
		@inject(TrackService) private readonly trackService: TrackService,
		@inject(DeviceCache) private readonly deviceCache: DeviceCache,
		@inject(RouteCache) private readonly routeCache: RouteCache,
		@inject(ZodSwaggerGenerator)
		private readonly zodSwaggerGenerator: ZodSwaggerGenerator,
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

	public readonly zodTestValidationAndInheritance = (
		req: RequestValidate<TestSchema>,
		res: Response,
	): void => {
		const { size = 0, page = 0 } = req.queryValidate ?? {};

		const result = size + page;

		res.status(StatusCodes.OK).json({
			test: 'Hola',
			params: req.params,
			body: req.body,
			query: req.query,
			result,
		});
	};

	public readonly viewJsonConfigSwagger = (req: Request, res: Response) => {
		res.json(this.zodSwaggerGenerator.getOpenApiDocument());
	};

	public readonly testingPdf = (req: Request, res: Response) => {
		testPdfKit(res);
	};

	public readonly kafkaTestExample = async (
		req: Request,
		res: Response,
	): Promise<void> => {
		await exampleTestPublisher({
			name: 'ESTE es un Nombre de Prueba + 1 numero',
		});

		res.status(StatusCodes.OK).json({
			message: 'sent successfully',
		});
	};
}
