import AbstractApiService from '@api-client/service/abstract-api-service.js';
import { singleton } from 'tsyringe';
import { DeventResponse } from '../dto/response/devent-response.js';
import environment from '@config/env.js';

@singleton()
export default class DeventService extends AbstractApiService<DeventResponse> {
	constructor() {
		super({
			baseUrl: `${environment.BACKEND_URL}/trackingdb`,
			resource: `devents`,
		});
	}
}
