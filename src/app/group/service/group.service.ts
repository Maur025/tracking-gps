import environment from '@config/env.js';
import AbstractApiService from '@src/api-client/service/abstract-api-service.js';
import { singleton } from 'tsyringe';
import { GroupResponse } from '../dto/response/group-response.js';

@singleton()
export default class GroupService extends AbstractApiService<GroupResponse> {
	constructor() {
		super({
			baseUrl: `${environment.BACKEND_URL}/trackingdb`,
			resource: 'groups',
		});
	}
}
