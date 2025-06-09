import environment from '@config/env';
import { GroupResponse } from '@models/dto/response/group-response';
import AbstractApiService from '@utils/abstract-api-service';
import { singleton } from 'tsyringe';

@singleton()
export default class GroupService extends AbstractApiService<GroupResponse> {
	constructor() {
		super({
			baseUrl: `${environment.BACKEND_URL}/trackingdb`,
			resource: 'groups',
		});
	}
}
