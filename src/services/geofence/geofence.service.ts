import { singleton } from 'tsyringe';
import AbstractApiService from '../../utils/abstract-api-service';
import GeofenceResponse from '@models/dto/response/geofence-response';
import environment from '@config/env';

@singleton()
export default class GeofenceService extends AbstractApiService<GeofenceResponse> {
	constructor() {
		super({
			baseUrl: `${environment.BACKEND_URL}/trackingdb`,
			resource: 'geofence',
		});
	}
}
