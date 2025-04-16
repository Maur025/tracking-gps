export interface GetAllPaginatedRequest {
	size?: number;
	page?: number;
	sortBy?: string;
	descending?: boolean;
	keyword?: string;
}

export interface GetByIdRequest {
	id: string;
}

export interface CreateRequest {
	data: object;
}

export interface UpdateRequest {
	id: string;
	data: object;
}

export interface DeleteRequest {
	id: string;
}
