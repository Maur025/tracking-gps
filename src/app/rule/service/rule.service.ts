import AbstractApiService from '@api-client/service/abstract-api-service.js';
import environment from '@config/env.js';
import { singleton } from 'tsyringe';
import { RuleResponse } from '../dto/response/rule-response.js';

@singleton()
export default class RuleService extends AbstractApiService<RuleResponse> {
	constructor() {
		super({
			baseUrl: `${environment.BACKEND_URL}/trackingdb`,
			resource: 'rules',
		});
	}
}
