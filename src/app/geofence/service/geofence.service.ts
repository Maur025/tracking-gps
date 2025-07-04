import { singleton } from 'tsyringe';
import AbstractApiService from '../../../utils/abstract-api-service';
import environment from '@config/env';
import { GeofenceResponse } from '@app/geofence/dto/geofence-response';

@singleton()
export default class GeofenceService extends AbstractApiService<GeofenceResponse> {
	constructor() {
		super({
			baseUrl: `${environment.BACKEND_URL}/trackingdb`,
			resource: 'geofences',
		});
	}
}
