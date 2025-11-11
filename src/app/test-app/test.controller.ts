import TrackService from '@app/track/service/track.service.js';
import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { inject, injectable } from 'tsyringe';
import { ErrorResponse, MultiResponseBuilder } from '@maur025/core-model-data';
import RouteCache from '@app/route/cache/route-cache.js';
import { RequestValidate } from '@app/test-app/middlewares/request-validate.interface.js';
import type { TestSchema } from '@app/test-app/schema/test.schema.js';
import ZodSwaggerGenerator from '@src/docs/swagger/zod-swagger-generator.js';
import { testPdfKit } from '@app/test-app/report/test-pdfkit.js';
import { TrackingResponse } from '@app/track/dto/response/tracking-response.js';
import DeviceCache from '@app/device/cache/device-cache.js';
import { exampleTestPublisher } from './publishers/example-test-publisher.js';

@injectable()
export default class TestController {
	constructor(
		@inject(TrackService) private readonly trackService: TrackService,
		@inject(DeviceCache) private readonly deviceCache: DeviceCache,
		@inject(RouteCache) private readonly routeCache: RouteCache,
		@inject(ZodSwaggerGenerator)
		private readonly zodSwaggerGenerator: ZodSwaggerGenerator,
	) {}

	public getTest = async (req: Request, res: Response): Promise<void> => {
		const response = await this.trackService
			.getAllPaginated({ size: 10 })
			.catch((error: ErrorResponse) => {
				res.status(StatusCodes.REQUEST_TIMEOUT).json({
					detail: error.status ?? error.cause?.code,
					message: error.cause?.message ?? error.message,
					code: StatusCodes.INTERNAL_SERVER_ERROR,
				});

				return undefined;
			});

		if (!response) {
			return;
		}

		MultiResponseBuilder.builder<TrackingResponse>()
			.res(res)
			.withResponse({
				code: StatusCodes.OK,
				message: 'SUCCESS',
				data: response.content as TrackingResponse[],
			})
			.send();
	};

	public readonly getTestTwo = (req: Request, res: Response): void => {
		res.status(StatusCodes.OK).json([{ name: 'test name' }]);
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
