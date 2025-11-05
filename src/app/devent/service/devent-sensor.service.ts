import AbstractApiService from '@api-client/service/abstract-api-service.js';
import { singleton } from 'tsyringe';
import { DeventSensorResponse } from '../dto/response/devent-sensor-response.js';
import environment from '@config/env.js';

@singleton()
export default class DeventSensorService extends AbstractApiService<DeventSensorResponse> {
	constructor() {
		super({
			baseUrl: `${environment.BACKEND_URL}/trackingdb`,
			resource: `devent_sensors`,
		});
	}
}
