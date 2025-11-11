import environment from '@config/env.js';
import { ApiResponse, ErrorResponse } from '@maur025/core-model-data';
import AbstractApiService from '@src/api-client/service/abstract-api-service.js';
import { handleAsArray } from '@src/api-client/service/handle-response.js';
import { singleton } from 'tsyringe';
import { setupSections } from './setup-sections.js';
import { RouteResponse } from '../dto/response/route-response.js';
import { get } from '@api-client/fetch-api.js';

@singleton()
export default class RouteService extends AbstractApiService<RouteResponse> {
	constructor() {
		super({
			baseUrl: `${environment.BACKEND_URL}/trackingdb`,
			resource: 'routes',
		});
	}

	public readonly getAll = async (): Promise<ApiResponse<RouteResponse>> => {
		const response = await get<ApiResponse<RouteResponse>>(
			`${this.apiRequest?.baseUrl}/${this.apiRequest?.resource}`,
		).catch((error: ErrorResponse) => {
			throw new Error(
				`Error occurred in query getAll routes: ${
					typeof error?.cause === 'object'
						? JSON.stringify(error.cause)
						: error?.cause
				}`,
			);
		});

		const routeResponseList: RouteResponse[] = handleAsArray(response);

		for (const routeResponse of routeResponseList) {
			setupSections(routeResponse);
		}

		response.content = routeResponseList;
		response.data = routeResponseList;

		return response;
	};
}
