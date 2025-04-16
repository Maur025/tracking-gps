import { getAllPaginatedDefault } from '@config/service-request-default';
import ApiServiceRequest from '@models/interface/api-service-request.interface';
import {
	CreateRequest,
	DeleteRequest,
	GetAllPaginatedRequest,
	GetByIdRequest,
	UpdateRequest,
} from '@models/interface/service-request.interface';
import { delet, get, post, put } from './api-client';
import ApiResponse from '@models/dto/api-response';
import DataResponse from '@models/dto/data-response';
import { Observable } from 'rxjs';

export default abstract class AbstractApiService<R extends DataResponse> {
	constructor(protected readonly apiRequest: ApiServiceRequest) {}

	public readonly getAllPaginated = (
		request: GetAllPaginatedRequest
	): Observable<ApiResponse<R>> => {
		const localRequest: GetAllPaginatedRequest = {
			...getAllPaginatedDefault,
			...request,
		};

		const { size, page, sortBy, descending, keyword } = localRequest;

		let queryParams: string = `?size=${size}&page=${page}&sortBy=${sortBy}&descending=${descending}`;

		if (keyword) {
			queryParams += `&keyword=${keyword}`;
		}

		return get<ApiResponse<R>>(this.getUrl(queryParams));
	};

	public readonly getById = (
		request: GetByIdRequest
	): Observable<ApiResponse<R>> =>
		get<ApiResponse<R>>(`${this.getUrl()}/${request?.id}`);

	public readonly create = (
		request: CreateRequest
	): Observable<ApiResponse<R>> =>
		post<ApiResponse<R>>(this.getUrl(), request.data);

	public readonly update = (
		request: UpdateRequest
	): Observable<ApiResponse<R>> =>
		put<ApiResponse<R>>(`${this.getUrl()}/${request?.id}`, request.data);

	public readonly delete = (
		request: DeleteRequest
	): Observable<ApiResponse<R>> =>
		delet<ApiResponse<R>>(`${this.getUrl()}/${request?.id}`);

	private readonly getUrl = (queryParams: string = ''): string => {
		const { baseUrl, resource, prefix = '' } = { ...this.apiRequest };

		return `${baseUrl}/${prefix}${resource}${queryParams}`;
	};
}
