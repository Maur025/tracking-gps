import environment from '@config/env';
import AbstractApiService from '@src/api-client/service/abstract-api-service';
import { singleton } from 'tsyringe';
import { GroupResponse } from '../dto/group-response';

@singleton()
export default class GroupService extends AbstractApiService<GroupResponse> {
	constructor() {
		super({
			baseUrl: `${environment.BACKEND_URL}/trackingdb`,
			resource: 'groups',
		});
	}
}
