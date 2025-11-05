import environment from '@config/env.js';
import { ApiResponse, ErrorResponse } from '@maur025/core-model-data';
import AbstractApiService from '@src/api-client/service/abstract-api-service.js';
import { get } from '@src/api-client/api-client.js';
import { handleAsArray } from '@src/api-client/service/handle-response.js';
import { catchError, map, Observable } from 'rxjs';
import { singleton } from 'tsyringe';
import { setupSections } from './setup-sections.js';
import { RouteResponse } from '../dto/response/route-response.js';

@singleton()
export default class RouteService extends AbstractApiService<RouteResponse> {
	constructor() {
		super({
			baseUrl: `${environment.BACKEND_URL}/trackingdb`,
			resource: 'routes',
		});
	}

	public readonly getAll = (): Observable<ApiResponse<RouteResponse>> =>
		get<ApiResponse<RouteResponse>>(
			`${this.apiRequest?.baseUrl}/${this.apiRequest?.resource}`,
		).pipe(
			map((response: ApiResponse<RouteResponse>) => {
				const routeResponseList: RouteResponse[] = handleAsArray(response);

				for (const routeResponse of routeResponseList) {
					setupSections(routeResponse);
				}

				response.content = routeResponseList;
				response.data = routeResponseList;

				return response;
			}),
			catchError((error: ErrorResponse) => {
				throw new Error(
					`Error ocurred in query getAll routes: ${
						typeof error?.cause === 'object'
							? JSON.stringify(error.cause)
							: error?.cause
					}`,
				);
			}),
		);
}
