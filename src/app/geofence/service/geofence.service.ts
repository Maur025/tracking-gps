import { singleton } from 'tsyringe';
import AbstractApiService from '../../../api-client/service/abstract-api-service';
import environment from '@config/env';
import { GeofenceResponse } from '@app/geofence/dto/response/geofence-response';

@singleton()
export default class GeofenceService extends AbstractApiService<GeofenceResponse> {
	constructor() {
		super({
			baseUrl: `${environment.BACKEND_URL}/trackingdb`,
			resource: 'geofences',
		});
	}
}
