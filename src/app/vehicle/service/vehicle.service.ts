import AbstractApiService from '@api-client/service/abstract-api-service';
import { singleton } from 'tsyringe';
import { VehicleResponse } from '../dto/response/vehicle-response';
import environment from '@config/env';

@singleton()
export default class VehicleService extends AbstractApiService<VehicleResponse> {
	constructor() {
		super({
			baseUrl: `${environment.BACKEND_URL}/trackingdb`,
			resource: 'vehicles',
		});
	}
}
