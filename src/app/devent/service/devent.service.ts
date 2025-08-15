import AbstractApiService from '@api-client/service/abstract-api-service';
import { singleton } from 'tsyringe';
import { DeventResponse } from '../dto/devent-response';
import environment from '@config/env';

@singleton()
export default class DeventService extends AbstractApiService<DeventResponse> {
	constructor() {
		super({
			baseUrl: `${environment.BACKEND_URL}/trackingdb`,
			resource: `devents`,
		});
	}
}
