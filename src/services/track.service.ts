import environment from '@config/env';
import { getAllRequest } from '@config/service-request-default';
import ApiResponse from '@models/dto/api-response';
import TrackingResponse from '@models/dto/response/tracking-response';
import { GetAllRequest } from '@models/interface/service-request.interface';
import { get } from '@utils/api-client';
import { Observable } from 'rxjs';
import { singleton } from 'tsyringe';
@singleton()
export default class TrackService {
	private readonly baseUrl = `${environment.BACKEND_URL}/trackingdb`;
	private readonly resource = 'tracks';

	public readonly getAll = (
		request: GetAllRequest
	): Observable<ApiResponse<TrackingResponse>> => {
		const localRequest: GetAllRequest = { ...getAllRequest, ...request };
		const { size, page, sortBy, descending, keyword } = localRequest;

		let queryParams: string = `?size=${size}&page=${page}&sortBy=${sortBy}&descending=${descending}`;

		if (keyword) {
			queryParams += `&keyword=${keyword}`;
		}

		return get<ApiResponse<TrackingResponse>>(
			`${this.baseUrl}/${this.resource}${queryParams}`
		);
	};
}
