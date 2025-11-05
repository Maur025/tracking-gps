import { delet, get, post, put } from '../api-client.js';
import { Observable } from 'rxjs';
import { ApiResponse, BaseData } from '@maur025/core-model-data';
import { ApiServiceRequestSchema } from '../schema/api-service-request.schema.js';
import { GetAllPaginatedRequest } from '../dto/get-all-paginated-request.js';
import { GetByIdRequest } from '../dto/get-by-id-request.js';
import { CreateRequest } from '../dto/create-request.js';
import { UpdateRequest } from '../dto/update-request.js';
import { DeleteRequest } from '../dto/delete-request.js';

export default abstract class AbstractApiService<R extends BaseData> {
	constructor(protected readonly apiRequest: ApiServiceRequestSchema) {}

	public readonly getAllPaginated = ({
		size = 100,
		page = 0,
		sortBy = 'id',
		descending = true,
		keyword = undefined,
	}: GetAllPaginatedRequest): Observable<ApiResponse<R>> => {
		let queryParams: string = `?size=${size}&page=${page}&sortBy=${sortBy}&descending=${descending}`;

		if (keyword) {
			queryParams += `&keyword=${keyword}`;
		}

		return get<ApiResponse<R>>(this.getUrl(queryParams));
	};

	public readonly getById = ({
		id,
	}: GetByIdRequest): Observable<ApiResponse<R>> =>
		get<ApiResponse<R>>(`${this.getUrl()}/${id}`);

	public readonly create = <DA>({
		data,
	}: CreateRequest<DA>): Observable<ApiResponse<R>> =>
		post<ApiResponse<R>>(this.getUrl(), data);

	public readonly update = ({
		id,
		data,
	}: UpdateRequest): Observable<ApiResponse<R>> =>
		put<ApiResponse<R>>(`${this.getUrl()}/${id}`, data);

	public readonly delete = ({
		id,
	}: DeleteRequest): Observable<ApiResponse<R>> =>
		delet<ApiResponse<R>>(`${this.getUrl()}/${id}`);

	private readonly getUrl = (queryParams: string = ''): string => {
		const { baseUrl, resource, prefix = '' } = { ...this.apiRequest };

		return `${baseUrl}/${prefix}${resource}${queryParams}`;
	};
}
