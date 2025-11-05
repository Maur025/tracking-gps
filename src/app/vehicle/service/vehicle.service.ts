import AbstractApiService from '@api-client/service/abstract-api-service.js';
import { singleton } from 'tsyringe';
import { VehicleResponse } from '../dto/response/vehicle-response.js';
import environment from '@config/env.js';

@singleton()
export default class VehicleService extends AbstractApiService<VehicleResponse> {
	constructor() {
		super({
			baseUrl: `${environment.BACKEND_URL}/trackingdb`,
			resource: 'vehicles',
		});
	}
}
