import { GetAllRequest } from '@models/interface/service-request.interface';

export const getAllRequest: GetAllRequest = {
	size: 100,
	page: 1,
	sortBy: 'id',
	descending: true,
};
