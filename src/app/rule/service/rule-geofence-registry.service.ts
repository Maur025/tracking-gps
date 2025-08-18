import AbstractApiService from '@api-client/service/abstract-api-service';
import environment from '@config/env';
import { singleton } from 'tsyringe';
import { RuleGeofenceRegistryResponse } from '../dto/response/rule-geofence-registry-response';

@singleton()
export default class RuleGeofenceRegistryService extends AbstractApiService<RuleGeofenceRegistryResponse> {
	constructor() {
		super({
			baseUrl: `${environment.BACKEND_URL}/trackingdb`,
			resource: 'rule_geofence_registry',
		});
	}
}
