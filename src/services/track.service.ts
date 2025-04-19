import environment from '@config/env';
import TrackingResponse from '@models/dto/response/tracking-response';
import { singleton } from 'tsyringe';
import AbstractApiService from '../utils/abstract-api-service';
import { Observable } from 'rxjs';
import { get } from '@utils/api-client';
import { ApiResponse } from '@maur025/core-model-data';

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
			`${this.apiRequest?.baseUrl}/${this.apiRequest?.resource}?size=2&page=1`
		);
}
