import { ApiResponse, BaseData } from '@maur025/core-model-data';
import { ApiServiceRequestSchema } from '../schema/api-service-request.schema.js';
import { GetAllPaginatedRequest } from '../dto/get-all-paginated-request.js';
import { GetByIdRequest } from '../dto/get-by-id-request.js';
import { CreateRequest } from '../dto/create-request.js';
import { UpdateRequest } from '../dto/update-request.js';
import { DeleteRequest } from '../dto/delete-request.js';
import { del, get, post, put } from '@api-client/fetch-api.js';

export default abstract class AbstractApiService<R extends BaseData> {
	constructor(protected readonly apiRequest: ApiServiceRequestSchema) {}

	public readonly getAllPaginated = async ({
		size = 100,
		page = 0,
		sortBy = 'id',
		descending = true,
		keyword = undefined,
	}: GetAllPaginatedRequest): Promise<ApiResponse<R>> => {
		let queryParams: string = `?size=${size}&page=${page}&sortBy=${sortBy}&descending=${descending}`;

		if (keyword) {
			queryParams += `&keyword=${keyword}`;
		}

		return get<ApiResponse<R>>(this.getUrl(queryParams));
	};

	public readonly getById = async ({
		id,
	}: GetByIdRequest): Promise<ApiResponse<R>> =>
		get<ApiResponse<R>>(`${this.getUrl()}/${id}`);

	public readonly create = async <DA>({
		data,
	}: CreateRequest<DA>): Promise<ApiResponse<R>> =>
		post<ApiResponse<R>>(this.getUrl(), data);

	public readonly update = async ({
		id,
		data,
	}: UpdateRequest): Promise<ApiResponse<R>> =>
		put<ApiResponse<R>>(`${this.getUrl()}/${id}`, data);

	public readonly delete = async ({
		id,
	}: DeleteRequest): Promise<ApiResponse<R>> =>
		del<ApiResponse<R>>(`${this.getUrl()}/${id}`);

	private readonly getUrl = (queryParams: string = ''): string => {
		const { baseUrl, resource, prefix = '' } = { ...this.apiRequest };

		return `${baseUrl}/${prefix}${resource}${queryParams}`;
	};
}
