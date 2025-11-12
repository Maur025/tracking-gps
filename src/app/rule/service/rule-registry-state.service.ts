import AbstractApiService from '@api-client/service/abstract-api-service.js';
import { singleton } from 'tsyringe';
import { RuleRegistryStateResponse } from '../dto/response/rule-registry-state-response.js';
import environment from '@config/env.js';

@singleton()
export default class RuleRegistryStateService extends AbstractApiService<RuleRegistryStateResponse> {
	constructor() {
		super({
			baseUrl: `${environment.BACKEND_URL}/trackingdb`,
			resource: 'registry_states',
		});
	}
}
