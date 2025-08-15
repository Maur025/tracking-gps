import AbstractApiService from '@api-client/service/abstract-api-service';
import { singleton } from 'tsyringe';
import { DeventSensorResponse } from '../dto/devent-sensor-response';
import environment from '@config/env';

@singleton()
export default class DeventSensorService extends AbstractApiService<DeventSensorResponse> {
	constructor() {
		super({
			baseUrl: `${environment.BACKEND_URL}/trackingdb`,
			resource: `devent_sensors`,
		});
	}
}
