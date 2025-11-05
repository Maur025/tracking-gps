import environment from '@config/env.js';
import { singleton } from 'tsyringe';
import { Observable } from 'rxjs';
import { get } from '@src/api-client/api-client.js';
import { ApiResponse } from '@maur025/core-model-data';
import { TrackingResponse } from '../dto/response/tracking-response.js';
import AbstractApiService from '@api-client/service/abstract-api-service.js';

@singleton()
export default class TrackService extends AbstractApiService<TrackingResponse> {
	constructor() {
		super({
			baseUrl: `${environment.BACKEND_URL}/trackingdb`,
			resource: 'tracks',
		});
	}

	public readonly getAllCustom = (): Observable<
		ApiResponse<TrackingResponse>
	> =>
		get<ApiResponse<TrackingResponse>>(
			`${this.apiRequest?.baseUrl}/${this.apiRequest?.resource}?size=2&page=1`,
		);
}
