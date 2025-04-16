import { GetAllPaginatedRequest } from '@models/interface/service-request.interface';

export const getAllPaginatedDefault: GetAllPaginatedRequest = {
	size: 100,
	page: 1,
	sortBy: 'id',
	descending: true,
};
