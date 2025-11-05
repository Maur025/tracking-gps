import { singleton } from 'tsyringe';
import AbstractApiService from '../../../api-client/service/abstract-api-service.js';
import environment from '@config/env.js';
import { GeofenceResponse } from '@app/geofence/dto/response/geofence-response.js';

@singleton()
export default class GeofenceService extends AbstractApiService<GeofenceResponse> {
	constructor() {
		super({
			baseUrl: `${environment.BACKEND_URL}/trackingdb`,
			resource: 'geofences',
		});
	}
}
